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
            "best_of",
            "n",
            "presence_penalty",
            "frequency_penalty",
            "stop_symbols",
            "prompt",
            "airtable_api_key",
            "airtable_base",
            "airtable_table",
            "airtable_name",
            "category",
            "custom_model",
        )
