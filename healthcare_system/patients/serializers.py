from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    insurance_id = serializers.CharField(write_only=True)  # Decrypt not exposed in API

    class Meta:
        model = Patient
        fields = ['id', 'name', 'email', 'phone', 'insurance_id', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        insurance_id = validated_data.pop('insurance_id')
        patient = Patient(**validated_data)
        patient.set_insurance_id(insurance_id)
        patient.save()
        return patient

    def update(self, instance, validated_data):
        insurance_id = validated_data.pop('insurance_id', None)
        if insurance_id:
            instance.set_insurance_id(insurance_id)
        return super().update(instance, validated_data)
