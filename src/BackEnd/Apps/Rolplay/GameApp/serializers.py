from rest_framework import serializers
from .models import Game, Note, Diary, DiaryEntry, Image

#---------------------DIARY ENTRY SERIALIZER---------------------
class DiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryEntry
        fields = ['id', 'name', 'description','diary']

#---------------------DIARY SERIALIZER---------------------
class DiarySerializer(serializers.ModelSerializer):
    entries = DiaryEntrySerializer(many=True, read_only=True) 

    class Meta:
        model = Diary
        fields = ['id', 'name', 'description', 'entries','game']

#---------------------NOTE SERIALIZER---------------------
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'name', 'description', 'type','game']

#---------------------GAME SERIALIZER---------------------
class GameSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)  
    diaries = DiarySerializer(many=True, read_only=True)  

    class Meta:
        model = Game
        fields = ['id', 'name', 'description', 'image', 'notes', 'diaries','user']

#---------------------IMAGE SERIALIZER---------------------
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image','game','diary' ,'diary_entry', 'note']
