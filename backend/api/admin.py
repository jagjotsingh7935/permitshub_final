from django import forms
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils.html import format_html
from unfold.admin import ModelAdmin, StackedInline, TabularInline
from unfold.decorators import action, display

from .models import (
    CONTENT_GROUPS, FAQ, GROUP_MODELS, Chapter, ChapterLine, Enquiry, FAQCategory, FinderOption, PageSEO,
    Project, ProjectFact, ProjectImage, ProjectMilestone, ProjectSource, ProjectTypeOption, Region, Sector, Service,
    SiteImage, SiteSettings, Stage, StageOption, TextBlock,
)


def new_enquiry_count(request):
    return Enquiry.objects.filter(status='new').count() or None


def thumbnail(file_field, size=56):
    if not file_field:
        return '—'
    return format_html(
        '<img src="{}" alt="" style="height:{}px;width:{}px;object-fit:cover;border-radius:6px" />',
        file_field.url, size, size,
    )


class OrderedAdmin(ModelAdmin):
    list_editable = ['order', 'is_active']
    list_per_page = 50


SEO_FIELDSET = ('Search results (SEO)', {
    'classes': ['collapse'],
    'description': 'Leave blank to generate from the page content. Include what people search for, e.g. "planning permit Victoria".',
    'fields': ['meta_title', 'meta_description'],
})


# ── Enquiries ──────────────────────────────────────────────────────────────

@admin.register(Enquiry)
class EnquiryAdmin(ModelAdmin):
    list_display = ['name', 'email', 'phone', 'project_type', 'location', 'status_label', 'created_at', 'emailed']
    list_filter = ['status', 'project_type', 'stage', 'created_at']
    search_fields = ['name', 'email', 'phone', 'location', 'message']
    date_hierarchy = 'created_at'
    readonly_fields = ['name', 'email', 'phone', 'location', 'project_type', 'stage', 'service', 'message', 'created_at',
                       'confirmation_sent', 'alert_sent', 'email_error']
    fieldsets = [
        ('Enquiry', {'fields': ['name', 'email', 'phone', 'location', 'project_type', 'stage', 'service', 'message', 'created_at']}),
        ('Follow-up', {'fields': ['status', 'internal_notes']}),
        ('Email delivery', {'fields': ['confirmation_sent', 'alert_sent', 'email_error']}),
    ]
    actions = ['mark_read', 'mark_replied', 'mark_archived']
    list_per_page = 50

    def has_add_permission(self, request):
        return False

    @display(description='Status', label={'New': 'danger', 'Read': 'info', 'Replied': 'success', 'Archived': 'warning'})
    def status_label(self, obj):
        return obj.get_status_display()

    @display(description='Emails sent', boolean=True)
    def emailed(self, obj):
        return obj.confirmation_sent and obj.alert_sent

    def change_view(self, request, object_id, form_url='', extra_context=None):
        Enquiry.objects.filter(pk=object_id, status='new').update(status='read')
        return super().change_view(request, object_id, form_url, extra_context)

    @action(description='Mark selected as read')
    def mark_read(self, request, queryset):
        queryset.update(status='read')

    @action(description='Mark selected as replied')
    def mark_replied(self, request, queryset):
        queryset.update(status='replied')

    @action(description='Archive selected')
    def mark_archived(self, request, queryset):
        queryset.update(status='archived')


# ── Settings, text, images, SEO ────────────────────────────────────────────

@admin.register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    fieldsets = [
        ('Brand', {'fields': ['brand_primary', 'brand_secondary', 'company_name', 'logo']}),
        ('Contact details', {'fields': ['contact_email', 'contact_phone', 'facebook_url']}),
        ('Search & social (SEO)', {
            'description': 'Used for the sitemap, canonical links, social sharing and local-business structured data.',
            'fields': ['site_url', 'default_og_image', 'locality', 'region', 'service_areas'],
        }),
        ('Legal', {'fields': ['disclaimer']}),
        ('Enquiry emails', {
            'description': 'The confirmation is sent from permits@permitshub.com.au (set in the server settings) '
                           'to the address the visitor typed in the contact form.',
            'fields': ['notify_emails', 'auto_reply_enabled', 'auto_reply_subject', 'auto_reply_body'],
        }),
    ]

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj = SiteSettings.load()
        return HttpResponseRedirect(reverse('admin:api_sitesettings_change', args=[obj.pk]))


@admin.register(PageSEO)
class PageSEOAdmin(ModelAdmin):
    list_display = ['label', 'meta_title', 'noindex']
    fields = ['label', 'meta_title', 'meta_description', 'og_image', 'noindex']
    readonly_fields = ['label']

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(TextBlock)
class TextBlockAdmin(ModelAdmin):
    list_display = ['label', 'section', 'preview']
    list_filter = ['section']
    search_fields = ['label', 'value', 'key']
    list_per_page = 60
    fields = ['section', 'label', 'help_text_note', 'value']
    readonly_fields = ['section', 'label', 'help_text_note']

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @display(description='Current text')
    def preview(self, obj):
        return obj.value if len(obj.value) <= 90 else obj.value[:90] + '…'


@admin.register(SiteImage)
class SiteImageAdmin(ModelAdmin):
    list_display = ['preview', 'label', 'alt']
    list_display_links = ['preview', 'label']
    fields = ['label', 'image', 'alt', 'focus']
    readonly_fields = ['label']

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @display(description='Image')
    def preview(self, obj):
        return thumbnail(obj.image)


# ── Services ───────────────────────────────────────────────────────────────

