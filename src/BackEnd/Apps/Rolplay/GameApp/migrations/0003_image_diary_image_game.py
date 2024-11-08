# Generated by Django 5.1.2 on 2024-11-06 09:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('GameApp', '0002_alter_game_image_alter_image_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='diary',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='images', to='GameApp.diary'),
        ),
        migrations.AddField(
            model_name='image',
            name='game',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='images', to='GameApp.game'),
        ),
    ]
