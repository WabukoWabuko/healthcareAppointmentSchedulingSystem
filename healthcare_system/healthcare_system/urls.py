from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('', include('patients.urls')),
        path('', include('doctors.urls')),
        path('', include('appointments.urls')),
        path('auth/', include('users.urls')),
    ])),
]
