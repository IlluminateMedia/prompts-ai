from django.db import models

class CustomModel(models.Model):
    label = models.CharField(max_length=255)
    value = models.CharField(max_length=255)

    class Meta:
        app_label = "restapi"
        db_table = "restapi_custom_model"

    def __str__(self):
        return self.label