import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'healthcare_system.settings')
app = Celery('healthcare_system')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
