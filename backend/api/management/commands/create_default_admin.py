from django.core.management.base import BaseCommand
from api.models import User


class Command(BaseCommand):
    help = 'Create default admin and officer accounts'

    def handle(self, *args, **options):
        admin_user, created = User.objects.get_or_create(username='admin')
        if created:
            admin_user.set_password('Admin@Portal2024')
            admin_user.role = 'admin'
            admin_user.is_superuser = True
            admin_user.is_staff = True
            admin_user.save()
            self.stdout.write(self.style.SUCCESS('Created admin user'))
        else:
            self.stdout.write('Admin user already exists, skipping.')

        officer, created = User.objects.get_or_create(username='officer1')
        if created:
            officer.set_password('Officer@2024')
            officer.role = 'officer'
            officer.is_staff = True
            officer.save()
            self.stdout.write(self.style.SUCCESS('Created officer1 user'))
        else:
            self.stdout.write('officer1 user already exists, skipping.')
