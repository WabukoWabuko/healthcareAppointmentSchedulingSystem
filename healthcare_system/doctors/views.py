from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Doctor, Availability
from .serializers import DoctorSerializer, AvailabilitySerializer
from django.core.cache import cache
import json

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

class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        cache_key = f"availability_{user.id}_{user.role}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Availability.objects.filter(id__in=json.loads(cached_data))

        if user.role == 'admin' or user.role == 'patient':
            queryset = Availability.objects.all()
        elif user.role == 'doctor':
            queryset = Availability.objects.filter(doctor__user=user)
        else:
            queryset = Availability.objects.none()

        cache.set(cache_key, json.dumps([obj.id for obj in queryset]), timeout=60 * 15)
        return queryset

    def perform_create(self, serializer):
        # Save the new availability
        instance = serializer.save()
        # Invalidate cache for all users who might see this doctor's availability
        doctor = instance.doctor
        # Invalidate for admin and patients (who see all availabilities)
        cache.delete(f"availability_{self.request.user.id}_admin")
        cache.delete(f"availability_{self.request.user.id}_patient")
        # Invalidate for the doctor
        cache.delete(f"availability_{doctor.user.id}_doctor")

    def perform_update(self, serializer):
        # Save the updated availability
        instance = serializer.save()
        # Invalidate cache
        doctor = instance.doctor
        cache.delete(f"availability_{self.request.user.id}_admin")
        cache.delete(f"availability_{self.request.user.id}_patient")
        cache.delete(f"availability_{doctor.user.id}_doctor")

    def perform_destroy(self, instance):
        # Delete the availability
        doctor = instance.doctor
        instance.delete()
        # Invalidate cache
        cache.delete(f"availability_{self.request.user.id}_admin")
        cache.delete(f"availability_{self.request.user.id}_patient")
        cache.delete(f"availability_{doctor.user.id}_doctor")
