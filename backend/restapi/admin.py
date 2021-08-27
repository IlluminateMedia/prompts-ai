# Register your models here.
from django.contrib import admin
from .models import CustomModel, SharedPrompt, Workspace, Airtable

class CustomModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'label', 'value')
    search_fields = ('label', 'value')

class SharedPromptAdmin(admin.ModelAdmin):
    list_display = ('id', 'engine', 'maxTokens', 'stop', 'prompt', 'temperature', 'topP', 'presencePenalty', 'frequencyPenalty', 'examples')
    search_fields = ('engine', 'maxTokens', 'stop', 'prompt', 'temperature', 'topP', 'presencePenalty', 'frequencyPenalty', 'examples')

class WorkspaceAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'name', 'temperature', 'top_p', 'n', 'presence_penalty', 'frequency_penalty', 'stop_symbols', 'prompt', 'custom_model',
        'airtable_base', 'airtable_table', 'category', 'airtable_api_key'
    )
    search_fields = ('name', 'temperature', 'top_p', 'n', 'presence_penalty', 'frequency_penalty', 'stop_symbols', 'prompt', 'custom_model')

class AirtableAdmin(admin.ModelAdmin):
    list_display = ('id', 'base', 'table', 'api_key')
    search_fields = ('base', 'table', 'api_key')

admin.site.register(CustomModel, CustomModelAdmin)
admin.site.register(SharedPrompt, SharedPromptAdmin)
admin.site.register(Workspace, WorkspaceAdmin)
admin.site.register(Airtable, AirtableAdmin)
