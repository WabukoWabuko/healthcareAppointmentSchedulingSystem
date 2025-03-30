from celery import shared_task

@shared_task
def send_appointment_notification(appointment_id):
    # Simulate sending an email (in production, use an email service)
    print(f"Notification sent for appointment ID {appointment_id}")
