from django.test import TestCase
from patients.models import Patient
from patients.tests.factories import PatientFactory

class PatientTests(TestCase):
    def test_create_patient(self):
        patient = PatientFactory(name='John Doe', insurance_id='INS001')
        self.assertEqual(patient.name, 'John Doe')
        self.assertEqual(patient.insurance_id, 'INS001')

    def test_set_insurance_id(self):
        patient = PatientFactory(insurance_id='INS002')
        patient.set_insurance_id('INS003')
        self.assertEqual(patient.insurance_id, 'INS003')
