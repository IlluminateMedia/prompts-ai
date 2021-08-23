# restapi/urls.py
from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .jwt import JWTTokenObtainPairView
from . import views

router = routers.DefaultRouter()
router.register(r'models', views.CustomModelViewSet)
router.register(r'workspace', views.WorkspaceViewSet)
router.register(r'user', views.UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('token/', JWTTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]