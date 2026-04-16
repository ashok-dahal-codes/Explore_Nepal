from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView, 
    SocialLoginView, ContactMessageViewSet, NewsletterViewSet
)

router = DefaultRouter()
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'newsletter', NewsletterViewSet, basename='newsletter')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('social-login/', SocialLoginView.as_view(), name='social-login'),
    path('', include(router.urls)),
]