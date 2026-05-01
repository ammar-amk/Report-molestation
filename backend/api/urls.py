from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import (
    CaseNoteCreateView,
    ComplaintDetailView,
    ComplaintListCreateView,
    DashboardStatsView,
    UserListView,
)

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('complaints/', ComplaintListCreateView.as_view(), name='complaint-list-create'),
    path('complaints/<int:pk>/', ComplaintDetailView.as_view(), name='complaint-detail'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('notes/', CaseNoteCreateView.as_view(), name='note-create'),
    path('users/', UserListView.as_view(), name='user-list'),
]
