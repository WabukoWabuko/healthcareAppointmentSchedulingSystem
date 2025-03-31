from rest_framework import serializers
from .models import Appointment
from patients.models import Patient
from doctors.models import Doctor

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'datetime', 'status']
        read_only_fields = ['id', 'status']

    def validate_datetime(self, value):
        # Ensure the appointment time is in the future
        if value < timezone.now():
            raise serializers.ValidationError("Appointment time must be in the future.")
        return value

    def validate(self, data):
        # Ensure the patient and doctor exist
        if not Patient.objects.filter(id=data['patient'].id).exists():
            raise serializers.ValidationError({"patient": "Patient does not exist."})
        if not Doctor.objects.filter(id=data['doctor'].id).exists():
            raise serializers.ValidationError({"doctor": "Doctor does not exist."})
        return data
