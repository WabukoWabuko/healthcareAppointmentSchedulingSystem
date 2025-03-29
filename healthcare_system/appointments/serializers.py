from rest_framework import serializers
from .models import Appointment
from doctors.models import Availability
from django.db.models import Q

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'datetime', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        doctor = data['doctor']
        appointment_time = data['datetime']
        # Check if doctor is available
        available_slots = Availability.objects.filter(
            doctor=doctor,
            start_time__lte=appointment_time,
            end_time__gte=appointment_time
        )
        if not available_slots.exists():
            raise serializers.ValidationError("Doctor is not available at this time.")
        # Check for conflicts
        conflicts = Appointment.objects.filter(
            doctor=doctor,
            datetime=appointment_time,
            status__in=['pending', 'confirmed']
        )
        if conflicts.exists():
            raise serializers.ValidationError("Doctor is already booked at this time.")
        return data
