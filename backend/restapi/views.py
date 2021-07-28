from rest_framework import viewsets

from .serializers import CustomModelSerializer, SharedPromptSerializer
from .models import CustomModel, SharedPrompt


class CustomModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomModel.objects.all()
    serializer_class = CustomModelSerializer

class SharedPromptViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SharedPrompt.objects.all()
    serializer_class = SharedPromptSerializer

