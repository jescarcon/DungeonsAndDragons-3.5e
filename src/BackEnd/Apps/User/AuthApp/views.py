from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import User
from django.contrib.auth.models import User
from .serializers import *
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

class CreateUserView(generics.CreateAPIView): #Post user
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ListUserView(generics.ListAPIView): #Get user list
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserByUsernameDetailView(generics.RetrieveAPIView): #Get user by Username
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def get_object(self):
        username = self.kwargs.get("username")
        return get_object_or_404(User, username=username)

class UserByIDDetailView(generics.RetrieveAPIView): #Get user by ID
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(User, pk=pk)


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
