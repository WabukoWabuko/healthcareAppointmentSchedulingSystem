from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from doctors.serializers import DoctorSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'datetime', 'status']
