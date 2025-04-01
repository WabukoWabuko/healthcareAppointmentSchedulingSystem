from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),  # For JWT authentication
    path('api/', include('patients.urls')),
    path('api/', include('doctors.urls')),
    path('api/', include('appointments.urls')),
]
