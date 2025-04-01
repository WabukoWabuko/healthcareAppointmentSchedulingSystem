from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Patient.objects.all()
        elif user.role == 'patient':
            return Patient.objects.filter(user=user)
        return Patient.objects.none()
