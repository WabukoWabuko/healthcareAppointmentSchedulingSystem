from django.db import models
from users.models import CustomUser

class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    insurance_id = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

    def set_insurance_id(self, insurance_id):
        self.insurance_id = insurance_id
        self.save()

    class Meta:
        indexes = [
            models.Index(fields=['user'], name='patient_user_idx'),
        ]
