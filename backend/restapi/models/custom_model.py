from django.db import models

class CustomModel(models.Model):
    label = models.CharField(max_length=255)
    value = models.CharField(max_length=255)

    class Meta:
        app_label = "restapi"

    def __str__(self):
        return self.label