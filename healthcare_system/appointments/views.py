from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer
from .tasks import send_appointment_confirmation_email

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing appointments.

    - **Patient**: Can create, list, and manage their own appointments.
    - **Doctor**: Can list appointments scheduled with them.
    - **Admin**: Can list, create, update, and delete all appointments.
    """
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Appointment.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Appointment.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        elif user.role == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.none()

    def perform_create(self, serializer):
        appointment = serializer.save()
        send_appointment_confirmation_email.delay(appointment.id)
