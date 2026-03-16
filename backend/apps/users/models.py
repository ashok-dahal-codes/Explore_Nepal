from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom User model for Explore Nepal.
    - Tourists register themselves via the register page.
    - Admins are created via: python manage.py createsuperuser
    - Guides are NOT users — they are managed separately by admin.
    """

    email = models.EmailField(
        max_length=255,
        unique=True,
        help_text='Used for login. Must be unique.'
    )
    full_name = models.CharField(
        max_length=150,
        help_text='Full name of the tourist.'
    )
    phone = models.CharField(
        max_length=20,
        blank=True,
        default='',
        help_text='Optional phone number.'
    )
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        null=True,
        help_text='Optional profile photo.'
    )

    # Django required fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Timestamps
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Use EMAIL to login, not username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    # Use our custom manager
    objects = UserManager()

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.full_name} ({self.email})'