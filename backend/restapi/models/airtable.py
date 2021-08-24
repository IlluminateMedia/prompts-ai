from django.db import models

class Airtable(models.Model):
    base = models.CharField(max_length=255)
    table = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    api_key = models.CharField(max_length=255)

    class Meta:
        app_label = "restapi"

    def __str__(self):
        return self.label