from rest_framework import viewsets
from .models import Doctor, Availability
from .serializers import DoctorSerializer, AvailabilitySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

class DoctorViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            # Doctors can only see their own data
            try:
                return Doctor.objects.filter(user=user)
            except AttributeError:
                return Doctor.objects.none()
        elif user.role == 'admin':
            # Admins see all doctors
            return Doctor.objects.all()
        elif user.role == 'patient':
            # Patients can see all doctors (to book appointments)
            return Doctor.objects.all()
        return Doctor.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        doctor = self.get_object()
        availability = Availability.objects.filter(doctor=doctor)
        serializer = AvailabilitySerializer(availability, many=True)
        return Response(serializer.data)

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
        if user.role == 'doctor':
            serializer.save(doctor=user.doctor)
