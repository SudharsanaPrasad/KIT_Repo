# Generated by Django 3.2.3 on 2021-06-25 14:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_bora_name'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bora',
            old_name='name',
            new_name='key',
        ),
        migrations.AddField(
            model_name='bora',
            name='title',
            field=models.CharField(default='Bora Instance', max_length=100),
            preserve_default=False,
        ),
    ]
