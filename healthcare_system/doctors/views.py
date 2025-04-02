from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Doctor, Availability
from .serializers import DoctorSerializer, AvailabilitySerializer

class DoctorViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    queryset = Doctor.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Doctor.objects.all()
        elif user.role == 'patient':
            return Doctor.objects.all()  # Patients can see all doctors
        return Doctor.objects.none()

class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]
    queryset = Availability.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return Availability.objects.filter(doctor__user=user)
        elif user.role == 'admin':
            return Availability.objects.all()
        return Availability.objects.none()
