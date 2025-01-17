# restapi/urls.py
from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .jwt import JWTTokenObtainPairView
from . import views

router = routers.DefaultRouter()
router.register(r'airtable', views.AirtableViewSet)
router.register(r'models', views.CustomModelViewSet)
router.register(r'workspace', views.WorkspaceViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'airtable_workspaces', views.AirtableWorkspaceViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('user/', views.UserViews.as_view(), name='user'),
    path('token/', JWTTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]