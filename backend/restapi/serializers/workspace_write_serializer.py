from rest_framework import serializers

from .custom_model_serializer import CustomModelSerializer
from ..models import Workspace, CustomModel


class WorkspaceWriteSerializer(serializers.ModelSerializer):
    custom_model = serializers.PrimaryKeyRelatedField(
        queryset=CustomModel.objects.all(), many=False
    )

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
