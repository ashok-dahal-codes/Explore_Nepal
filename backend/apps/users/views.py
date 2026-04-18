from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    ContactMessageSerializer, RegisterSerializer, LoginSerializer, 
    UserProfileSerializer, NewsletterSerializer
)
from .models import ContactMessage, Newsletter
from .email_service import EmailService
import requests as http_requests
import uuid


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Registration successful!',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            return Response({
                'message': 'Login successful!',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')

            if not refresh_token:
                return Response({
                    'error': 'Refresh token is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({
                'message': 'Logout successful!'
            }, status=status.HTTP_200_OK)

        except Exception:
            return Response({
                'error': 'Invalid token.'
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully!',
                'user': serializer.data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SocialLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        provider = request.data.get('provider')
        access_token = request.data.get('access_token')

        if not provider or not access_token:
            return Response(
                {'error': 'Both provider and access_token are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if provider != 'google':
            return Response(
                {'error': 'Provider must be "google".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            resp = http_requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'},
                timeout=10,
            )

            if resp.status_code != 200:
                return Response(
                    {'error': 'Invalid access token.'},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            social_data = resp.json()
        except http_requests.RequestException:
            return Response(
                {'error': 'Failed to verify token with provider.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        email = social_data.get('email')
        if not email:
            return Response(
                {'error': 'Email not provided by the social provider.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        full_name = social_data.get('name') or email.split('@')[0]

        from .models import User
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'full_name': full_name,
                'password': uuid.uuid4().hex,
            },
        )

        if not user.is_active:
            return Response(
                {'error': 'This account has been deactivated.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Social login successful!',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
            },
        }, status=status.HTTP_200_OK)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoints for contact messages.
    POST /api/users/contact/ - Create a new contact message (sends reply email)
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]


class NewsletterViewSet(viewsets.ModelViewSet):
    """
    API endpoints for newsletter subscriptions.
    POST /api/users/newsletter/ - Subscribe to newsletter (sends welcome email)
    GET /api/users/newsletter/ - List all subscribers (admin only)
    DELETE /api/users/newsletter/{id}/ - Unsubscribe (admin only)
    """
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def send_promotional(self, request):
        """
        POST /api/users/newsletter/send_promotional/
        Send promotional email to active subscribers
        
        Body: {
            "subject": "...",
            "message_html": "..."
        }
        """
        subject = request.data.get('subject')
        message_html = request.data.get('message_html')

        if not subject or not message_html:
            return Response(
                {'error': 'Subject and message_html are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get active subscribers
        subscribers = Newsletter.objects.filter(is_active=True)
        emails = list(subscribers.values_list('email', flat=True))

        if not emails:
            return Response(
                {'error': 'No active subscribers found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Send email
        success = EmailService.send_promotional_email(subject, message_html, emails)

        if success:
            return Response({
                'message': f'✓ Email sent to {len(emails)} subscribers!',
                'count': len(emails)
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Error sending emails.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )