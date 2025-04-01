from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register('doctors', DoctorViewSet)
router.register('availabilities', AvailabilityViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
