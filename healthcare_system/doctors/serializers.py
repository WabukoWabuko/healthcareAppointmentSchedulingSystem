from rest_framework import serializers
from .models import Doctor, Availability

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'start_time', 'end_time']

class DoctorSerializer(serializers.ModelSerializer):
    availabilities = AvailabilitySerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialization', 'availabilities', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
