from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Doctor, Availability
from .serializers import DoctorSerializer, AvailabilitySerializer
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'doctor':
            return Doctor.objects.filter(user=user)
        elif user.role == 'admin':
            return Doctor.objects.all()
        return Doctor.objects.none()

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        doctor_id = self.kwargs.get('doctor_id')
        cache_key = f"availability_doctor_{doctor_id}"
        cached = redis_client.get(cache_key)

        if cached:
            return json.loads(cached)  # Return cached data

        if user.role == 'doctor' and Doctor.objects.filter(user=user, id=doctor_id).exists():
            qs = Availability.objects.filter(doctor_id=doctor_id)
        elif user.role == 'admin':
            qs = Availability.objects.filter(doctor_id=doctor_id)
        else:
            return Availability.objects.none()

        # Cache the result for 1 hour (3600 seconds)
        serialized_data = [obj.__dict__ for obj in qs]
        redis_client.setex(cache_key, 3600, json.dumps(serialized_data))
        return qs

    def get_queryset(self):
        user = self.request.user
        doctor_id = self.kwargs.get('doctor_id')
        cache_key = f"availability_doctor_{doctor_id}"
        cached = redis_client.get(cache_key)

        if cached:
            # Return cached data as a list of dicts (not queryset, so we adjust serialization)
            return json.loads(cached)

        if user.role == 'doctor' and Doctor.objects.filter(user=user, id=doctor_id).exists():
            qs = Availability.objects.filter(doctor_id=doctor_id)
        elif user.role == 'admin':
            qs = Availability.objects.filter(doctor_id=doctor_id)
        else:
            return Availability.objects.none()

        # Cache the result for 1 hour (3600 seconds)
        serialized_data = [
            {
                'id': obj.id,
                'doctor_id': obj.doctor_id,
                'start_time': obj.start_time.isoformat(),
                'end_time': obj.end_time.isoformat()
            }
            for obj in qs
        ]
        redis_client.setex(cache_key, 3600, json.dumps(serialized_data))
        return qs
