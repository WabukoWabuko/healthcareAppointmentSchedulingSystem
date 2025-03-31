from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.role == 'admin':
                return Appointment.objects.all()
            elif user.role == 'patient':
                return Appointment.objects.filter(patient__user=user)
            elif user.role == 'doctor':
                return Appointment.objects.filter(doctor__user=user)
        return Appointment.objects.none()
