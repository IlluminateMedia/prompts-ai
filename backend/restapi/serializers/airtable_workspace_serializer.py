from rest_framework import serializers

from ..models import AirtableWorkspace

class AirtableWorkspaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = AirtableWorkspace
        fields = (
            "id",
            "api_key",
            "source_base",
            "source_table",
            "destination_base",
            "destination_table"
        )