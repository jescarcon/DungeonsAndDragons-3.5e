from django.db import models
from django.contrib.auth.models import User
import os
import random

#---------------------GAME---------------------
def get_random_default_game_image():
    default_images = [
            'images/rolplay/games_app/games/default/game-wallpaper-default-00.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-01.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-02.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-03.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-04.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-05.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-06.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-07.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-08.jpg',
            'images/rolplay/games_app/games/default/game-wallpaper-default-09.jpg',
        ]
    return random.choice(default_images)
        
class Game(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User Relation
    description = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='images/rolplay/games_app/games/', blank=True, null=True, default=get_random_default_game_image)

#---------------------NOTES OF A GAME---------------------
class Note(models.Model):

    TYPE_CHOICES = [
        ('Misión Principal', 'Misión Principal'),
        ('Misión Secundaria', 'Misión Secundaria'),
        ('Personaje', 'Personaje'),
        ('Bestiario', 'Bestiario'),
        ('Nota', 'Nota'),
    ]

    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=50, blank=True, null=True)
    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='Nota',
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='notes')  # Game Relation

#---------------------DIARY OF A GAME---------------------
def get_random_default_diary_image():
    # Lista de rutas de las 10 imágenes por defecto
    default_images = [
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-00.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-01.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-02.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-03.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-04.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-05.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-06.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-07.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-08.jpg',
                'images/rolplay/games_app/diary/default/diary-wallpaper-default-09.jpg',
        ]
    return random.choice(default_images)

class Diary(models.Model):
    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=50, blank=True, null=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='diaries')  # Game Relation
    image = models.ImageField(upload_to='images/rolplay/games_app/diary/', blank=True, null=True,default=get_random_default_diary_image)

class DiaryEntry(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, related_name='entries')  # Diary Relation



