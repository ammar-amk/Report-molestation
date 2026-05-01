from django.contrib import admin
from .models import AuditLog, CaseNote, Complaint, User


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['id', 'reporter_type', 'accused_name', 'status', 'priority', 'created_at']
    list_filter = ['status', 'priority', 'reporter_type']
    search_fields = ['accused_name', 'description', 'reporter_name']


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_active']
    list_filter = ['role']


@admin.register(CaseNote)
class CaseNoteAdmin(admin.ModelAdmin):
    list_display = ['complaint', 'officer', 'created_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'user', 'complaint', 'ip_address', 'timestamp']
    list_filter = ['action']
    readonly_fields = ['user', 'action', 'complaint', 'ip_address', 'timestamp', 'details']
