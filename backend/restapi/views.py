from django.contrib.auth.models import User
from rest_framework import viewsets

from .serializers import CustomModelSerializer, WorkspaceReadSerializer, WorkspaceWriteSerializer, UserSerializer

from .models import CustomModel, Workspace
from django.contrib.auth.models import User


class CustomModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomModel.objects.all()
    serializer_class = CustomModelSerializer

class WorkspaceViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return WorkspaceWriteSerializer

        return WorkspaceReadSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer