from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin/Director'),
        ('officer', 'Case Officer'),
        ('reporter', 'Reporter'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='reporter')


class Complaint(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('under_review', 'Under Review'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    REPORTER_TYPE_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('anonymous', 'Anonymous'),
    ]
    ACCUSED_TYPE_CHOICES = [
        ('staff', 'Staff'),
        ('student', 'Student'),
    ]

    reporter_type = models.CharField(max_length=20, choices=REPORTER_TYPE_CHOICES)
    reporter_name = models.CharField(max_length=200, blank=True)
    matric_or_staff_id = models.CharField(max_length=100, blank=True)
    contact = models.CharField(max_length=200, blank=True)
    accused_name = models.CharField(max_length=200)
    accused_type = models.CharField(max_length=20, choices=ACCUSED_TYPE_CHOICES)
    department = models.CharField(max_length=200)
    incident_date = models.DateField()
    location = models.CharField(max_length=300)
    description = models.TextField()
    witnesses = models.TextField(blank=True)
    evidence_file = models.FileField(upload_to='evidence/', blank=True, null=True)
    consent = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    assigned_officer = models.ForeignKey(
        'User', null=True, blank=True, on_delete=models.SET_NULL, related_name='assigned_cases'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Case #{self.id} - {self.accused_name}"


class CaseNote(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='notes')
    officer = models.ForeignKey('User', on_delete=models.CASCADE)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Note on Case #{self.complaint_id} by {self.officer.username}"


class AuditLog(models.Model):
    user = models.ForeignKey('User', null=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=200)
    complaint = models.ForeignKey(Complaint, null=True, on_delete=models.SET_NULL)
    ip_address = models.GenericIPAddressField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(blank=True)

    def __str__(self):
        return f"{self.action} at {self.timestamp}"
