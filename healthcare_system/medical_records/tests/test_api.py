from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.tests.factories import CustomUserFactory
from patients.tests.factories import PatientFactory
from doctors.tests.factories import DoctorFactory
from appointments.tests.factories import AppointmentFactory
from medical_records.tests.factories import MedicalRecordFactory
from rest_framework_simplejwt.tokens import AccessToken

class MedicalRecordAPITests(APITestCase):
    def setUp(self):
        self.patient_user = CustomUserFactory(role='patient')
        self.doctor_user = CustomUserFactory(role='doctor')
        self.patient = PatientFactory(user=self.patient_user)
        self.doctor = DoctorFactory(user=self.doctor_user)
        self.appointment = AppointmentFactory(patient=self.patient, doctor=self.doctor)
        self.medical_record = MedicalRecordFactory(
            patient=self.patient,
            appointment=self.appointment,
            diagnosis="Initial diagnosis",
            treatment="Initial treatment"
        )
        self.patient_token = str(AccessToken.for_user(self.patient_user))
        self.doctor_token = str(AccessToken.for_user(self.doctor_user))

    def test_patient_view_own_medical_record(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.patient_token}')
        response = self.client.get(reverse('medicalrecord-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_doctor_update_medical_record(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.doctor_token}')
        data = {'notes': 'Updated by doctor', 'diagnosis': 'Updated diagnosis', 'treatment': 'Updated treatment'}
        response = self.client.patch(
            reverse('medicalrecord-detail', args=[self.medical_record.id]),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.medical_record.refresh_from_db()
        self.assertEqual(self.medical_record.notes, 'Updated by doctor')

    def test_patient_cannot_update_medical_record(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.patient_token}')
        data = {'notes': 'Updated by patient', 'diagnosis': 'Updated diagnosis', 'treatment': 'Updated treatment'}
        response = self.client.patch(
            reverse('medicalrecord-detail', args=[self.medical_record.id]),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
