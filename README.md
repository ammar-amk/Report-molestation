# Confidential Incident Reporting Portal

A secure internal web application for confidential incident reporting and case management.

## Tech Stack
- **Backend**: Django 4.2 + Django REST Framework + SimpleJWT
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: SQLite (development)

## Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py create_default_admin
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Default Credentials
- **Admin**: username: `admin` / password: `Admin@Portal2024`
- **Officer**: username: `officer1` / password: `Officer@2024`

## Access
- Complaint Form: http://localhost:5173/
- Admin Login: http://localhost:5173/admin-login
- Admin Dashboard: http://localhost:5173/admin
- Django Admin: http://localhost:8000/admin/

## Security Notes
- Change all default passwords before any real use
- Use PostgreSQL and HTTPS in production
- Set DEBUG=False and proper SECRET_KEY in production
