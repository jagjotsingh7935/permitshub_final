from django.urls import path

from .views import EnquiryView, SiteView

urlpatterns = [
    path('site/', SiteView.as_view(), name='site'),
    path('enquiries/', EnquiryView.as_view(), name='enquiry-create'),
]
