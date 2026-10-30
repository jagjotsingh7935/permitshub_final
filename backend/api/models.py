from django.db import models

from .fields import WebpImageField

ICON_CHOICES = [
    ('Compass', 'Compass'),
    ('LandPlot', 'Land plot'),
    ('FileCheck2', 'File with tick'),
    ('Building2', 'Building'),
    ('ClipboardCheck', 'Clipboard with tick'),
    ('Users', 'People'),
    ('Handshake', 'Handshake'),
    ('Landmark', 'Landmark'),
    ('Hammer', 'Hammer'),
    ('Ruler', 'Ruler'),
    ('FileText', 'Document'),
    ('HardHat', 'Hard hat'),
    ('Warehouse', 'Warehouse'),
    ('Scale', 'Scales'),
    ('Map', 'Map'),
]

DEFAULT_DISCLAIMER = (
    'Permits Hub Pty Ltd does not manage or supervise trades or administer independent building contracts. '
    'To the extent permitted by law, we accept no responsibility for works or documentation provided by '
    'independently engaged third parties, including construction works. We may engage subcontractors to assist '
    'in delivering our services, and their details will be provided to you. Nothing in this statement excludes '
    'any liability or statutory rights that cannot lawfully be excluded.'
)

LINES_HELP = 'One item per line.'


class Ordered(models.Model):
    order = models.PositiveIntegerField(default=0, help_text='Lower numbers appear first.')
    is_active = models.BooleanField('Show on website', default=True)

    class Meta:
        abstract = True
        ordering = ['order', 'id']


class SeoFields(models.Model):
    meta_title = models.CharField('Search result title', max_length=90, blank=True,
                                  help_text='Leave blank to generate one. Aim for 60 characters or fewer.')
    meta_description = models.CharField('Search result description', max_length=200, blank=True,
                                        help_text='Leave blank to generate one. Aim for 150–160 characters.')

    class Meta:
        abstract = True


# ── Site-wide ──────────────────────────────────────────────────────────────

class SiteSettings(models.Model):
    """Single row holding the company-wide details used across the site."""

    brand_primary = models.CharField('Brand name (bold part)', max_length=60, default='Permits')
    brand_secondary = models.CharField('Brand name (light part)', max_length=60, default='Hub')
    company_name = models.CharField('Legal / company name', max_length=120, default='Permits Hub Pty Ltd')
    logo = WebpImageField(upload_to='site/', blank=True, help_text='Logo shown in the header, footer and search results. WebP or SVG is stored; other formats are converted to WebP.')
    contact_email = models.EmailField('Public contact email', default='permits@permitshub.com.au')
    contact_phone = models.CharField('Public phone number', max_length=40, default='0409 198 597')
    facebook_url = models.URLField('Facebook page', max_length=300, blank=True, default='https://www.facebook.com/abromacdevelopments')
    disclaimer = models.TextField(help_text='Shown in the site footer and on the Services page.')
    site_url = models.URLField('Website address', max_length=300, default='https://permitshub.com.au',
                               help_text='Full address with https and no trailing slash. Used in the sitemap, canonical links and structured data.')
    default_og_image = WebpImageField('Default social sharing image', upload_to='site/', blank=True,
                                      help_text='Shown when a page is shared on Facebook, LinkedIn etc. Ideally 1200×630.')
    locality = models.CharField('Business location (suburb/city)', max_length=80, default='Melbourne')
    region = models.CharField('State', max_length=20, default='VIC')
    service_areas = models.CharField(
        max_length=300, default='Victoria, Melbourne, Ballarat, Greater Geelong, Surf Coast, Melton',
        help_text='Places you serve, separated by commas. Used in structured data for local search.',
    )
    notify_emails = models.CharField(
        'Send new enquiry alerts to', max_length=300, default='permits@permitshub.com.au',
        help_text='One or more email addresses, separated by commas.',
    )
    auto_reply_enabled = models.BooleanField('Email a confirmation to people who enquire', default=True)
    auto_reply_subject = models.CharField(max_length=160, default='We have received your enquiry — Permits Hub')
    auto_reply_body = models.TextField(
        default=(
            'Hello {name},\n\n'
            'Thank you for contacting Permits Hub. Your enquiry has been received and a member of the team '
            'will be in touch shortly.\n\n'
            'A copy of your enquiry:\n'
            'Project type: {project_type}\n'
            'Location: {location}\n'
            'Stage: {stage}\n\n'
            '{message}\n\n'
            'Kind regards,\nPermits Hub\npermits@permitshub.com.au'
        ),
        help_text='Placeholders: {name} {email} {project_type} {location} {stage} {message}',
    )

    class Meta:
        verbose_name = 'Site settings'
        verbose_name_plural = 'Site settings'

    def __str__(self):
        return 'Site settings'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1, defaults={'disclaimer': DEFAULT_DISCLAIMER})
        return obj


