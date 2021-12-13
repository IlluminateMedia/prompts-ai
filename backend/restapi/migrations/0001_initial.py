# Generated by Django 3.2.5 on 2021-09-02 11:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Airtable',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('base', models.CharField(max_length=255)),
                ('table', models.CharField(max_length=255)),
                ('category', models.CharField(max_length=255)),
                ('api_key', models.CharField(max_length=255)),
            ],
        ),
        # migrations.CreateModel(
        #     name='AirtableWorkspace',
        #     fields=[
        #         ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        #         ('api_key', models.CharField(default='', max_length=255)),
        #         ('source_base', models.CharField(default='', max_length=255)),
        #         ('source_table', models.CharField(default='', max_length=255)),
        #         ('destination_base', models.CharField(default='', max_length=255)),
        #         ('destination_table', models.CharField(default='', max_length=255)),
        #     ],
        # ),
        migrations.CreateModel(
            name='CustomModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('label', models.CharField(max_length=255)),
                ('value', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SharedPrompt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('engine', models.CharField(blank=True, max_length=255)),
                ('maxTokens', models.IntegerField(default=0)),
                ('stop', models.JSONField(default=dict)),
                ('prompt', models.CharField(blank=True, max_length=255)),
                ('temperature', models.IntegerField(default=0)),
                ('topP', models.IntegerField(default=0)),
                ('presencePenalty', models.IntegerField(default=0)),
                ('frequencyPenalty', models.IntegerField(default=0)),
                ('examples', models.JSONField(default=dict)),
            ],
        ),
        migrations.CreateModel(
            name='Workspace',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('temperature', models.CharField(max_length=255)),
                ('max_tokens', models.CharField(max_length=255)),
                ('top_p', models.CharField(max_length=255)),
                ('n', models.CharField(max_length=255)),
                ('presence_penalty', models.CharField(max_length=255)),
                ('frequency_penalty', models.CharField(max_length=255)),
                ('stop_symbols', models.JSONField(default=dict)),
                ('prompt', models.TextField(blank=True, null=True)),
                ('airtable_base', models.CharField(default='', max_length=255)),
                ('airtable_table', models.CharField(default='', max_length=255)),
                ('airtable_name', models.CharField(default='', max_length=255)),
                ('category', models.CharField(default='', max_length=255)),
                ('airtable_api_key', models.CharField(default='', max_length=255)),
                ('custom_model', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='workspaces', to='restapi.custommodel')),
            ],
        ),
    ]
