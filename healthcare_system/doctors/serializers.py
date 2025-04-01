from rest_framework import serializers
from .models import Doctor, Availability
from users.serializers import CustomUserSerializer

class DoctorSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'user', 'name', 'specialization']

class AvailabilitySerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Availability
        fields = ['id', 'doctor', 'start_time', 'end_time']
