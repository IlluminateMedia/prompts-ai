from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import Http404

from .serializers import CustomModelSerializer, WorkspaceReadSerializer, WorkspaceWriteSerializer, UserSerializer, AirtableSerializer, AirtableWorkspaceSerializer

from .models import CustomModel, Workspace, Airtable, AirtableWorkspace


class CustomModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomModel.objects.all()
    serializer_class = CustomModelSerializer

class WorkspaceViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return WorkspaceWriteSerializer

        return WorkspaceReadSerializer

class AirtableViewSet(viewsets.ModelViewSet):
    queryset = Airtable.objects.all()
    serializer_class = AirtableSerializer

    def list(self, request):
        airtable = Airtable.objects.first()
        if not airtable :
            raise Http404
        serializer = AirtableSerializer(airtable)
        return Response(serializer.data)

class AirtableWorkspaceViewSet(viewsets.ModelViewSet):
    queryset = AirtableWorkspace.objects.all()
    serializer_class = AirtableWorkspaceSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)