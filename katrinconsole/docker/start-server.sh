#! /usr/bin/env bash

python manage.py migrate --no-input

if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ]; then
    python manage.py createsuperuser --no-input
fi

python manage.py loaddata fixtures/oauth-apps.yaml

celery -A katrinconsole worker -D
gunicorn katrinconsole.wsgi --worker-tmp-dir /var/lib/nginx/ --pid /var/lib/nginx/gunicorn.pid --daemon --workers 6
nginx
