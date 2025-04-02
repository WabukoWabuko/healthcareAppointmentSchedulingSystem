from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer

class IsDoctorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True  # Allow read access to all authenticated users
        return request.user.role in ['doctor', 'admin']  # Only doctors and admins can modify

class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [IsAuthenticated, IsDoctorOrAdmin]
    queryset = MedicalRecord.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return MedicalRecord.objects.filter(patient__user=user)
        elif user.role == 'doctor':
            return MedicalRecord.objects.filter(appointment__doctor__user=user)
        elif user.role == 'admin':
            return MedicalRecord.objects.all()
        return MedicalRecord.objects.none()

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
