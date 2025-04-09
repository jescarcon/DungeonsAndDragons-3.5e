from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import User
from django.contrib.auth.models import User
from .serializers import *
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.exceptions import PermissionDenied

class CreateUserView(generics.CreateAPIView): #Post user
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ListUserView(generics.ListAPIView): #Get user list
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserByUsernameDetailView(generics.RetrieveAPIView): #Get user by Username
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_object(self):
        username = self.kwargs.get("username")
        return get_object_or_404(User, username=username)

class UserByIDDetailView(generics.RetrieveAPIView): #Get user by ID
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(User, pk=pk)


# views.py
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer

class UpdateOwnProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user  # Devuelve el usuario autenticado

        
#@api_view(['POST'])
#def create_admin_user(request):
#    if request.method == 'POST':
#        username = request.data.get('username')
#        password = request.data.get('password')
#        if not username or not password:
#            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
#        
#        if User.objects.filter(username=username).exists():
#            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
#        
#        user = User.objects.create_superuser(username=username, password=password)
#        return Response({"message": "Admin user created successfully."}, status=status.HTTP_201_CREATED)
