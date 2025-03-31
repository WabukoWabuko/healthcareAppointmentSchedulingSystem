from rest_framework import viewsets
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            # Patients should see only their own appointments
            try:
                patient = user.patient
                return Appointment.objects.filter(patient=patient)
            except AttributeError:
                return Appointment.objects.none()
        elif user.role == 'doctor':
            # Doctors should see only their own appointments
            try:
                doctor = user.doctor
                return Appointment.objects.filter(doctor=doctor)
            except AttributeError:
                return Appointment.objects.none()
        elif user.role == 'admin':
            # Admins see all appointments
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        serializer.save()
