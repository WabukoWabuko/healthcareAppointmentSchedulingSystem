from cryptography.fernet import Fernet
from django.db import models
from django.conf import settings

class Patient(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    insurance_id = models.BinaryField()  # Store encrypted
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_insurance_id(self, insurance_id):
        fernet = Fernet(settings.ENCRYPTION_KEY)
        self.insurance_id = fernet.encrypt(insurance_id.encode())

    def get_insurance_id(self):
        fernet = Fernet(settings.ENCRYPTION_KEY)
        return fernet.decrypt(self.insurance_id).decode()

    def __str__(self):
        return self.name
