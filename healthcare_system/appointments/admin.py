from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'doctor', 'datetime', 'status')
    list_filter = ('status', 'doctor')
    search_fields = ('patient__name', 'doctor__name')
    ordering = ('datetime',)
