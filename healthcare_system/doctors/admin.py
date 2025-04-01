from django.contrib import admin
from .models import Doctor, Availability

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialization', 'user')
    list_filter = ('specialization',)
    search_fields = ('name', 'specialization')
    ordering = ('name',)

@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'start_time', 'end_time')
    list_filter = ('doctor',)
    search_fields = ('doctor__name',)
    ordering = ('start_time',)
