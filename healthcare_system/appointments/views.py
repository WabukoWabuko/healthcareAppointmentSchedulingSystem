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
                print(f"No patient profile found for user: {user.email}")
                return Appointment.objects.none()
        elif user.role == 'doctor':
            try:
                doctor = user.doctor
                return Appointment.objects.filter(doctor=doctor)
            except AttributeError:
                print(f"No doctor profile found for user: {user.email}")
                return Appointment.objects.none()
        elif user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        appointment_data = serializer.validated_data
        doctor = appointment_data['doctor']
        appointment_time = appointment_data['datetime']

        doctor_availability = Availability.objects.filter(
            doctor=doctor,
            start_time__lte=appointment_time,
            end_time__gte=appointment_time
        )

        if not doctor_availability.exists():
            raise ValidationError({
                'datetime': 'The selected time is outside the doctor’s availability.'
            })

        appointment_end_time = appointment_time + timezone.timedelta(minutes=30)
        overlapping_appointments = Appointment.objects.filter(
            doctor=doctor,
            datetime__lt=appointment_end_time,
            datetime__gte=appointment_time
        ).exclude(id=self.request.data.get('id'))

        if overlapping_appointments.exists():
            raise ValidationError({
                'datetime': 'The doctor already has an appointment at this time.'
            })

        serializer.save()
