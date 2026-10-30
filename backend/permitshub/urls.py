from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import RedirectView
from django.views.static import serve

from api import pages

admin.site.site_header = 'Permits Hub admin'
admin.site.site_title = 'Permits Hub admin'
admin.site.index_title = 'Manage the website'

urlpatterns = [
    path('admin', RedirectView.as_view(url='/admin/', permanent=True)),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('sitemap.xml', pages.sitemap),
    path('robots.txt', pages.robots),
    path('llms.txt', pages.llms_txt),
    # In production Caddy serves /media/ straight from the shared volume; this keeps
    # `manage.py runserver` and bare gunicorn working too.
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    # Every other address is a website page: HTML with real meta tags, then React takes over.
    re_path(r'^(?P<path>.*)$', pages.spa_page),
]
