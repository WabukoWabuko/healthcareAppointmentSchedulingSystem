from django.urls import path, include
from rest_framework.routers import DefaultRouter
from doctors.views import DoctorViewSet, AvailabilityViewSet
from patients.views import PatientViewSet
from appointments.views import AppointmentViewSet
from medical_records.views import MedicalRecordViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'medical-records', MedicalRecordViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    # Manually define JWT endpoints instead of including 'rest_framework_simplejwt.urls'
    path('api/auth/jwt/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
