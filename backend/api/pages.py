"""Serves the React shell with real per-page <head> tags, JSON-LD and plain-HTML copy, plus
sitemap.xml, robots.txt and llms.txt."""
import json
import re
import time
import urllib.request
from pathlib import Path

from django.conf import settings
from django.http import HttpResponse, HttpResponsePermanentRedirect
from django.utils.html import escape
from django.views.decorators.http import require_GET

from .seo import Content, build_pages, json_ld, not_found_page, plain
from .serializers import full_payload

_shell_cache = {'html': '', 'at': 0.0}
SHELL_TTL = 30


def get_shell():
    """index.html from the frontend build: a local file in development, else fetched from the web container."""
    local = getattr(settings, 'FRONTEND_SHELL_PATH', '')
    if local:
        return Path(local).read_text(encoding='utf-8')
    now = time.time()
    if _shell_cache['html'] and now - _shell_cache['at'] < SHELL_TTL:
        return _shell_cache['html']
    try:
        with urllib.request.urlopen(settings.FRONTEND_SHELL_URL, timeout=3) as response:
            _shell_cache.update(html=response.read().decode('utf-8'), at=now)
    except OSError:
        if not _shell_cache['html']:
            raise
    return _shell_cache['html']


def script_json(value):
    """JSON that is safe inside an inline <script>."""
    return json.dumps(value, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')


def head_tags(c: Content, page, canonical):
    image = c.url(page.image) if page.image else ''
    tags = [
        f'<title>{escape(page.title)}</title>',
        f'<meta name="description" content="{escape(page.description)}">',
        f'<link rel="canonical" href="{escape(canonical)}">',
        f'<meta name="robots" content="{"noindex, nofollow" if page.noindex else "index, follow, max-image-preview:large"}">',
        '<meta property="og:locale" content="en_AU">',
        f'<meta property="og:site_name" content="{escape(c.brand())}">',
        f'<meta property="og:type" content="{page.og_type}">',
        f'<meta property="og:title" content="{escape(page.title)}">',
        f'<meta property="og:description" content="{escape(page.description)}">',
        f'<meta property="og:url" content="{escape(canonical)}">',
        f'<meta name="twitter:card" content="{"summary_large_image" if image else "summary"}">',
        f'<meta name="twitter:title" content="{escape(page.title)}">',
        f'<meta name="twitter:description" content="{escape(page.description)}">',
    ]
    if image:
        tags += [f'<meta property="og:image" content="{escape(image)}">', f'<meta name="twitter:image" content="{escape(image)}">']
    if page.published:
        tags.append(f'<meta property="article:published_time" content="{page.published}">')
    tags.append(f'<script type="application/ld+json" id="ld-json">{script_json(json_ld(c, page))}</script>')
    return '\n    '.join(tags)


def render_page(c: Content, pages, page):
    html = get_shell()
    canonical = c.url(page.path if page.status == 200 else '/')
    html = re.sub(r'<title>.*?</title>', '', html, flags=re.S)
    html = re.sub(r'<meta\s+name="description"[^>]*>', '', html)
    html = html.replace('</head>', f'    {head_tags(c, page, canonical)}\n  </head>', 1)
    html = html.replace('<div id="root"></div>', f'<div id="root">{page.body}</div>', 1)
    bootstrap = f'<script>window.__SITE__={script_json(full_payload(pages))}</script>\n    '
    return html.replace('<script type="module"', bootstrap + '<script type="module"', 1)


def spa_page(request, path=''):
    path = '/' + path
    if path != '/' and path.endswith('/'):
        return HttpResponsePermanentRedirect(path.rstrip('/'))
    if re.search(r'\.[A-Za-z0-9]{2,5}$', path):
        return HttpResponse('Not found', status=404, content_type='text/plain')
    c = Content()
    pages = build_pages(c)
    page = pages.get(path) or not_found_page(c)
    response = HttpResponse(render_page(c, pages, page), status=page.status, content_type='text/html; charset=utf-8')
    response['Cache-Control'] = 'no-cache'
    return response


@require_GET
def sitemap(request):
    c = Content()
    rows = []
    for page in build_pages(c).values():
        if page.noindex or not page.sitemap:
            continue
        image = ''
        if page.path.startswith('/projects/') and page.image:
            image = f'<image:image><image:loc>{escape(c.url(page.image))}</image:loc></image:image>'
        priority = '1.0' if page.path == '/' else '0.8' if page.path.count('/') == 1 else '0.6'
        rows.append(f'  <url><loc>{escape(c.url(page.path))}</loc><priority>{priority}</priority>{image}</url>')
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
           + '\n'.join(rows) + '\n</urlset>\n')
    return HttpResponse(xml, content_type='application/xml; charset=utf-8')


@require_GET
def robots(request):
    c = Content()
    body = f'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: {c.url("/sitemap.xml")}\n'
    return HttpResponse(body, content_type='text/plain; charset=utf-8')


@require_GET
def llms_txt(request):
    """A plain-language summary for AI answer engines (see llmstxt.org)."""
    c = Content()
    s = c.site
    lines = [
        f'# {c.brand()}', '',
        f'> {plain(c.t("about.hero.body"))}', '',
        f'{c.brand()} ({s.company_name}) is based in {s.locality}, {s.region}, Australia and serves: {s.service_areas}.', '',
        '## Services',
        *[f'- [{plain(sv.title)}]({c.url("/services#" + sv.slug)}): {plain(sv.description)}' for sv in c.services], '',
        '## Projects',
        *[f'- [{plain(p.title)}]({c.url("/projects/" + p.slug)}): {p.place}. {plain(p.summary)}' for p in c.projects if p.record == 'verified'], '',
        '## Frequently asked questions',
        *[f'- {plain(f.question)} {plain(f.answer)}' for f in c.faqs if f.placement in ('faqs', 'home')], '',
        '## Contact',
        f'- Email: {s.contact_email}', f'- Phone: {s.contact_phone}', f'- Website: {c.url("/")}', '',
        f'Disclaimer: {plain(s.disclaimer)}', '',
    ]
    return HttpResponse('\n'.join(lines), content_type='text/plain; charset=utf-8')
