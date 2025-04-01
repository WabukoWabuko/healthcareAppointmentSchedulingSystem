from django.test import TestCase
from rest_framework.exceptions import ValidationError
from medical_records.models import MedicalRecord
from medical_records.serializers import MedicalRecordSerializer
from patients.tests.factories import PatientFactory
from appointments.tests.factories import AppointmentFactory

class MedicalRecordSerializerTests(TestCase):
    def setUp(self):
        self.patient = PatientFactory()
        self.appointment = AppointmentFactory(patient=self.patient)

    def test_create_medical_record(self):
        data = {
            'patient': self.patient.id,
            'appointment': self.appointment.id,
            'diagnosis': 'Hypertension',
            'treatment': 'Prescribed medication',
            'notes': 'Follow up in 1 month'
        }
        serializer = MedicalRecordSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        medical_record = serializer.save()
        self.assertEqual(medical_record.diagnosis, 'Hypertension')

    def test_missing_diagnosis(self):
        data = {
            'patient': self.patient.id,
            'appointment': self.appointment.id,
            'treatment': 'Prescribed medication',
            'notes': 'Follow up in 1 month'
        }
        serializer = MedicalRecordSerializer(data=data)
        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Diagnosis is required", str(cm.exception))

    def test_notes_too_long(self):
        data = {
            'patient': self.patient.id,
            'appointment': self.appointment.id,
            'diagnosis': 'Hypertension',
            'treatment': 'Prescribed medication',
            'notes': 'a' * 1001  # Exceeds 1000 characters
        }
        serializer = MedicalRecordSerializer(data=data)
        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Notes cannot exceed 1000 characters", str(cm.exception))
