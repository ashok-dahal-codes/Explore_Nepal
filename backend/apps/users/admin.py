from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import ContactMessage, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin configuration for our User model.
    Controls how users appear and are managed in /admin/ panel.
    """

    # What columns show in the user LIST page
    list_display = ('email', 'full_name', 'is_active', 'is_staff', 'date_joined')

    # Clickable filters on the right sidebar
    list_filter = ('is_active', 'is_staff', 'date_joined')

    # Which fields can be searched
    search_fields = ('email', 'full_name')

    # Default ordering (newest first)
    ordering = ('-date_joined',)

    # Fields shown when EDITING an existing user
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Personal Info', {
            'fields': ('full_name', 'phone', 'profile_picture')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser'),
        }),
        ('Important Dates', {
            'fields': ('last_login',),
        }),
    )

    # Fields shown when CREATING a new user from admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2'),
        }),
    )


from django.contrib import admin
from .models import User, ContactMessage, Newsletter

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'subject', 'created_at']
    search_fields = ['full_name', 'email', 'subject']
    list_filter = ['created_at']
    readonly_fields = ['created_at']

@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'subscribed_at', 'is_active']
    search_fields = ['email']
    list_filter = ['subscribed_at', 'is_active']