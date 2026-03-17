from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'       # ← Full dotted path (must match INSTALLED_APPS)
    label = 'users'            # ← Short label (must match AUTH_USER_MODEL)