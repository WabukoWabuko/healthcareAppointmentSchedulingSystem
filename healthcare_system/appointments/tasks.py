from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_appointment_confirmation_email(appointment_id):
    from .models import Appointment
    appointment = Appointment.objects.get(id=appointment_id)
    subject = 'Appointment Confirmation'
    message = f'Your appointment with Dr. {appointment.doctor.name} on {appointment.datetime} has been booked.'
    send_mail(
        subject,
        message,
        'from@example.com', # A valid email is expected hapa
        [appointment.patient.email],
        fail_silently=False,
    )
