from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.tests.factories import CustomUserFactory
from doctors.tests.factories import DoctorFactory, AvailabilityFactory
from rest_framework_simplejwt.tokens import AccessToken
from django.utils import timezone
from datetime import timedelta

class DoctorAPITests(APITestCase):
    def setUp(self):
        self.admin_user = CustomUserFactory(role='admin')
        self.doctor_user = CustomUserFactory(role='doctor')
        self.patient_user = CustomUserFactory(role='patient')
        self.doctor = DoctorFactory(user=self.doctor_user)
        self.availability = AvailabilityFactory(doctor=self.doctor)
        self.admin_token = str(AccessToken.for_user(self.admin_user))
        self.doctor_token = str(AccessToken.for_user(self.doctor_user))
        self.patient_token = str(AccessToken.for_user(self.patient_user))

    def test_admin_list_doctors(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get(reverse('doctor-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patient_list_doctors(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.patient_token}')
        response = self.client.get(reverse('doctor-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_doctor_list_own_availability(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.doctor_token}')
        response = self.client.get(reverse('availability-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
