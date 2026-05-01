from rest_framework import serializers
from .models import Complaint, CaseNote, User


class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'status', 'priority']


class ComplaintListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['id', 'reporter_type', 'accused_name', 'status', 'priority', 'created_at', 'department']


class CaseNoteSerializer(serializers.ModelSerializer):
    officer_username = serializers.CharField(source='officer.username', read_only=True)

    class Meta:
        model = CaseNote
        fields = ['id', 'complaint', 'officer', 'officer_username', 'note', 'created_at']
        read_only_fields = ['id', 'officer', 'officer_username', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