class TextBlock(models.Model):
    """A single editable piece of copy. Rows are created by `seed_content`; staff edit the value."""

    key = models.CharField(max_length=120, unique=True, editable=False)
    section = models.CharField(max_length=80, editable=False)
    label = models.CharField(max_length=160, editable=False)
    value = models.TextField(blank=True)
    help_text_note = models.CharField('Hint', max_length=200, blank=True, editable=False)
    order = models.PositiveIntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order', 'key']
        verbose_name = 'Page text'
        verbose_name_plural = 'Page text'

    def __str__(self):
        return f'{self.section} — {self.label}'


class SiteImage(models.Model):
    key = models.CharField(max_length=120, unique=True, editable=False)
    label = models.CharField(max_length=160, editable=False)
    image = WebpImageField(upload_to='site/', blank=True, width_field='image_width', height_field='image_height')
    image_width = models.PositiveIntegerField(null=True, editable=False)
    image_height = models.PositiveIntegerField(null=True, editable=False)
    alt = models.CharField('Alt text', max_length=240, blank=True, help_text='Describe the image for screen readers and search engines.')
    focus = models.CharField('Focus point', max_length=30, blank=True, help_text='Optional CSS position such as "50% 60%" to choose which part stays visible when cropped.')
    order = models.PositiveIntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order', 'key']
        verbose_name = 'Image'
        verbose_name_plural = 'Images'

    def __str__(self):
        return self.label


class PageSEO(SeoFields):
    """Search/social details for the fixed pages (home, services, …). Rows are created by `seed_content`."""

    key = models.CharField(max_length=40, unique=True, editable=False)
    label = models.CharField(max_length=80, editable=False)
    og_image = WebpImageField('Social sharing image', upload_to='site/', blank=True,
                              help_text='Overrides the default sharing image for this page.')
    noindex = models.BooleanField('Hide from search engines', default=False)
    order = models.PositiveIntegerField(default=0, editable=False)

    class Meta:
        ordering = ['order']
        verbose_name = 'Page SEO'
        verbose_name_plural = 'Page SEO'

    def __str__(self):
        return self.label


# ── Services ───────────────────────────────────────────────────────────────

class Stage(Ordered):
    """The five broad stages of a client's project (used by the service finder and stage matrix)."""

    slug = models.SlugField(unique=True)
    label = models.CharField(max_length=80, help_text='Long label, e.g. "Before you commit".')
    short = models.CharField(max_length=30, help_text='Short label, e.g. "Site".')

    class Meta(Ordered.Meta):
        verbose_name = 'Project stage'
        verbose_name_plural = 'Project stages'

    def __str__(self):
        return self.label


class Sector(Ordered, SeoFields):
    """A project category (Child care, Commercial, …)."""

    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=120)
    summary = models.TextField('Description', blank=True)
    considerations = models.TextField('Typical considerations', blank=True, help_text='General guidance shown on project pages. ' + LINES_HELP)
    show_in_portfolio = models.BooleanField('Show as a portfolio tile', default=True,
                                            help_text='Untick for categories that should only appear as a filter.')

    class Meta(Ordered.Meta):
        verbose_name = 'Project category'
        verbose_name_plural = 'Project categories'

    def __str__(self):
        return self.title


