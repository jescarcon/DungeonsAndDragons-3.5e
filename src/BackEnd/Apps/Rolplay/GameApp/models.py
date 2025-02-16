from django.db import models
from django.contrib.auth.models import User
import os
import random

# --------------------- FUNCIONES AUXILIARES ---------------------

# Lista de imágenes por defecto para juegos y diarios
DEFAULT_GAME_IMAGES = [
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

DEFAULT_DIARY_IMAGES = [
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

def get_random_default_game_image():
    return random.choice(DEFAULT_GAME_IMAGES)

def get_random_default_diary_image():
    return random.choice(DEFAULT_DIARY_IMAGES)

def delete_image(*image_fields, default_images=None):
    """
    Elimina las imágenes del sistema de archivos si no están en la lista de imágenes por defecto.
    """
    for image_field in image_fields:
        if image_field and image_field.name:
            if default_images and image_field.name in default_images:
                continue  # No eliminar si es una imagen por defecto

            image_path = image_field.path
            if os.path.isfile(image_path):
                os.remove(image_path)

# --------------------- MODELOS ---------------------

class Game(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User Relation
    description = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='images/rolplay/games_app/games/', blank=True, null=True, default=get_random_default_game_image)

    def delete(self, *args, **kwargs):
        # Eliminar imágenes de los diarios y notas asociadas
        for diary in self.diaries.all():
            diary.delete()

        for note in self.notes.all():
            note.delete()

        # Eliminar la imagen del propio juego
        delete_image(self.image, default_images=DEFAULT_GAME_IMAGES)

        # Finalmente, eliminar el objeto
        super().delete(*args, **kwargs)
    
    def save(self, *args, **kwargs):
        if self.pk:
            old_instance = Game.objects.get(pk=self.pk)
            if old_instance.image and old_instance.image != self.image:
                delete_image(old_instance.image, default_images=DEFAULT_GAME_IMAGES)

        super().save(*args, **kwargs)


class Note(models.Model):
    TYPE_CHOICES = [
        ('Misión Principal', 'Misión Principal'),
        ('Misión Secundaria', 'Misión Secundaria'),
        ('Personaje', 'Personaje'),
        ('Bestiario', 'Bestiario'),
        ('Nota', 'Nota'),
    ]

    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    image1 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)
    image2 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)
    image3 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Nota')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='notes')  # Game Relation

    def delete(self, *args, **kwargs):
        delete_image(self.image1, self.image2, self.image3)
        super().delete(*args, **kwargs)


class Diary(models.Model):
    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='diaries')  # Game Relation
    image = models.ImageField(upload_to='images/rolplay/games_app/diary/', blank=True, null=True, default=get_random_default_diary_image)

    def delete(self, *args, **kwargs):
        # Eliminar imágenes de las entradas del diario
        for entry in self.entries.all():
            entry.delete()

        # Eliminar la imagen del diario
        delete_image(self.image, default_images=DEFAULT_DIARY_IMAGES)

        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.pk:
            old_instance = Diary.objects.get(pk=self.pk)
            if old_instance.image and old_instance.image != self.image:
                delete_image(old_instance.image, default_images=DEFAULT_DIARY_IMAGES)

        super().save(*args, **kwargs)


class DiaryEntry(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, related_name='entries')  # Diary Relation
    image1 = models.ImageField(upload_to='images/rolplay/games_app/diary_entries/', blank=True, null=True)
    image2 = models.ImageField(upload_to='images/rolplay/games_app/diary_entries/', blank=True, null=True)
    image3 = models.ImageField(upload_to='images/rolplay/games_app/diary_entries/', blank=True, null=True)

    def delete(self, *args, **kwargs):
        delete_image(self.image1, self.image2, self.image3)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.pk:
            old_instance = DiaryEntry.objects.get(pk=self.pk)

            for field in ['image1', 'image2', 'image3']:
                old_image = getattr(old_instance, field)
                new_image = getattr(self, field)

                if old_image and old_image != new_image:
                    delete_image(old_image)

        super().save(*args, **kwargs)
