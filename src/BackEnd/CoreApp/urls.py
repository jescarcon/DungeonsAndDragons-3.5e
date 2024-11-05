from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/authApp/', include('Apps.User.AuthApp.urls')),  # default_note_app URLs
]