class Project(Ordered, SeoFields):
    RECORDS = [('verified', 'Public update (real project)'), ('demo', 'Demo project (fictional)')]
    STATUSES = [('in-planning', 'In planning'), ('permit-approved', 'Permit approved'),
                ('under-construction', 'Under construction'), ('completed', 'Completed')]
    TONES = [('blue', 'Blue'), ('sand', 'Sand'), ('sage', 'Sage')]
    ILLUSTRATIONS = [('', 'None'), ('clinic', 'Clinic'), ('warehouse', 'Warehouse'),
                     ('townhouses', 'Townhouses'), ('hall', 'Hall')]

    record = models.CharField('Type', max_length=10, choices=RECORDS, default='verified',
                              help_text='Demo projects are always labelled "Demo project" on the website.')
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    place = models.CharField(max_length=160, help_text='e.g. Winter Valley, Ballarat')
    region = models.CharField(max_length=80, blank=True)
    sector = models.ForeignKey(Sector, null=True, on_delete=models.SET_NULL, related_name='projects', verbose_name='Category')
    status = models.CharField(max_length=20, choices=STATUSES, default='permit-approved')
    status_note = models.CharField(max_length=160, blank=True, help_text='e.g. Reported as approved on 12 June 2025')
    update_date = models.DateField('Public update date', null=True, blank=True, help_text='Leave empty for demo projects.')
    highlight = models.CharField(max_length=120, help_text='Short headline stat, e.g. "94 places".')
    summary = models.TextField()
    tone = models.CharField(max_length=10, choices=TONES, default='blue', help_text='Background tint behind the image.')
    outcome = models.TextField()
    next_steps = models.TextField()
    involvement = models.TextField('What the update documents / role', blank=True, help_text=LINES_HELP)
    site_context = models.TextField('Site context (demo only)', blank=True, help_text=LINES_HELP)
    planning_considerations = models.TextField('Planning considerations (demo only)', blank=True, help_text=LINES_HELP)
    illustration = models.CharField('Drawing (when no image)', max_length=20, choices=ILLUSTRATIONS, blank=True)
    cover = WebpImageField(upload_to='projects/', blank=True, width_field='cover_width', height_field='cover_height')
    cover_width = models.PositiveIntegerField(null=True, editable=False)
    cover_height = models.PositiveIntegerField(null=True, editable=False)
    cover_alt = models.CharField('Cover alt text', max_length=240, blank=True)
    cover_caption = models.CharField('Cover caption', max_length=300, blank=True)
    cover_focus = models.CharField('Cover focus point', max_length=30, blank=True, help_text='Optional CSS position such as "55% 60%".')
    featured = models.BooleanField('Featured on the Projects page', default=False, help_text='The first featured project is shown at the top.')
    home_order = models.PositiveIntegerField('Home page position', null=True, blank=True,
                                             help_text='1 = large lead card, 2 and 3 = side cards. Leave empty to hide from the home page.')

    class Meta(Ordered.Meta):
        pass

    def __str__(self):
        return self.title


class ProjectFact(models.Model):
    project = models.ForeignKey(Project, related_name='facts', on_delete=models.CASCADE)
    label = models.CharField(max_length=80)
    value = models.CharField(max_length=160)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Key fact'


class ProjectMilestone(models.Model):
    project = models.ForeignKey(Project, related_name='milestones', on_delete=models.CASCADE)
    when = models.CharField(max_length=40, help_text='A date as YYYY-MM-DD, or text such as "Stage 1".')
    label = models.CharField(max_length=160)
    detail = models.TextField()
    source_label = models.CharField(max_length=160, blank=True)
    source_url = models.URLField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Milestone'


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name='gallery', on_delete=models.CASCADE)
    image = WebpImageField(upload_to='projects/', width_field='image_width', height_field='image_height')
    image_width = models.PositiveIntegerField(null=True, editable=False)
    image_height = models.PositiveIntegerField(null=True, editable=False)
    alt = models.CharField(max_length=300)
    caption = models.CharField(max_length=300, blank=True)
    fit = models.CharField(max_length=10, choices=[('cover', 'Fill the frame'), ('contain', 'Show whole image')], default='cover')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Gallery image'


class ProjectSource(models.Model):
    project = models.ForeignKey(Project, related_name='sources', on_delete=models.CASCADE)
    label = models.CharField(max_length=160)
    url = models.URLField(max_length=500)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Source link'


class Service(Ordered, SeoFields):
    slug = models.SlugField(unique=True, help_text='Used for the link /services#<slug>.')
    title = models.CharField(
        max_length=200,
        help_text='Format "Area – Name" (with an en dash), e.g. "Town Planning – Due Diligence Services".',
    )
    description = models.TextField('Short description')
    icon = models.CharField(max_length=40, choices=ICON_CHOICES, default='Compass')
    involves = models.TextField('What it involves')
    who_for = models.TextField('Who it’s for', help_text=LINES_HELP)
    situations = models.TextField('When it helps', help_text=LINES_HELP)
    inputs = models.TextField('Typical inputs and documents', help_text=LINES_HELP)
    deliverables = models.TextField('Example deliverables', help_text=LINES_HELP)
    conversation = models.CharField('How to start a conversation', max_length=300)
    enquiry_type = models.CharField('Enquiry type', max_length=120, blank=True,
                                    help_text='Pre-selects this project type on the contact form. Must match one under Enquiry project types.')
    stages = models.ManyToManyField(Stage, blank=True, related_name='services', verbose_name='Stages it supports')
    related_projects = models.ManyToManyField(Project, blank=True, related_name='services', verbose_name='Related public updates')

    class Meta(Ordered.Meta):
        pass

    def __str__(self):
        return self.title


