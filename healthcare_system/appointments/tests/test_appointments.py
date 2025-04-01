from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError
from appointments.models import Appointment
from appointments.serializers import AppointmentSerializer
from patients.tests.factories import PatientFactory
from doctors.tests.factories import DoctorFactory, AvailabilityFactory

class AppointmentSerializerTests(TestCase):
    def setUp(self):
        self.patient = PatientFactory()
        self.doctor = DoctorFactory()
        self.availability = AvailabilityFactory(
            doctor=self.doctor,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=1, hours=2)
        )

    def test_appointment_within_availability(self):
        data = {
            'patient': self.patient.id,
            'doctor': self.doctor.id,
            'datetime': self.availability.start_time + timedelta(minutes=30),
            'status': 'pending'
        }
        serializer = AppointmentSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_appointment_outside_availability(self):
        data = {
            'patient': self.patient.id,
            'doctor': self.doctor.id,
            'datetime': self.availability.start_time - timedelta(hours=1),
            'status': 'pending'
        }
        serializer = AppointmentSerializer(data=data)
        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Doctor is not available", str(cm.exception))

    def test_appointment_conflict(self):
        # Create an existing appointment
        Appointment.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            datetime=self.availability.start_time + timedelta(minutes=30),
            status='pending'
        )
        # Try to create a conflicting appointment
        data = {
            'patient': self.patient.id,
            'doctor': self.doctor.id,
            'datetime': self.availability.start_time + timedelta(minutes=30),
            'status': 'pending'
        }
        serializer = AppointmentSerializer(data=data)
        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Doctor already has an appointment", str(cm.exception))

    def test_appointment_invalid_time(self):
        data = {
            'patient': self.patient.id,
            'doctor': self.doctor.id,
            'datetime': self.availability.start_time + timedelta(minutes=15),  # Not on the hour or half-hour
            'status': 'pending'
        }
        serializer = AppointmentSerializer(data=data)
        with self.assertRaises(ValidationError) as cm:
            serializer.is_valid(raise_exception=True)
        self.assertIn("Appointments must start on the hour or half-hour", str(cm.exception))
