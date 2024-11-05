from rest_framework import viewsets
from .models import Game, Note, Diary, DiaryEntry, Image
from .serializers import GameSerializer, NoteSerializer, DiarySerializer, DiaryEntrySerializer, ImageSerializer
from rest_framework.permissions import IsAuthenticated

    # Django Rest Framework creates CRUD

#---------------------GAME VIEWSET---------------------
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = [IsAuthenticated]  

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 

#---------------------NOTES VIEWSET---------------------
class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]  

#---------------------DIARY VIEWSET---------------------
class DiaryViewSet(viewsets.ModelViewSet):
    queryset = Diary.objects.all()
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated]  

#---------------------DIARY ENTRY VIEWSET---------------------
class DiaryEntryViewSet(viewsets.ModelViewSet):
    queryset = DiaryEntry.objects.all()
    serializer_class = DiaryEntrySerializer
    permission_classes = [IsAuthenticated]  

#---------------------IMAGE VIEWSET---------------------
class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]  
