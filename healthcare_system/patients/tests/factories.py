import factory
from patients.models import Patient
from users.tests.factories import CustomUserFactory

class PatientFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Patient

    user = factory.SubFactory(CustomUserFactory, role='patient')
    name = factory.Faker('name')
    email = factory.Faker('email')
    phone = factory.Faker('phone_number')
    insurance_id = factory.Sequence(lambda n: f"INS{n:03d}")
