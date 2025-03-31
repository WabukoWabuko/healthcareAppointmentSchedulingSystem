from django.db import models
from users.models import CustomUser

class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='doctor')
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)  # Automatically set on creation

    def __str__(self):
        return self.name

class Availability(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='availabilities')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.doctor.name}: {self.start_time} - {self.end_time}"
