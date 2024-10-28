from rest_framework import generics
from .models import Note
from .serializers import NoteSerializer

class NoteListCreateAPIView(generics.ListCreateAPIView): # Create Note 
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NoteRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView): # Get  / Update / Delete Note
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
