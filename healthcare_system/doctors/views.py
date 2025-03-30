from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Doctor, Availability
from .serializers import DoctorSerializer, AvailabilitySerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return Doctor.objects.filter(user=user)
        elif user.role == 'admin':
            return Doctor.objects.all()
        return Doctor.objects.none()

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        doctor_id = self.kwargs.get('doctor_id')
        if user.role == 'doctor' and Doctor.objects.filter(user=user, id=doctor_id).exists():
            return Availability.objects.filter(doctor_id=doctor_id)
        elif user.role == 'admin':
            return Availability.objects.filter(doctor_id=doctor_id)
        return Availability.objects.none()