@admin.register(Service)
class ServiceAdmin(OrderedAdmin):
    list_display = ['title', 'slug', 'icon', 'order', 'is_active']
    prepopulated_fields = {'slug': ['title']}
    search_fields = ['title', 'description']
    filter_horizontal = ['stages', 'related_projects']
    fieldsets = [
        (None, {'fields': ['title', 'slug', 'icon', 'description', 'involves', 'conversation', 'enquiry_type']}),
        ('Lists', {'fields': ['who_for', 'situations', 'inputs', 'deliverables']}),
        ('Connections', {'fields': ['stages', 'related_projects']}),
        ('Display', {'fields': ['order', 'is_active']}),
        SEO_FIELDSET,
    ]


@admin.register(Stage)
class StageAdmin(OrderedAdmin):
    list_display = ['label', 'short', 'slug', 'order', 'is_active']


@admin.register(FinderOption)
class FinderOptionAdmin(OrderedAdmin):
    list_display = ['prompt', 'stage', 'order', 'is_active']
    filter_horizontal = ['services']


# ── Projects ───────────────────────────────────────────────────────────────

class ProjectFactInline(TabularInline):
    model = ProjectFact
    extra = 0


class ProjectMilestoneInline(StackedInline):
    model = ProjectMilestone
    extra = 0


class ProjectImageInline(StackedInline):
    model = ProjectImage
    extra = 0


class ProjectSourceInline(TabularInline):
    model = ProjectSource
    extra = 0


@admin.register(Sector)
class SectorAdmin(OrderedAdmin):
    list_display = ['title', 'slug', 'show_in_portfolio', 'order', 'is_active']
    prepopulated_fields = {'slug': ['title']}
    fieldsets = [
        (None, {'fields': ['title', 'slug', 'summary', 'considerations', 'show_in_portfolio']}),
        ('Display', {'fields': ['order', 'is_active']}),
        SEO_FIELDSET,
    ]


@admin.register(Project)
class ProjectAdmin(OrderedAdmin):
    list_display = ['thumb', 'title', 'record', 'place', 'sector', 'status', 'featured', 'order', 'is_active']
    list_display_links = ['thumb', 'title']
    list_filter = ['record', 'sector', 'status', 'featured', 'is_active']
    search_fields = ['title', 'place', 'summary']
    prepopulated_fields = {'slug': ['title']}
    inlines = [ProjectFactInline, ProjectMilestoneInline, ProjectImageInline, ProjectSourceInline]
    fieldsets = [
        ('Project', {'fields': ['record', 'title', 'slug', 'place', 'region', 'sector', 'status', 'status_note', 'update_date']}),
        ('Content', {'fields': ['highlight', 'summary', 'outcome', 'next_steps', 'involvement']}),
        ('Demo-only content', {'classes': ['collapse'], 'fields': ['site_context', 'planning_considerations', 'illustration']}),
        ('Cover image', {'fields': ['cover', 'cover_alt', 'cover_caption', 'cover_focus', 'tone']}),
        ('Display', {'fields': ['featured', 'home_order', 'order', 'is_active']}),
        SEO_FIELDSET,
    ]

    @display(description='')
    def thumb(self, obj):
        return thumbnail(obj.cover)


# ── FAQs ───────────────────────────────────────────────────────────────────

@admin.register(FAQCategory)
class FAQCategoryAdmin(OrderedAdmin):
    list_display = ['title', 'order', 'is_active']


@admin.register(FAQ)
class FAQAdmin(OrderedAdmin):
    list_display = ['question', 'placement', 'category', 'order', 'is_active']
    list_filter = ['placement', 'category']
    search_fields = ['question', 'answer']


# ── Short lists (one admin page per list) ──────────────────────────────────

def _group_admin(key, fields):
    class Form(forms.ModelForm):
        class Meta:
            model = GROUP_MODELS[key]
            fields = list(CONTENT_GROUPS[key][2]) + ['order', 'is_active']
            labels = CONTENT_GROUPS[key][2]

    class GroupAdmin(OrderedAdmin):
        form = Form
        list_display = [list(fields)[0], 'order', 'is_active']

    return GroupAdmin


for _key, (_singular, _plural, _fields) in CONTENT_GROUPS.items():
    admin.site.register(GROUP_MODELS[_key], _group_admin(_key, _fields))


# ── About ──────────────────────────────────────────────────────────────────

@admin.register(Region)
class RegionAdmin(OrderedAdmin):
    list_display = ['name', 'note', 'order', 'is_active']


class ChapterLineInline(TabularInline):
    model = ChapterLine
    extra = 0


@admin.register(Chapter)
class ChapterAdmin(OrderedAdmin):
    list_display = ['marker', 'title', 'type', 'media_kind', 'order', 'is_active']
    list_display_links = ['marker', 'title']
    prepopulated_fields = {'slug': ['title']}
    filter_horizontal = ['projects']
    inlines = [ChapterLineInline]
    fieldsets = [
        (None, {'fields': ['marker', 'type', 'title', 'slug', 'eyebrow', 'body', 'stage']}),
        ('Panel shown under the text', {
            'description': 'Record card: fill the title, lines below and source. Tick list: title and the list. '
                           'Project cards: choose projects. Headline figures: add lines (label, value, link).',
            'fields': ['media_kind', 'media_title', 'source_label', 'source_url', 'checklist', 'projects'],
        }),
        ('Display', {'fields': ['order', 'is_active']}),
    ]


# ── Enquiry form options ───────────────────────────────────────────────────

@admin.register(ProjectTypeOption)
class ProjectTypeOptionAdmin(OrderedAdmin):
    list_display = ['label', 'order', 'is_active']


@admin.register(StageOption)
class StageOptionAdmin(OrderedAdmin):
    list_display = ['label', 'order', 'is_active']
