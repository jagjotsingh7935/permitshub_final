import logging

from django.conf import settings
from django.core.mail import EmailMessage

from .models import Enquiry, SiteSettings

logger = logging.getLogger(__name__)


class _SafeDict(dict):
    def __missing__(self, key):
        return ''


def send_enquiry_emails(enquiry: Enquiry):
    """Confirm receipt to the visitor and alert the team. Failures are recorded, never raised."""
    site = SiteSettings.load()
    errors = []

    if site.auto_reply_enabled:
        values = _SafeDict(
            name=enquiry.name, email=enquiry.email, project_type=enquiry.project_type or 'Not specified',
            location=enquiry.location or 'Not specified', stage=enquiry.stage or 'Not specified',
            message=enquiry.message,
        )
        try:
            EmailMessage(
                subject=site.auto_reply_subject,
                body=site.auto_reply_body.format_map(values),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[enquiry.email],
                reply_to=[site.contact_email],
            ).send()
            enquiry.confirmation_sent = True
        except Exception as exc:  # noqa: BLE001 - recorded on the enquiry for staff
            logger.exception('Could not send enquiry confirmation')
            errors.append(f'Confirmation: {exc}')

    recipients = [item.strip() for item in site.notify_emails.split(',') if item.strip()]
    if recipients:
        body = (
            f'A new enquiry was submitted on the website.\n\n'
            f'Name: {enquiry.name}\nEmail: {enquiry.email}\nPhone: {enquiry.phone or "-"}\n'
            f'Location: {enquiry.location or "-"}\nService of interest: {enquiry.service or "-"}\n'
            f'Project type: {enquiry.project_type or "-"}\nStage: {enquiry.stage or "-"}\n\n{enquiry.message}\n'
        )
        try:
            EmailMessage(
                subject=f'New enquiry from {enquiry.name}',
                body=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=recipients,
                reply_to=[enquiry.email],
            ).send()
            enquiry.alert_sent = True
        except Exception as exc:  # noqa: BLE001
            logger.exception('Could not send enquiry alert')
            errors.append(f'Alert: {exc}')

    enquiry.email_error = '\n'.join(errors)
    enquiry.save(update_fields=['confirmation_sent', 'alert_sent', 'email_error'])
