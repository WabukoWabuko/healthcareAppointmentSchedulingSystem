from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register('doctors', DoctorViewSet, basename='doctor')  # Specify basename
router.register('availabilities', AvailabilityViewSet, basename='availability')  # Specify basename

urlpatterns = [
    path('', include(router.urls)),
]
