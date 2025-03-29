from django.db import models

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('canceled', 'Canceled'),
        ('completed', 'Completed'),
    ]
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name="appointments")
    datetime = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.name} with {self.doctor.name} at {self.datetime}"
