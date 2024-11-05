from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [

    #Auth
    path("register/", CreateUserView.as_view(), name="register"), #POST User
    path("token/get/", TokenObtainPairView.as_view(), name="get_token"), #GET Token
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"), #PUT Token

    path("authenticator/", include("rest_framework.urls")),#Login / Logout
    
    path("users/", ListUserView.as_view(), name="user-list"), #GET Users
    path('users/id/<int:pk>/', UserByIDDetailView.as_view(), name='user-detail-by-id'), #GET User by Id
    path('users/<str:username>/', UserByUsernameDetailView.as_view(), name='user-detail-by-username'), #GET User by name
    #Auth

]

