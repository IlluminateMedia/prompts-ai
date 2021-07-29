# serializers.py
from rest_framework import serializers

from .models import CustomModel, SharedPrompt

class CustomModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomModel
        fields = "__all__"

class SharedPromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedPrompt
        fields = "__all__"