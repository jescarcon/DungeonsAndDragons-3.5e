from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/NoteApp/', include('Apps.default_note_app.urls')),  # default_note_app URLs
]