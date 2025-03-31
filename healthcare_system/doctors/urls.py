from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')  # Added basename
router.register(r'availability', AvailabilityViewSet, basename='availability')  # Added basename

urlpatterns = [
    path('', include(router.urls)),
]
