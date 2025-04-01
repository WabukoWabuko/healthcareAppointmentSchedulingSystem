from django.db import models
from users.models import CustomUser

class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        indexes = [
            models.Index(fields=['user'], name='doctor_user_idx'),
        ]

class Availability(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"Availability for {self.doctor.name} from {self.start_time} to {self.end_time}"

    class Meta:
        indexes = [
            models.Index(fields=['start_time'], name='availability_start_time_idx'),
            models.Index(fields=['end_time'], name='availability_end_time_idx'),
        ]
