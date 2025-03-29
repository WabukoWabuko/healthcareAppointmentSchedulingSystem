from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'doctors/(?P<doctor_id>\d+)/availability', AvailabilityViewSet, basename='availability')

urlpatterns = [
    path('', include(router.urls)),
]
