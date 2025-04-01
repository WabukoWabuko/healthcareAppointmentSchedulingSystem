from rest_framework import serializers
from .models import MedicalRecord
from patients.serializers import PatientSerializer
from appointments.serializers import AppointmentSerializer

class MedicalRecordSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    appointment = AppointmentSerializer(read_only=True)

    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'appointment', 'diagnosis', 'treatment', 'notes', 'created_at', 'updated_at']
