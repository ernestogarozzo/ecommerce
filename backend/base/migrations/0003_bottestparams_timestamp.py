# Generated by Django 3.2.14 on 2023-02-22 17:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0002_auto_20230205_1140'),
    ]

    operations = [
        migrations.AddField(
            model_name='bottestparams',
            name='timestamp',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
