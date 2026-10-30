from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .emails import send_enquiry_emails
from .seo import Content, build_pages
from .serializers import EnquirySerializer, full_payload


class SiteView(APIView):
    """Everything the public website renders, in one request."""

    def get(self, request):
        response = Response(full_payload(build_pages(Content())))
        response['Cache-Control'] = 'no-cache'
        return response


class EnquiryView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'enquiry'

    def post(self, request):
        serializer = EnquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        if data.pop('website', ''):
            # Bot filled the honeypot: pretend it worked, store nothing.
            return Response({'ok': True}, status=status.HTTP_201_CREATED)
        enquiry = serializer.save()
        send_enquiry_emails(enquiry)
        return Response({'ok': True, 'confirmationSent': enquiry.confirmation_sent}, status=status.HTTP_201_CREATED)
