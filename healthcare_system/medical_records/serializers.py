from rest_framework import serializers
from .models import MedicalRecord

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'appointment', 'diagnosis', 'treatment', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        if 'diagnosis' not in data or not data['diagnosis']:
            raise serializers.ValidationError("Diagnosis is required.")
        if 'notes' in data and len(data['notes']) > 1000:
            raise serializers.ValidationError("Notes cannot exceed 1000 characters.")
        return data
