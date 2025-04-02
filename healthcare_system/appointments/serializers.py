from rest_framework import serializers
from .models import Appointment
from doctors.models import Availability
from django.utils import timezone
from datetime import timedelta

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'datetime', 'status']

    def validate(self, data):
        # Ensure the appointment time is on the hour or half-hour
        appointment_time = data['datetime']
        if appointment_time.minute not in [0, 30]:
            raise serializers.ValidationError("Appointments must start on the hour or half-hour.")

        # Check if the doctor is available at the requested time
        doctor = data['doctor']
        appointment_start = data['datetime']
        appointment_end = appointment_start + timedelta(minutes=30)

        # Check for doctor availability
        available_slots = Availability.objects.filter(
            doctor=doctor,
            start_time__lte=appointment_start,
            end_time__gte=appointment_end
        )
        if not available_slots.exists():
            raise serializers.ValidationError("Doctor is not available at the requested time.")

        # Check for overlapping appointments
        overlapping_appointments = Appointment.objects.filter(
            doctor=doctor,
            datetime__gte=appointment_start,
            datetime__lt=appointment_end
        ).exclude(id=self.instance.id if self.instance else None)
        if overlapping_appointments.exists():
            raise serializers.ValidationError("Doctor already has an appointment at this time.")

        return data
