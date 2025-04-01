from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Doctor, Availability
from .serializers import DoctorSerializer, AvailabilitySerializer

class DoctorViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.role == 'patient':
            return Doctor.objects.all()
        elif user.role == 'doctor':
            return Doctor.objects.filter(user=user)
        return Doctor.objects.none()

class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin' or user.role == 'patient':
            return Availability.objects.all()
        elif user.role == 'doctor':
            return Availability.objects.filter(doctor__user=user)
        return Availability.objects.none()
