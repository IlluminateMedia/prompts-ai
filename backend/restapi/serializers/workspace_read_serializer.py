from rest_framework import serializers

from .custom_model_serializer import CustomModelSerializer
from ..models import Workspace

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
            "airtable_api_key",
            "airtable_base",
            "airtable_table",
            "category",
            "custom_model"
        )