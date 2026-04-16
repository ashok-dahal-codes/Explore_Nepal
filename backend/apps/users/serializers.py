from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import ContactMessage, Newsletter

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles tourist registration.
    Accepts: full_name, email, password, password_confirm
    Creates: a new User in the database
    """

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        help_text='Minimum 8 characters.'
    )
    password_confirm = serializers.CharField(
        write_only=True,
        help_text='Must match password.'
    )

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'password', 'password_confirm')

    def validate_email(self, value):
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value.lower()

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    Handles tourist login.
    Accepts: email, password
    Returns: validated user object
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        from django.contrib.auth import authenticate

        email = attrs.get('email', '').lower()
        password = attrs.get('password', '')

        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password,
        )

        if not user:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')

        attrs['user'] = user
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    For viewing and updating tourist profile.
    - GET request:  Returns user data as JSON
    - PATCH request: Updates name, phone, picture
    """

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone', 'profile_picture', 'date_joined')
        read_only_fields = ('id', 'email', 'date_joined')


class ContactMessageSerializer(serializers.ModelSerializer):
    """
    For handling contact form submissions.
    Accepts: full_name, email, subject, message
    """
    class Meta:
        model = ContactMessage
        fields = ['id', 'full_name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class NewsletterSerializer(serializers.ModelSerializer):
    """
    For handling newsletter subscriptions.
    Accepts: email
    """
    class Meta:
        model = Newsletter
        fields = ['id', 'email', 'subscribed_at']
        read_only_fields = ['id', 'subscribed_at']