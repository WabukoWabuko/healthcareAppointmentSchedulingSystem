from rest_framework import viewsets
from .models import Doctor, Availability
from .serializers import DoctorSerializer, AvailabilitySerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer

    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        if doctor_id:
            return Availability.objects.filter(doctor_id=doctor_id)
        return self.queryset