class FinderOption(Ordered):
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name='finder_options')
    prompt = models.CharField(max_length=160, help_text='What the visitor clicks, e.g. "I’m looking at a site".')
    answer = models.TextField()
    services = models.ManyToManyField(Service, blank=True, related_name='finder_options', verbose_name='Suggested services')

    class Meta(Ordered.Meta):
        verbose_name = 'Service finder option'
        verbose_name_plural = 'Service finder options'

    def __str__(self):
        return self.prompt


# ── FAQs ───────────────────────────────────────────────────────────────────

class FAQCategory(Ordered):
    title = models.CharField(max_length=80)

    class Meta(Ordered.Meta):
        verbose_name = 'FAQ category'
        verbose_name_plural = 'FAQ categories'

    def __str__(self):
        return self.title


class FAQ(Ordered):
    PLACEMENTS = [('faqs', 'FAQs page'), ('home', 'Home page'), ('services', 'Services page'), ('contact', 'Contact page')]

    question = models.CharField(max_length=240)
    answer = models.TextField(help_text='Lead with a direct answer in the first sentence — search and AI answer engines quote it.')
    placement = models.CharField(max_length=10, choices=PLACEMENTS, default='faqs',
                                 help_text='Which page shows this question. Use the FAQs page for the main list.')
    category = models.ForeignKey(FAQCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name='faqs',
                                 help_text='Only used on the FAQs page filter.')

    class Meta(Ordered.Meta):
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question


# ── Short repeated lists (one table, one admin entry per list) ─────────────

class ContentItem(Ordered):
    """An item in one of the short editable lists. `group` says which list; see api/content_groups.py."""

    group = models.CharField(max_length=40, db_index=True, editable=False)
    title = models.CharField(max_length=240)
    body = models.TextField(blank=True)
    detail = models.CharField(max_length=300, blank=True)
    lines = models.TextField(blank=True)

    class Meta(Ordered.Meta):
        verbose_name = 'List item'

    def __str__(self):
        return self.title


# ── About ──────────────────────────────────────────────────────────────────

class Region(Ordered):
    name = models.CharField(max_length=80)
    note = models.CharField(max_length=240)
    source_label = models.CharField(max_length=160, blank=True)
    source_url = models.URLField(max_length=500, blank=True)

    class Meta(Ordered.Meta):
        verbose_name = 'Region'

    def __str__(self):
        return self.name


class Chapter(Ordered):
    TYPES = [('milestone', 'Dated milestone'), ('perspective', 'Our approach'), ('now', 'Current work'), ('next', 'Your next step')]
    MEDIA = [
        ('record', 'Record card (label/value lines + source)'),
        ('checklist', 'Tick list'),
        ('projects', 'Project cards'),
        ('figures', 'Headline figures'),
        ('regions', 'Regions list'),
        ('cta', 'Call-to-action buttons'),
    ]

    slug = models.SlugField(unique=True)
    marker = models.CharField(max_length=20, help_text='Short label on the timeline, e.g. 2021 or Today.')
    type = models.CharField(max_length=12, choices=TYPES, default='milestone')
    title = models.CharField(max_length=200)
    eyebrow = models.CharField(max_length=120, blank=True)
    body = models.TextField(help_text='Separate paragraphs with a blank line.')
    stage = models.PositiveSmallIntegerField('Drawing stage', default=0,
                                             help_text='Which step of the evolving drawing to show (1 = first). See "Timeline drawing captions".')
    media_kind = models.CharField(max_length=10, choices=MEDIA, default='cta')
    media_title = models.CharField(max_length=160, blank=True)
    source_label = models.CharField(max_length=160, blank=True)
    source_url = models.URLField(max_length=500, blank=True)
    checklist = models.TextField(blank=True, help_text='For "Tick list": ' + LINES_HELP)
    projects = models.ManyToManyField(Project, blank=True, related_name='chapters', help_text='For "Project cards".')

    class Meta(Ordered.Meta):
        verbose_name = 'Timeline chapter'

    def __str__(self):
        return f'{self.marker} — {self.title}'


