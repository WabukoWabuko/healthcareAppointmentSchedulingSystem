from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from users.tests.factories import CustomUserFactory
from patients.tests.factories import PatientFactory
from doctors.tests.factories import DoctorFactory, AvailabilityFactory
from rest_framework_simplejwt.tokens import AccessToken

class AppointmentAPITests(APITestCase):
    def setUp(self):
        # Create users
        self.patient_user = CustomUserFactory(role='patient')
        self.doctor_user = CustomUserFactory(role='doctor')
        self.admin_user = CustomUserFactory(role='admin')
        # Create patient and doctor
        self.patient = PatientFactory(user=self.patient_user)
        self.doctor = DoctorFactory(user=self.doctor_user)
        # Create availability
        self.availability = AvailabilityFactory(
            doctor=self.doctor,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=1, hours=2)
        )
        # Generate tokens
        self.patient_token = str(AccessToken.for_user(self.patient_user))
        self.doctor_token = str(AccessToken.for_user(self.doctor_user))
        self.admin_token = str(AccessToken.for_user(self.admin_user))

    def test_create_appointment_as_patient(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.patient_token}')
        data = {
            'patient': self.patient.id,
            'doctor': self.doctor.id,
            'datetime': (self.availability.start_time + timedelta(minutes=30)).isoformat(),
            'status': 'pending'
        }
        response = self.client.post(reverse('appointment-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'pending')

    def test_create_appointment_outside_availability(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.patient_token}')
        data = {
            'patient': self.patient.id,
            'doctor': self.doctor.id,
            'datetime': (self.availability.start_time - timedelta(hours=1)).isoformat(),
            'status': 'pending'
        }
        response = self.client.post(reverse('appointment-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Doctor is not available", str(response.data))
