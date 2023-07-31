from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
from . import views, viewsets

router = DefaultRouter()
router.register('users', viewsets.UserViewset, 'users')

urlpatterns = [
    path('token/', views.generate_token, name='token'),
    path('token/random/', views.generate_random, name='random'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('test/', views.test),

    path('', include(router.urls)),
]
