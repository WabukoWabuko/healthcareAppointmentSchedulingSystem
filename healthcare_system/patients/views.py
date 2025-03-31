from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Patient
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            try:
                return Patient.objects.filter(user=user)
            except AttributeError:
                print(f"No patient profile found for user: {user.email}")
                return Patient.objects.none()
        elif user.role == 'admin':
            return Patient.objects.all()
        return Patient.objects.none()
