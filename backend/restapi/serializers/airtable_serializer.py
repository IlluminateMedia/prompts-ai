from rest_framework import serializers

from ..models import Airtable

class AirtableSerializer(serializers.ModelSerializer):

    class Meta:
        model = Airtable
        fields = (
            "base",
            "table",
            "category",
            "api_key"
        )