from django.conf import settings
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AuditLog, CaseNote, Complaint, User
from .permissions import IsAdmin, IsAdminOrOfficer
from .serializers import (
    CaseNoteSerializer,
    ComplaintListSerializer,
    ComplaintSerializer,
    UserSerializer,
)


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class ComplaintListCreateView(APIView):
    """GET requires staff; POST is open to all (anonymous reporters)."""

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAdminOrOfficer()]

    def get(self, request):
        complaints = Complaint.objects.all()
        serializer = ComplaintListSerializer(complaints, many=True)
        return Response(serializer.data)

    def post(self, request):
        evidence = request.FILES.get('evidence_file')
        if evidence:
            if evidence.content_type not in settings.ALLOWED_EVIDENCE_TYPES:
                return Response(
                    {'error': 'Invalid file type. Allowed: JPEG, PNG, PDF, MP4.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = ComplaintSerializer(data=request.data)
        if serializer.is_valid():
            complaint = serializer.save()
            AuditLog.objects.create(
                user=None,
                action='complaint_submitted',
                complaint=complaint,
                ip_address=get_client_ip(request),
                details=f'Reporter type: {complaint.reporter_type}',
            )
            return Response(
                {'id': complaint.id, 'message': 'Report submitted successfully.'},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ComplaintDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminOrOfficer]
    serializer_class = ComplaintSerializer
    queryset = Complaint.objects.all()

    def perform_update(self, serializer):
        complaint = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            action='complaint_updated',
            complaint=complaint,
            ip_address=get_client_ip(self.request),
            details=f'Updated by {self.request.user.username}',
        )


class DashboardStatsView(APIView):
    permission_classes = [IsAdminOrOfficer]

    def get(self, request):
        return Response({
            'total': Complaint.objects.count(),
            'new': Complaint.objects.filter(status='new').count(),
            'under_review': Complaint.objects.filter(status='under_review').count(),
            'resolved': Complaint.objects.filter(status='resolved').count(),
            'rejected': Complaint.objects.filter(status='rejected').count(),
        })


class CaseNoteCreateView(generics.CreateAPIView):
    permission_classes = [IsAdminOrOfficer]
    serializer_class = CaseNoteSerializer

    def perform_create(self, serializer):
        note = serializer.save(officer=self.request.user)
        AuditLog.objects.create(
            user=self.request.user,
            action='note_added',
            complaint=note.complaint,
            ip_address=get_client_ip(self.request),
            details=f'Note added by {self.request.user.username}',
        )


class UserListView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = UserSerializer
    queryset = User.objects.all()
