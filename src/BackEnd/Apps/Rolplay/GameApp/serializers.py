from rest_framework import serializers
from .models import Game, Note, Diary, DiaryEntry

#---------------------DIARY ENTRY SERIALIZER---------------------
class DiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryEntry
        fields = ['id', 'name', 'description', 'diary', 'image1', 'image2', 'image3']

    def update(self, instance, validated_data):
        # Si la imagen NO se envía en la petición, mantener la anterior.
        for field in ['image1', 'image2', 'image3']:
            if field not in validated_data:
                validated_data[field] = getattr(instance, field)

        return super().update(instance, validated_data)


#---------------------DIARY SERIALIZER---------------------
class DiarySerializer(serializers.ModelSerializer):
    entries = DiaryEntrySerializer(many=True, read_only=True) 

    class Meta:
        model = Diary
        fields = ['id', 'name', 'description', 'entries','game','image']

#---------------------NOTE SERIALIZER---------------------
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'name', 'description', 'type','game','image1', 'image2', 'image3']

#---------------------GAME SERIALIZER---------------------
class GameSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)  
    diaries = DiarySerializer(many=True, read_only=True)  

    class Meta:
        model = Game
        fields = ['id', 'name', 'description', 'image', 'notes', 'diaries','user']

