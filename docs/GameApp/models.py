from django.db import models
from django.contrib.auth.models import User
import os

#---------------------GAME---------------------
class Game(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User Relation
    description = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='images/rolplay/games_app/games/')

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
    image1 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)
    image2 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)
    image3 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)

    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='notes')  # Game Relation

#---------------------DIARY OF A GAME---------------------
class Diary(models.Model):
    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=50, blank=True, null=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='diaries')  # Game Relation

class DiaryEntry(models.Model):
    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, related_name='entries')  # Diary Relation

def get_image_upload_path(instance, filename):
    if instance.diary_entry:
        # Si es para una entrada de diario
        return os.path.join('images/rolplay/games_app/diary_entries/', filename)
    elif instance.note:
        # Si es para una nota
        return os.path.join('images/rolplay/games_app/notes/', filename)
    raise ValueError("The image is not associated with either a DiaryEntry or a Note.")

class Image(models.Model):
    image = models.ImageField(upload_to=get_image_upload_path)
    diary_entry = models.ForeignKey(DiaryEntry, on_delete=models.CASCADE, related_name='images', null=True, blank=True)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='images', null=True, blank=True)

