from rest_framework import viewsets
from .models import Character, Game, Note, Diary, DiaryEntry
from .serializers import CharacterSerializer, GameSerializer, NoteSerializer, DiarySerializer, DiaryEntrySerializer
from rest_framework.permissions import IsAuthenticated

    # Django Rest Framework creates CRUD

#---------------------GAME VIEWSET---------------------
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 

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


#---------------------CHARACTER VIEWSET---------------------
class CharacterViewSet(viewsets.ModelViewSet):
    queryset = Character.objects.all()
    serializer_class = CharacterSerializer

