#!/bin/sh
set -e

python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py seed_content

# Create the first admin login from .env (skipped if it already exists).
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  python manage.py createsuperuser --noinput \
    --email "${DJANGO_SUPERUSER_EMAIL:-permits@permitshub.com.au}" 2>/dev/null \
    && echo "Created admin user $DJANGO_SUPERUSER_USERNAME" \
    || echo "Admin user $DJANGO_SUPERUSER_USERNAME already exists"
fi

exec gunicorn permitshub.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 60 \
  --access-logfile - --error-logfile -
