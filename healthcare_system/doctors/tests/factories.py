import factory
from doctors.models import Doctor, Availability
from users.tests.factories import CustomUserFactory
from django.utils import timezone
from datetime import timedelta

class DoctorFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Doctor

    user = factory.SubFactory(CustomUserFactory, role='doctor')
    name = factory.Faker('name')
    specialization = factory.Faker('word')

class AvailabilityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Availability

    doctor = factory.SubFactory(DoctorFactory)
    start_time = factory.LazyFunction(lambda: timezone.now() + timedelta(days=1))
    end_time = factory.LazyAttribute(lambda obj: obj.start_time + timedelta(hours=1))
