from rest_framework import viewsets
from .models import Game, Note, Diary, DiaryEntry, Image
from .serializers import GameSerializer, NoteSerializer, DiarySerializer, DiaryEntrySerializer, ImageSerializer

    # Django Rest Framework creates CRUD

#---------------------GAME VIEWSET---------------------
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

#---------------------NOTES VIEWSET---------------------
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
 
#---------------------DIARY VIEWSET---------------------
class DiaryViewSet(viewsets.ModelViewSet):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
 
#---------------------DIARY ENTRY VIEWSET---------------------
class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all()
    serializer_class = DiaryEntrySerializer
 
#---------------------IMAGE VIEWSET---------------------
class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
 