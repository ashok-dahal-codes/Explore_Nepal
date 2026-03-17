from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    """
    Custom manager for User model where email is the unique identifier
    instead of username.
    """

    def create_user(self, email, full_name, password=None, **extra_fields):
        """
        Create and return a regular user (tourist).
        """
        if not email:
            raise ValueError('Users must have an email address')
        if not full_name:
            raise ValueError('Users must have a full name')

        # Normalize email: lowercase the domain part
        # Example: "Ashok@GMAIL.COM" becomes "Ashok@gmail.com"
        email = self.normalize_email(email)

        # Create the user object (not saved to database yet)
        user = self.model(email=email, full_name=full_name, **extra_fields)

        # Hash the password (never store plain text!)
        # "password123" becomes something like "pbkdf2_sha256$..."
        user.set_password(password)

        # NOW save to database
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        """
        Create and return a superuser (admin - you!).
        Used when you run: python manage.py createsuperuser
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, full_name, password, **extra_fields)