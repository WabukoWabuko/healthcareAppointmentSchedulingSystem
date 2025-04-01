from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer
from doctors.models import Availability, Doctor
from patients.models import Patient
from django.utils import timezone
from datetime import timedelta

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'datetime', 'status']

    def validate_datetime(self, value):
        # Ensure the appointment time is on the hour or half-hour
        minutes = value.minute
        if minutes not in [0, 30]:
            raise serializers.ValidationError("Appointments must start on the hour or half-hour (e.g., 10:00 or 10:30).")
        return value

    def validate(self, data):
        # Extract fields
        patient_id = self.initial_data.get('patient')
        doctor_id = self.initial_data.get('doctor')
        appointment_time = data.get('datetime')
        status = data.get('status')

        # Validate patient
        if not patient_id:
            raise serializers.ValidationError("Patient ID is required.")
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Patient does not exist.")

        # Validate doctor
        if not doctor_id:
            raise serializers.ValidationError("Doctor ID is required.")
        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            raise serializers.ValidationError("Doctor does not exist.")

        # Validate appointment time
        if not appointment_time:
            raise serializers.ValidationError("Appointment time is required.")

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

        # Validate status
        if status and status not in ['pending', 'confirmed', 'cancelled']:
            raise serializers.ValidationError("Status must be one of: pending, confirmed, cancelled.")

        return data
