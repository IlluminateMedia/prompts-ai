from rest_framework import serializers

from ..models import AirtableWorkspace

class AirtableWorkspaceSerializer(serializers.ModelSerializer):

    class Meta:
        model = AirtableWorkspace
        fields = (
            "id",
            "api_key",
            "src_base",
            "src_table",
            "dest_base",
            "dest_table"
        )