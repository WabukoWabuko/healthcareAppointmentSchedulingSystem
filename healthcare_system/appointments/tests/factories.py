import factory
from appointments.models import Appointment
from patients.tests.factories import PatientFactory
from doctors.tests.factories import DoctorFactory, AvailabilityFactory
from django.utils import timezone
from datetime import timedelta

class AppointmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Appointment

    patient = factory.SubFactory(PatientFactory)
    doctor = factory.SubFactory(DoctorFactory)
    datetime = factory.LazyFunction(lambda: timezone.now() + timedelta(days=1, hours=1))
    status = 'pending'
