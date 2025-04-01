from celery import shared_task

@shared_task
def send_appointment_confirmation_email(appointment_id, patient_email, doctor_name, appointment_time):
    # In a real application, you'd use a library like django.core.mail to send emails
    print(f"Sending email to {patient_email}: Appointment with {doctor_name} at {appointment_time} (ID: {appointment_id})")
