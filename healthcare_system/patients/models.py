from django.db import models
from users.models import CustomUser

class Patient(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='patient')
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    insurance_id = models.CharField(max_length=50, unique=True, blank=True)

    def set_insurance_id(self, insurance_id):
        self.insurance_id = insurance_id
        self.save()

    def __str__(self):
        return self.name
