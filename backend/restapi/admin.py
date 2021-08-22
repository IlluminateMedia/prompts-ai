# Register your models here.
from django.contrib import admin
from .models import CustomModel, SharedPrompt, Workspace

class CustomModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'label', 'value')
    search_fields = ('label', 'value')

class SharedPromptAdmin(admin.ModelAdmin):
    list_display = ('id', 'engine', 'maxTokens', 'stop', 'prompt', 'temperature', 'topP', 'presencePenalty', 'frequencyPenalty', 'examples')
    search_fields = ('engine', 'maxTokens', 'stop', 'prompt', 'temperature', 'topP', 'presencePenalty', 'frequencyPenalty', 'examples')

class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'temperature', 'top_p', 'n', 'presence_penalty', 'frequency_penalty', 'stop_symbols', 'prompt', 'custom_model')
    search_fields = ('name', 'temperature', 'top_p', 'n', 'presence_penalty', 'frequency_penalty', 'stop_symbols', 'prompt', 'custom_model')

admin.site.register(CustomModel, CustomModelAdmin)
admin.site.register(SharedPrompt, SharedPromptAdmin)
admin.site.register(Workspace, WorkspaceAdmin)
