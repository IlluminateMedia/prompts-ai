from django.db import models

# Create your models here.

class CustomModel(models.Model):
    label = models.CharField(max_length=255)
    value = models.CharField(max_length=255)

    def __str__(self):
        return self.value

class SharedPrompt(models.Model):
    engine = models.CharField(max_length=255, blank=True)
    maxTokens = models.IntegerField(default=0)
    stop = models.JSONField(default=dict)
    prompt = models.CharField(max_length=255, blank=True)
    temperature = models.IntegerField(default=0)
    topP = models.IntegerField(default=0)
    presencePenalty = models.IntegerField(default=0)
    frequencyPenalty = models.IntegerField(default=0)
    examples = models.JSONField(default=dict)

    def __str__(self):
        return self.engine