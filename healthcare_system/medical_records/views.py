from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer

class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return MedicalRecord.objects.all()
        elif user.role == 'doctor':
            # Doctors can only see records for their appointments
            return MedicalRecord.objects.filter(appointment__doctor__user=user)
        elif user.role == 'patient':
            # Patients can only see their own records
            return MedicalRecord.objects.filter(patient__user=user)
        return MedicalRecord.objects.none()
