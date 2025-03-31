from rest_framework import viewsets
from .models import Patient
from .serializers import PatientSerializer
from rest_framework.permissions import IsAuthenticated

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            # Patients can only see their own data
            try:
                return Patient.objects.filter(user=user)
            except AttributeError:
                return Patient.objects.none()
        elif user.role == 'admin':
            # Admins see all patients
            return Patient.objects.all()
        # Doctors don't need access to patient data directly
        return Patient.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
