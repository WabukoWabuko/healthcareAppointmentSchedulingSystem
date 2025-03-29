from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'name', 'email', 'phone', 'insurance_id', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
