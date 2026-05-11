from django.db import migrations, models
from django_cryptography.fields import encrypt


def copy_sensitive_fields_to_encrypted(apps, schema_editor):
    Complaint = apps.get_model('api', 'Complaint')
    for complaint in Complaint.objects.all().iterator():
        complaint.reporter_name_encrypted = complaint.reporter_name or ''
        complaint.matric_or_staff_id_encrypted = complaint.matric_or_staff_id or ''
        complaint.contact_encrypted = complaint.contact or ''
        complaint.accused_name_encrypted = complaint.accused_name or ''
        complaint.department_encrypted = complaint.department or ''
        complaint.location_encrypted = complaint.location or ''
        complaint.description_encrypted = complaint.description or ''
        complaint.witnesses_encrypted = complaint.witnesses or ''
        complaint.save(
            update_fields=[
                'reporter_name_encrypted',
                'matric_or_staff_id_encrypted',
                'contact_encrypted',
                'accused_name_encrypted',
                'department_encrypted',
                'location_encrypted',
                'description_encrypted',
                'witnesses_encrypted',
            ]
        )


def copy_sensitive_fields_back_to_plain(apps, schema_editor):
    Complaint = apps.get_model('api', 'Complaint')
    for complaint in Complaint.objects.all().iterator():
        complaint.reporter_name = complaint.reporter_name_encrypted or ''
        complaint.matric_or_staff_id = complaint.matric_or_staff_id_encrypted or ''
        complaint.contact = complaint.contact_encrypted or ''
        complaint.accused_name = complaint.accused_name_encrypted or ''
        complaint.department = complaint.department_encrypted or ''
        complaint.location = complaint.location_encrypted or ''
        complaint.description = complaint.description_encrypted or ''
        complaint.witnesses = complaint.witnesses_encrypted or ''
        complaint.save(
            update_fields=[
                'reporter_name',
                'matric_or_staff_id',
                'contact',
                'accused_name',
                'department',
                'location',
                'description',
                'witnesses',
            ]
        )


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='complaint',
            name='reporter_name_encrypted',
            field=encrypt(models.CharField(blank=True, default='', max_length=200)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='complaint',
            name='matric_or_staff_id_encrypted',
            field=encrypt(models.CharField(blank=True, default='', max_length=100)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='complaint',
            name='contact_encrypted',
            field=encrypt(models.CharField(blank=True, default='', max_length=200)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='complaint',
            name='accused_name_encrypted',
            field=encrypt(models.CharField(default='', max_length=200)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='complaint',
            name='department_encrypted',
            field=encrypt(models.CharField(default='', max_length=200)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='complaint',
            name='location_encrypted',
            field=encrypt(models.CharField(default='', max_length=300)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='complaint',
            name='description_encrypted',
            field=encrypt(models.TextField(default='')),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='complaint',
            name='witnesses_encrypted',
            field=encrypt(models.TextField(blank=True, default='')),
            preserve_default=False,
        ),
        migrations.RunPython(
            copy_sensitive_fields_to_encrypted,
            copy_sensitive_fields_back_to_plain,
        ),
        migrations.RemoveField(model_name='complaint', name='reporter_name'),
        migrations.RemoveField(model_name='complaint', name='matric_or_staff_id'),
        migrations.RemoveField(model_name='complaint', name='contact'),
        migrations.RemoveField(model_name='complaint', name='accused_name'),
        migrations.RemoveField(model_name='complaint', name='department'),
        migrations.RemoveField(model_name='complaint', name='location'),
        migrations.RemoveField(model_name='complaint', name='description'),
        migrations.RemoveField(model_name='complaint', name='witnesses'),
        migrations.RenameField(
            model_name='complaint',
            old_name='reporter_name_encrypted',
            new_name='reporter_name',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='matric_or_staff_id_encrypted',
            new_name='matric_or_staff_id',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='contact_encrypted',
            new_name='contact',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='accused_name_encrypted',
            new_name='accused_name',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='department_encrypted',
            new_name='department',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='location_encrypted',
            new_name='location',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='description_encrypted',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='complaint',
            old_name='witnesses_encrypted',
            new_name='witnesses',
        ),
    ]
