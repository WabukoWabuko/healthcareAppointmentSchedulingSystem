import factory
from medical_records.models import MedicalRecord
from patients.tests.factories import PatientFactory
from appointments.tests.factories import AppointmentFactory

class MedicalRecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MedicalRecord

    patient = factory.SubFactory(PatientFactory)
    appointment = factory.SubFactory(AppointmentFactory)
    diagnosis = factory.Faker('sentence')
    treatment = factory.Faker('sentence')
    notes = factory.Faker('paragraph')
