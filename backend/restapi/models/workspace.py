from django.db import models
from django.utils.translation import gettext_lazy as _

from .custom_model import CustomModel

class Workspace(models.Model):
    name = models.CharField(max_length=255, blank=False)
    custom_model = models.ForeignKey(CustomModel, related_name="workspaces", on_delete=models.CASCADE, blank=True)
    temperature = models.DecimalField(help_text=_("Temperature"), max_digits=5, decimal_places=2, default=0.00)
    max_tokens = models.DecimalField(help_text=_("Max Tokens"), max_digits=5, decimal_places=2, default=0.00)
    top_p = models.DecimalField(help_text=_("Top P"), max_digits=5, decimal_places=2, default=0.00)
    n = models.IntegerField(default=1)
    presence_penalty = models.DecimalField(help_text=_("Presence Penalty"), max_digits=5, decimal_places=2, default=0.00)
    frequency_penalty = models.DecimalField(help_text=_("Frequency Penalty"), max_digits=5, decimal_places=2, default=0.00)
    stop_symbols = models.JSONField(default=dict)
    prompt = models.TextField(blank=True, null=True)


    class Meta:
        app_label = "restapi"