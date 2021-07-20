from celery import Celery
import os

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'katrinconsole.settings')

app = Celery('katrinconsole')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
