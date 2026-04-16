import uuid
from rest_framework import viewsets
import requests as http_requests
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import ContactMessageSerializer, NewsletterSerializer, RegisterSerializer, LoginSerializer, UserProfileSerializer
from .models import ContactMessage, Newsletter, User


class RegisterView(APIView):
    """
    POST /api/users/register/

    Allows anyone (no login required) to create a tourist account.

    What happens:
    1. Frontend sends: { email, full_name, password, password_confirm }
    2. Serializer validates the data
    3. Creates user in database
    4. Generates JWT tokens
    5. Returns tokens + user info
    """

    # AllowAny = no login required (tourists need to register BEFORE they have an account!)
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        # Check if data is valid (email format, passwords match, etc.)
        if serializer.is_valid():
            # Save user to database (calls serializer's create() method)
            user = serializer.save()

            # Generate JWT tokens for the new user
            # So they're automatically logged in after registering
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

        # If validation failed, return errors
        # Example: { "email": ["A user with this email already exists."] }
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    POST /api/users/login/

    Allows anyone to login with email + password.

    What happens:
    1. Frontend sends: { email, password }
    2. Serializer checks credentials against database
    3. If correct, generates JWT tokens
    4. Returns tokens + user info
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            # Get the authenticated user from serializer
            user = serializer.validated_data['user']

            # Generate JWT tokens
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
    """
    POST /api/users/logout/

    Requires login. Blacklists the refresh token so it can't be used again.

    What happens:
    1. Frontend sends: { refresh: "the_refresh_token" }
    2. Server blacklists that token
    3. User must login again to get new tokens
    """

    # IsAuthenticated = must be logged in (must send access token in header)
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get the refresh token from request body
            refresh_token = request.data.get('refresh')

            if not refresh_token:
                return Response({
                    'error': 'Refresh token is required.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Blacklist the token so it can't be used again
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({
                'message': 'Logout successful!'
            }, status=status.HTTP_200_OK)

        except Exception:
            return Response({
                'error': 'Invalid token.'
            }, status=status.HTTP_400_BAD_REQUEST)


class SocialLoginView(APIView):
    """
    POST /api/users/social-login/

    Authenticates a user via Google or Facebook OAuth access token.
    Creates a new account if the email doesn't exist yet.
    Returns JWT tokens + user data.
    """

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

        # Verify token with Google and get user info
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

        # Derive full name from provider response
        full_name = social_data.get('name') or email.split('@')[0]

        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'full_name': full_name,
                'password': uuid.uuid4().hex,  # unusable random password
            },
        )

        if not user.is_active:
            return Response(
                {'error': 'This account has been deactivated.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Generate JWT tokens
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


class ProfileView(APIView):
    """
    GET    /api/users/profile/  → View your profile
    PATCH  /api/users/profile/  → Update your profile (name, phone, picture)

    Requires login. Returns/updates the CURRENT logged-in user's profile.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Return the current user's profile data.
        request.user = the logged-in user (Django sets this from the JWT token)
        """
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        """
        Update the current user's profile.
        partial=True means they don't have to send ALL fields,
        just the ones they want to change.

        Example: { "phone": "9841234567" } — only updates phone
        """
        serializer = UserProfileSerializer(
            request.user,           # Which user to update
            data=request.data,      # New data from frontend
            partial=True            # Allow partial updates
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully!',
                'user': serializer.data
            }, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]


class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]