class ChapterLine(models.Model):
    chapter = models.ForeignKey(Chapter, related_name='lines', on_delete=models.CASCADE)
    label = models.CharField(max_length=160)
    value = models.CharField(max_length=160)
    link = models.CharField(max_length=200, blank=True, help_text='For "Headline figures": the page the figure links to, e.g. /projects.')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = 'Line / figure'


# ── Enquiry form ───────────────────────────────────────────────────────────

class ProjectTypeOption(Ordered):
    label = models.CharField(max_length=120)

    class Meta(Ordered.Meta):
        verbose_name = 'Enquiry project type'
        verbose_name_plural = 'Enquiry project types'

    def __str__(self):
        return self.label


class StageOption(Ordered):
    label = models.CharField(max_length=120)

    class Meta(Ordered.Meta):
        verbose_name = 'Enquiry stage'
        verbose_name_plural = 'Enquiry stages'

    def __str__(self):
        return self.label


class Enquiry(models.Model):
    STATUS = [('new', 'New'), ('read', 'Read'), ('replied', 'Replied'), ('archived', 'Archived')]

    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    location = models.CharField(max_length=200, blank=True)
    project_type = models.CharField(max_length=120, blank=True)
    stage = models.CharField(max_length=120, blank=True)
    service = models.CharField('Service of interest', max_length=200, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS, default='new', db_index=True)
    internal_notes = models.TextField(blank=True, help_text='Only visible to staff.')
    created_at = models.DateTimeField(auto_now_add=True)
    confirmation_sent = models.BooleanField('Confirmation emailed', default=False)
    alert_sent = models.BooleanField('Team alert emailed', default=False)
    email_error = models.TextField(blank=True, editable=False)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Enquiry'
        verbose_name_plural = 'Enquiries'

    def __str__(self):
        return f'{self.name} — {self.created_at:%d %b %Y}'


# ── One proxy model per short list, so each list has its own admin page ─────

# key: (singular name, plural name, {field: label} for the fields that list uses)
CONTENT_GROUPS = {
    'home_pillars': ('Highlight', 'Home — highlights strip', {'title': 'Title', 'body': 'Subtitle'}),
    'home_audiences': ('Audience', 'Home — who we help', {'title': 'Audience', 'body': 'Description'}),
    'home_enquiry_groups': ('Enquiry group', 'Home — what people bring to us', {'title': 'Heading', 'lines': 'Items (one per line)'}),
    'home_challenges': ('Situation', 'Home — common situations', {'title': 'Situation', 'body': 'Useful first step'}),
    'coordination_benefits': ('Benefit', 'Coordination benefits', {'title': 'Benefit'}),
    'journey': ('Journey step', 'Planning journey steps', {'title': 'Title', 'body': 'Description', 'detail': 'Useful to bring'}),
    'service_roles': ('Role', 'Services — who contributes', {'title': 'Role', 'body': 'What they provide'}),
    'service_engagement': ('Engagement format', 'Services — ways to work together', {'title': 'Title', 'body': 'Description', 'detail': 'Suits'}),
    'service_prep': ('Item', 'Services — consultation preparation', {'title': 'Item', 'body': 'Why it helps'}),
    'contact_prepare': ('Item', 'Contact — useful to prepare', {'title': 'Title', 'body': 'Description'}),
    'contact_checklist': ('Checklist item', 'Contact — first conversation checklist', {'title': 'Item'}),
    'contact_after': ('Step', 'Contact — what happens next', {'title': 'Title', 'body': 'Description'}),
    'about_principles': ('Principle', 'About — principles', {'title': 'Title', 'body': 'Description'}),
    'about_evolution': ('Drawing caption', 'Timeline drawing captions', {'title': 'Label', 'body': 'Caption'}),
}

GROUP_MODELS = {}


def _make_group_model(key, singular, plural):
    class_name = ''.join(part.capitalize() for part in key.split('_'))

    class GroupManager(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(group=key)

    def save(self, *args, **kwargs):
        self.group = key
        ContentItem.save(self, *args, **kwargs)

    meta = type('Meta', (), {
        'proxy': True, 'app_label': 'api', 'ordering': ['order', 'id'],
        'verbose_name': singular, 'verbose_name_plural': plural,
    })
    return type(class_name, (ContentItem,), {'__module__': __name__, 'Meta': meta, 'objects': GroupManager(), 'save': save})


for _key, (_singular, _plural, _fields) in CONTENT_GROUPS.items():
    GROUP_MODELS[_key] = _make_group_model(_key, _singular, _plural)
