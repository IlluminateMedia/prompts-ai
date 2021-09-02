from django.db import models

class AirtableWorkspace(models.Model):
    api_key = models.CharField(max_length=255, blank=False, null=False, default="")
    soruce_base = models.CharField(max_length=255, blank=False, null=False, default=""),
    soruce_table = models.CharField(max_length=255, blank=False, null=False, default="")
    destination_base = models.CharField(max_length=255, blank=False, null=False, default="")
    destination_table = models.CharField(max_length=255, blank=False, null=False, default="")

    class Meta:
        app_label = "restapi"
        db_table = "restapi_airtable_workspace"
    
    def __str__(self):
        return self.soruce_base