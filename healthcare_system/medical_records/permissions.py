from rest_framework import permissions

class MedicalRecordPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow authenticated users to list or retrieve records (we'll filter in get_queryset)
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return request.user and request.user.is_authenticated
        # Only doctors and admins can create, update, or delete records
        return request.user and request.user.is_authenticated and request.user.role in ['doctor', 'admin']

    def has_object_permission(self, request, view, obj):
        # Patients can view their own records
        if request.method in permissions.SAFE_METHODS:
            if request.user.role == 'patient':
                return obj.patient.user == request.user
            # Doctors can view records for their appointments
            elif request.user.role == 'doctor':
                return obj.appointment.doctor.user == request.user
            # Admins can view all records
            return request.user.role == 'admin'
        # Only doctors and admins can update or delete, and only for their appointments (for doctors)
        if request.user.role == 'doctor':
            return obj.appointment.doctor.user == request.user
        return request.user.role == 'admin'
