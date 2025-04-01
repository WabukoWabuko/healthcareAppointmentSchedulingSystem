from django.db import models
from patients.models import Patient
from doctors.models import Doctor

class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ], default='pending')

    def __str__(self):
        return f"Appointment with {self.doctor.name} on {self.datetime}"

    class Meta:
        indexes = [
            models.Index(fields=['datetime'], name='appointment_datetime_idx'),
        ]
