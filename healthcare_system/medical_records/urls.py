from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalRecordViewSet

router = DefaultRouter()
router.register('medical-records', MedicalRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
