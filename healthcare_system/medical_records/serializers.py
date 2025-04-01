from rest_framework import serializers
from .models import MedicalRecord
from patients.serializers import PatientSerializer
from appointments.serializers import AppointmentSerializer
from patients.models import Patient
from appointments.models import Appointment

class MedicalRecordSerializer(serializers.ModelSerializer):
    patient = PatientSerializer(read_only=True)
    appointment = AppointmentSerializer(read_only=True)

    class Meta:
        model = MedicalRecord
        fields = ['id', 'patient', 'appointment', 'diagnosis', 'treatment', 'notes', 'created_at', 'updated_at']

    def validate_notes(self, value):
        if value and len(value) > 1000:
            raise serializers.ValidationError("Notes cannot exceed 1000 characters.")
        return value

    def validate(self, data):
        # Extract fields
        patient_id = self.initial_data.get('patient')
        appointment_id = self.initial_data.get('appointment')
        diagnosis = data.get('diagnosis')
        treatment = data.get('treatment')

        # Validate patient
        if not patient_id:
            raise serializers.ValidationError("Patient ID is required.")
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Patient does not exist.")

        # Validate appointment
        if not appointment_id:
            raise serializers.ValidationError("Appointment ID is required.")
        try:
            appointment = Appointment.objects.get(id=appointment_id)
        except Appointment.DoesNotExist:
            raise serializers.ValidationError("Appointment does not exist.")

        # Ensure the appointment belongs to the patient
        if appointment.patient != patient:
            raise serializers.ValidationError("The appointment does not belong to the specified patient.")

        # Validate required fields
        if not diagnosis:
            raise serializers.ValidationError("Diagnosis is required.")
        if not treatment:
            raise serializers.ValidationError("Treatment is required.")

        return data
