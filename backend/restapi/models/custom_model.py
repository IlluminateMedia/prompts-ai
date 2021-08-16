from django.db import models

class CustomModel(models.Model):
    label = models.CharField(max_length=255)
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value