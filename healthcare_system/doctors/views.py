from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Doctor, Availability
from .serializers import DoctorSerializer, AvailabilitySerializer
from rest_framework.exceptions import PermissionDenied, ValidationError

class DoctorViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            try:
                return Doctor.objects.filter(user=user)
            except AttributeError:
                return Doctor.objects.none()
        elif user.role in ['admin', 'patient']:
            return Doctor.objects.all()  # Allow patients and admins to view all doctors
        return Doctor.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'admin':
            raise PermissionDenied("Only admins can create doctors.")
        serializer.save()

    def perform_update(self, serializer):
        user = self.request.user
        if user.role != 'admin':
            raise PermissionDenied("Only admins can update doctors.")
        serializer.save()

    def perform_destroy(self, instance):
        user = self.request.user
        if user.role != 'admin':
            raise PermissionDenied("Only admins can delete doctors.")
        instance.delete()

class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            try:
                doctor = user.doctor
                return Availability.objects.filter(doctor=doctor)
            except AttributeError:
                return Availability.objects.none()
        return Availability.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'doctor':
            raise PermissionDenied("Only doctors can create availability.")
        try:
            doctor = user.doctor
            serializer.save(doctor=doctor)
        except AttributeError:
            raise ValidationError("Doctor profile not found for this user.")
