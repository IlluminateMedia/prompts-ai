# Register your models here.
from django.contrib import admin
from .models import CustomModel, SharedPrompt

class CustomModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'label', 'value')
    search_fields = ('label', 'value')

class SharedPromptAdmin(admin.ModelAdmin):
    list_display = ('id', 'engine', 'maxTokens', 'stop', 'prompt', 'temperature', 'topP', 'presencePenalty', 'frequencyPenalty', 'examples')
    search_fields = ('engine', 'maxTokens', 'stop', 'prompt', 'temperature', 'topP', 'presencePenalty', 'frequencyPenalty', 'examples')

admin.site.register(CustomModel, CustomModelAdmin)
admin.site.register(SharedPrompt, SharedPromptAdmin)