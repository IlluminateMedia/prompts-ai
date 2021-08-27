from django.db import models
from django.utils.translation import gettext_lazy as _

from .custom_model import CustomModel

class Workspace(models.Model):
    name = models.CharField(max_length=255, blank=False)
    custom_model = models.ForeignKey(CustomModel, related_name="workspaces", on_delete=models.CASCADE, blank=True)
    temperature = models.CharField(max_length=255, blank=False)
    max_tokens = models.CharField(max_length=255, blank=False)
    top_p = models.CharField(max_length=255, blank=False)
    n = models.CharField(max_length=255, blank=False)
    presence_penalty = models.CharField(max_length=255, blank=False)
    frequency_penalty = models.CharField(max_length=255, blank=False)
    stop_symbols = models.JSONField(default=dict)
    prompt = models.TextField(blank=True, null=True)
    airtable_base = models.CharField(max_length=255, blank=False, default="")
    airtable_table = models.CharField(max_length=255, blank=False, default="")
    category = models.CharField(max_length=255, blank=False, default="")
    airtable_api_key = models.CharField(max_length=255, blank=False, default="")

    class Meta:
        app_label = "restapi"