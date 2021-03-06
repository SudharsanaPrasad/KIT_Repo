# Generated by Django 3.2.3 on 2021-07-05 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_legacycontrolblockinfo_legacycontrolitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='legacycontrolitem',
            name='axis',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='legacycontrolitem',
            name='block_id',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='legacycontrolitem',
            name='block_name',
            field=models.CharField(max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='legacycontrolitem',
            name='name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='legacycontrolitem',
            name='read',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='legacycontrolitem',
            name='uid',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='legacycontrolitem',
            name='write',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
