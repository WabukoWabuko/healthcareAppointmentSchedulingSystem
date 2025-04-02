from django.urls import path, include
from rest_framework.routers import DefaultRouter
from doctors.views import DoctorViewSet, AvailabilityViewSet
from patients.views import PatientViewSet
from appointments.views import AppointmentViewSet
from medical_records.views import MedicalRecordViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'medical-records', MedicalRecordViewSet)

# Configure Swagger with drf-yasg
schema_view = get_schema_view(
    openapi.Info(
        title="Healthcare Appointment Scheduling API",
        default_version='v1',
        description="API for managing healthcare appointments, doctors, patients, and medical records.",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/jwt/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # API Documentation Endpoints with drf-yasg
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
