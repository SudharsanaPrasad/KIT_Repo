# Generated by Django 3.2.3 on 2021-06-30 15:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_auto_20210625_1431'),
    ]

    operations = [
        migrations.CreateModel(
            name='LegacyControlIdMappings',
            fields=[
                ('uuid', models.CharField(max_length=36, primary_key=True, serialize=False)),
                ('adei_path', models.CharField(max_length=100)),
                ('katrin_id', models.CharField(max_length=50)),
            ],
        ),
    ]
