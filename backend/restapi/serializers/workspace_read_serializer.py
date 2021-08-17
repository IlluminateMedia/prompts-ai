from rest_framework import serializers

from .custom_model_serializer import CustomModelSerializer
from ..models import Workspace, CustomModel

class WorkspaceReadSerializer(serializers.ModelSerializer):
    custom_model = CustomModelSerializer()

    class Meta:
        model = Workspace
        fields = (
            "id",
            "name", 
            "temperature",
            "max_tokens",
            "top_p", 
            "n",
            "presence_penalty",
            "frequency_penalty",
            "stop_symbols",
            "prompt",
            "custom_model"
        )