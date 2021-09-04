from django.db import models

class AirtableWorkspace(models.Model):
    
    api_key = models.CharField(max_length=255, blank=False, null=False, default="")
    source_base = models.CharField(max_length=255, blank=False, null=False, default="")
    source_table = models.CharField(max_length=255, blank=False, null=False, default="")
    destination_base = models.CharField(max_length=255, blank=False, null=False, default="")
    destination_table = models.CharField(max_length=255, blank=False, null=False, default="")

    class Meta:
        app_label = "restapi"
    
    def __str__(self):
        return self.source_base