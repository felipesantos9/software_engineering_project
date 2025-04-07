# Generated by Django 4.2.17 on 2025-03-26 23:49

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='cnpj',
            field=models.CharField(blank=True, max_length=14, null=True, unique=True, validators=[django.core.validators.RegexValidator(code='invalid_cnpj', message='O CNPJ deve conter exatamente 14 dígitos numéricos.', regex='^\\d{14}$')], verbose_name='CNPJ'),
        ),
    ]
