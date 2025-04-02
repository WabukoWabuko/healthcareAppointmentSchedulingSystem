from django.test import TestCase
from doctors.models import Doctor, Availability
from doctors.tests.factories import DoctorFactory, AvailabilityFactory
from django.utils import timezone
from datetime import timedelta

class DoctorTests(TestCase):
    def test_create_doctor(self):
        doctor = DoctorFactory(name='Dr. Smith', specialization='Cardiology')
        self.assertEqual(doctor.name, 'Dr. Smith')
        self.assertEqual(doctor.specialization, 'Cardiology')

class AvailabilityTests(TestCase):
    def test_create_availability(self):
        availability = AvailabilityFactory(
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=1, hours=1)
        )
        self.assertTrue(availability.end_time > availability.start_time)
