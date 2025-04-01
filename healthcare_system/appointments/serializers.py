from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer
from doctors.models import Availability
from django.utils import timezone
from datetime import timedelta

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'datetime', 'status']

    def validate(self, data):
        doctor = data.get('doctor')
        appointment_time = data.get('datetime')

        # Ensure the appointment time is in the future
        if appointment_time <= timezone.now():
            raise serializers.ValidationError("Appointment time must be in the future.")

        # Check if the doctor has an availability slot that covers the appointment time
        availabilities = Availability.objects.filter(
            doctor=doctor,
            start_time__lte=appointment_time,
            end_time__gte=appointment_time
        )
        if not availabilities.exists():
            raise serializers.ValidationError("Doctor is not available at the selected time.")

        # Assume appointments are 30 minutes long
        appointment_end = appointment_time + timedelta(minutes=30)

        # Check for overlapping appointments
        overlapping_appointments = Appointment.objects.filter(
            doctor=doctor,
            datetime__lt=appointment_end,
            datetime__gte=appointment_time - timedelta(minutes=30)
        ).exclude(id=self.instance.id if self.instance else None)

        if overlapping_appointments.exists():
            raise serializers.ValidationError("Doctor already has an appointment at this time.")

        return data
