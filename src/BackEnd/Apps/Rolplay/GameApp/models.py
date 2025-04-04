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

DEFAULT_CHARACTER_IMAGES=[ 
    'images/rolplay/games_app/character/default/character-default-00.jpg',
    'images/rolplay/games_app/character/default/character-default-01.jpg',
    'images/rolplay/games_app/character/default/character-default-02.jpg',
    'images/rolplay/games_app/character/default/character-default-03.jpg',
    'images/rolplay/games_app/character/default/character-default-04.jpg',
    'images/rolplay/games_app/character/default/character-default-05.jpg',
    'images/rolplay/games_app/character/default/character-default-06.jpg',
    'images/rolplay/games_app/character/default/character-default-07.jpg',
    'images/rolplay/games_app/character/default/character-default-08.jpg',
    'images/rolplay/games_app/character/default/character-default-09.jpg',
    'images/rolplay/games_app/character/default/character-default-10.jpg',
]

def get_random_default_game_image():
    return random.choice(DEFAULT_GAME_IMAGES)

def get_random_default_character_image():
    return random.choice(DEFAULT_CHARACTER_IMAGES)

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

def delete_related_files(instance):
    """
    Elimina todos los archivos relacionados con el objeto.
    """
    if isinstance(instance, User):
        # Eliminar todos los objetos relacionados con el usuario
        for game in instance.game_set.all():
            game.delete()

    elif isinstance(instance, Game):
        # Eliminar todos los objetos relacionados con el juego
        for diary in instance.diaries.all():
            diary.delete()
        
        for note in instance.notes.all():
            note.delete()
        
        for character in instance.character.all():
            character.delete()

    elif isinstance(instance, Diary):
        # Eliminar todos los objetos relacionados con el diario
        for entry in instance.entries.all():
            entry.delete()

    elif isinstance(instance, Character):
        # Eliminar la imagen y el archivo excel asociados
        delete_image(instance.image, instance.excel_file, default_images=DEFAULT_CHARACTER_IMAGES)

    elif isinstance(instance, Note):
        # Eliminar las imágenes asociadas a la nota
        delete_image(instance.image1, instance.image2, instance.image3)

    elif isinstance(instance, DiaryEntry):
        # Eliminar las imágenes asociadas a la entrada del diario
        delete_image(instance.image1, instance.image2, instance.image3)

class Game(models.Model):
    name = models.CharField(max_length=30, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User Relation
    description = models.CharField(max_length=60, blank=True, null=True)
    image = models.ImageField(upload_to='images/rolplay/games_app/games/', blank=True, null=True, default=get_random_default_game_image)

    def delete(self, *args, **kwargs):
        delete_related_files(self)
        # Eliminar la imagen del propio juego
        delete_image(self.image, default_images=DEFAULT_GAME_IMAGES)
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

    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image1 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)
    image2 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)
    image3 = models.ImageField(upload_to='images/rolplay/games_app/notes/', blank=True, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Nota')
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='notes')  # Game Relation
    completed = models.BooleanField(default=False)

    def delete(self, *args, **kwargs):
        delete_image(self.image1, self.image2, self.image3)
        super().delete(*args, **kwargs)
    
    def save(self, *args, **kwargs):
        if self.pk:
            old_instance = Note.objects.get(pk=self.pk)

            for field in ['image1', 'image2', 'image3']:
                old_image = getattr(old_instance, field)
                new_image = getattr(self, field)

                if old_image and old_image != new_image:
                    delete_image(old_image)

        super().save(*args, **kwargs)

class Diary(models.Model):
    name = models.CharField(max_length=30, blank=True, null=True)
    description = models.CharField(max_length=60, blank=True, null=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='diaries')  # Game Relation
    image = models.ImageField(upload_to='images/rolplay/games_app/diary/', blank=True, null=True, default=get_random_default_diary_image)

    def delete(self, *args, **kwargs):
        delete_related_files(self)
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

class Character(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='character')  
    description = models.TextField(max_length=300, blank=True, null=True)
    image = models.ImageField(upload_to='images/rolplay/games_app/character/images', blank=True, null=True, default=get_random_default_character_image)
    excel_file = models.FileField(upload_to='files/rolplay/game_app/character/', blank=True, null=True)

    def delete(self, *args, **kwargs):
        delete_image(self.image, self.excel_file, default_images=DEFAULT_CHARACTER_IMAGES)
        super().delete(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.pk:
            old_instance = Character.objects.get(pk=self.pk)

            for field in ['image', 'excel_file']:
                old_file = getattr(old_instance, field)
                new_file = getattr(self, field)

                if old_file and old_file != new_file:
                    delete_image(old_file)

        super().save(*args, **kwargs)


    