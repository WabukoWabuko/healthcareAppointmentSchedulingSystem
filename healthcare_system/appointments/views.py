from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from doctors.models import Availability
from django.utils import timezone

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            try:
                patient = user.patient
                return Appointment.objects.filter(patient=patient)
            except AttributeError:
                return Appointment.objects.none()
        elif user.role == 'doctor':
            try:
                doctor = user.doctor
                return Appointment.objects.filter(doctor=doctor)
            except AttributeError:
                return Appointment.objects.none()
        elif user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        # Extract appointment data
        appointment_data = serializer.validated_data
        doctor = appointment_data['doctor']
        appointment_time = appointment_data['datetime']

        # Step 1: Check if the appointment time falls within the doctor's availability
        doctor_availability = Availability.objects.filter(
            doctor=doctor,
            start_time__lte=appointment_time,
            end_time__gte=appointment_time
        )

        if not doctor_availability.exists():
            raise ValidationError({
                'datetime': 'The selected time is outside the doctor’s availability.'
            })

        # Step 2: Check for overlapping appointments (double-booking)
        # Assume appointments are 30 minutes long for simplicity
        appointment_end_time = appointment_time + timezone.timedelta(minutes=30)

        overlapping_appointments = Appointment.objects.filter(
            doctor=doctor,
            datetime__lt=appointment_end_time,  # Starts before the new appointment ends
            datetime__gte=appointment_time     # Ends after the new appointment starts
        ).exclude(id=self.request.data.get('id'))  # Exclude the current appointment if updating

        if overlapping_appointments.exists():
            raise ValidationError({
                'datetime': 'The doctor already has an appointment at this time.'
            })

        # If all checks pass, save the appointment
        serializer.save()
