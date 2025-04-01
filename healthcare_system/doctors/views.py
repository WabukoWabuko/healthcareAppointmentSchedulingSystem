from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Doctor
from .serializers import DoctorSerializer

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
