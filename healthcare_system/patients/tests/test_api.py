from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.tests.factories import CustomUserFactory
from patients.tests.factories import PatientFactory
from rest_framework_simplejwt.tokens import AccessToken

class PatientAPITests(APITestCase):
    def setUp(self):
        self.admin_user = CustomUserFactory(role='admin')
        self.patient_user = CustomUserFactory(role='patient')
        self.patient = PatientFactory(user=self.patient_user)
        self.admin_token = str(AccessToken.for_user(self.admin_user))
        self.patient_token = str(AccessToken.for_user(self.patient_user))

    def test_admin_list_patients(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get(reverse('patient-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_patient_view_own_profile(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.patient_token}')
        response = self.client.get(reverse('patient-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['email'], self.patient.email)
