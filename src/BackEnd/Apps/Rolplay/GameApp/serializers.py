from rest_framework import serializers
from .models import Game, Note, Diary, DiaryEntry, Image

#---------------------DIARY ENTRY SERIALIZER---------------------
class DiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryEntry
        fields = ['id', 'name', 'description']

#---------------------DIARY SERIALIZER---------------------
class DiarySerializer(serializers.ModelSerializer):
    entries = DiaryEntrySerializer(many=True, read_only=True)  # Anidar las entradas del diario

    class Meta:
        model = Diary
        fields = ['id', 'name', 'description', 'entries']

#---------------------NOTE SERIALIZER---------------------
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'name', 'description', 'type']

#---------------------GAME SERIALIZER---------------------
class GameSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)  # Anidar las notas del juego
    diaries = DiarySerializer(many=True, read_only=True)  # Anidar los diarios y sus entradas

    class Meta:
        model = Game
        fields = ['id', 'name', 'description', 'image', 'notes', 'diaries','user']

#---------------------IMAGE SERIALIZER---------------------
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image', 'diary_entry', 'note']
