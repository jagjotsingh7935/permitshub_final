import mimetypes
import os
from pathlib import Path

from django.urls import reverse_lazy

BASE_DIR = Path(__file__).resolve().parent.parent

# Some systems (notably Windows) do not know these types, and nosniff would then block the images.
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('image/svg+xml', '.svg')


def env(name, default=''):
    return os.environ.get(name, default)


def env_list(name, default=''):
    return [item.strip() for item in env(name, default).split(',') if item.strip()]


DEBUG = env('DJANGO_DEBUG', 'false').lower() == 'true'
SECRET_KEY = env('DJANGO_SECRET_KEY', 'dev-only-insecure-key' if DEBUG else '')
if not SECRET_KEY:
    raise RuntimeError('DJANGO_SECRET_KEY must be set when DJANGO_DEBUG is not true.')

ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')
CSRF_TRUSTED_ORIGINS = env_list('DJANGO_CSRF_TRUSTED_ORIGINS')
CORS_ALLOWED_ORIGINS = env_list('DJANGO_CORS_ALLOWED_ORIGINS')

INSTALLED_APPS = [
    'unfold',
    'unfold.contrib.filters',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'permitshub.urls'
WSGI_APPLICATION = 'permitshub.wsgi.application'

TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {'context_processors': [
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
    ]},
}]

if env('POSTGRES_DB'):
    DATABASES = {'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('POSTGRES_DB'),
        'USER': env('POSTGRES_USER'),
        'PASSWORD': env('POSTGRES_PASSWORD'),
        'HOST': env('POSTGRES_HOST', 'db'),
        'PORT': env('POSTGRES_PORT', '5432'),
    }}
else:
    DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3'}}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-au'
TIME_ZONE = 'Australia/Melbourne'
USE_I18N = False
USE_TZ = True
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Static files live under /django-static/ so they never clash with the React build.
STATIC_URL = '/django-static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = Path(env('DJANGO_MEDIA_ROOT', str(BASE_DIR / 'media')))
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {
        'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage' if DEBUG
        else 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

# The React build's index.html: fetched from the web container, or read from a file in development.
FRONTEND_SHELL_URL = env('FRONTEND_SHELL_URL', 'http://web:8081/index.html')
FRONTEND_SHELL_PATH = env('FRONTEND_SHELL_PATH')

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_PARSER_CLASSES': ['rest_framework.parsers.JSONParser'],
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_THROTTLE_RATES': {'enquiry': env('ENQUIRY_THROTTLE', '10/hour')},
    'NUM_PROXIES': int(env('DJANGO_NUM_PROXIES', '0' if DEBUG else '1')),
}

# Enquiries are acknowledged from permits@permitshub.com.au. The domain's MX record
# points to Google, so the default SMTP host is Google Workspace / Gmail.
EMAIL_BACKEND = env(
    'EMAIL_BACKEND',
    'django.core.mail.backends.smtp.EmailBackend' if env('EMAIL_HOST_PASSWORD')
    else 'django.core.mail.backends.console.EmailBackend',
)
EMAIL_HOST = env('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(env('EMAIL_PORT', '587'))
EMAIL_USE_TLS = env('EMAIL_USE_TLS', 'true').lower() == 'true'
EMAIL_USE_SSL = env('EMAIL_USE_SSL', 'false').lower() == 'true'
EMAIL_HOST_USER = env('EMAIL_HOST_USER', 'permits@permitshub.com.au')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
EMAIL_TIMEOUT = 10
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL', 'Permits Hub <permits@permitshub.com.au>')
SERVER_EMAIL = DEFAULT_FROM_EMAIL

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE_X_FORWARDED_HOST = True
    SESSION_COOKIE_SECURE = env('DJANGO_SECURE_COOKIES', 'true').lower() == 'true'
    CSRF_COOKIE_SECURE = SESSION_COOKIE_SECURE

def _nav(title, icon, model):
    return {'title': title, 'icon': icon, 'link': reverse_lazy(f'admin:api_{model}_changelist')}


UNFOLD = {
    'SITE_TITLE': 'Permits Hub Admin',
    'SITE_HEADER': 'Permits Hub',
    'SITE_URL': '/',
    'COLORS': {
        'primary': {
            '50': '239 246 255', '100': '219 234 254', '200': '191 219 254', '300': '147 197 253',
            '400': '96 165 250', '500': '51 112 157', '600': '35 108 167', '700': '22 77 119',
            '800': '16 59 94', '900': '7 28 56', '950': '4 18 36',
        },
    },
    'SIDEBAR': {
        'show_search': True,
        'show_all_applications': False,
        'navigation': [
            {
                'title': 'Enquiries',
                'separator': True,
                'items': [{**_nav('Enquiries', 'mail', 'enquiry'), 'badge': 'api.admin.new_enquiry_count'}],
            },
            {
                'title': 'Pages & search',
                'separator': True,
                'items': [
                    _nav('Page text', 'edit_note', 'textblock'),
                    _nav('Images', 'image', 'siteimage'),
                    _nav('Search & social (SEO)', 'travel_explore', 'pageseo'),
                ],
            },
            {
                'title': 'Services',
                'separator': True,
                'items': [
                    _nav('Services', 'home_repair_service', 'service'),
                    _nav('Project stages', 'linear_scale', 'stage'),
                    _nav('Service finder', 'explore', 'finderoption'),
                    _nav('Who contributes', 'groups', 'serviceroles'),
                    _nav('Ways to work together', 'handshake', 'serviceengagement'),
                    _nav('Consultation preparation', 'checklist', 'serviceprep'),
                ],
            },
            {
                'title': 'Projects',
                'separator': True,
                'items': [
                    _nav('Projects', 'apartment', 'project'),
                    _nav('Project categories', 'category', 'sector'),
                ],
            },
            {
                'title': 'FAQs',
                'separator': True,
                'items': [_nav('FAQs', 'help', 'faq'), _nav('FAQ categories', 'label', 'faqcategory')],
            },
            {
                'title': 'Home page',
                'separator': True,
                'items': [
                    _nav('Highlights strip', 'view_column', 'homepillars'),
                    _nav('Who we help', 'groups', 'homeaudiences'),
                    _nav('What people bring to us', 'inventory_2', 'homeenquirygroups'),
                    _nav('Common situations', 'report_problem', 'homechallenges'),
                    _nav('Coordination benefits', 'done_all', 'coordinationbenefits'),
                    _nav('Planning journey steps', 'route', 'journey'),
                ],
            },
            {
                'title': 'About page',
                'separator': True,
                'items': [
                    _nav('Timeline chapters', 'timeline', 'chapter'),
                    _nav('Timeline drawing captions', 'draw', 'aboutevolution'),
                    _nav('Principles', 'balance', 'aboutprinciples'),
                    _nav('Regions', 'map', 'region'),
                ],
            },
            {
                'title': 'Contact page',
                'separator': True,
                'items': [
                    _nav('Useful to prepare', 'tips_and_updates', 'contactprepare'),
                    _nav('First conversation checklist', 'checklist', 'contactchecklist'),
                    _nav('What happens next', 'format_list_numbered', 'contactafter'),
                    _nav('Enquiry project types', 'list_alt', 'projecttypeoption'),
                    _nav('Enquiry stages', 'flag', 'stageoption'),
                ],
            },
            {
                'title': 'Settings',
                'separator': True,
                'items': [
                    _nav('Site settings', 'settings', 'sitesettings'),
                    {'title': 'Admin users', 'icon': 'person', 'link': reverse_lazy('admin:auth_user_changelist')},
                ],
            },
        ],
    },
}
