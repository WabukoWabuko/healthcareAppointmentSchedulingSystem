from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'insurance_id', 'user')
    list_filter = ('name',)
    search_fields = ('name', 'email', 'insurance_id')
    ordering = ('name',)
