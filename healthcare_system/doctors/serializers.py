from rest_framework import serializers
from .models import Doctor, Availability

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'name', 'specialization', 'created_at']

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'doctor', 'start_time', 'end_time']
