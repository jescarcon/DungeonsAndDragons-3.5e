from django.contrib import admin
from django.contrib import admin
from .models import Game, Note, Diary, DiaryEntry, Image

#---------------------GAME ADMIN---------------------
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'description')
    search_fields = ('name', 'user__username')

#---------------------NOTE ADMIN---------------------
class NoteAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'game', 'description')
    search_fields = ('name', 'game__name')
    list_filter = ('type', 'game')

#---------------------DIARY ADMIN---------------------
class DiaryAdmin(admin.ModelAdmin):
    list_display = ('name', 'game', 'description')
    search_fields = ('name', 'game__name')

#---------------------DIARY ENTRY ADMIN---------------------
class DiaryEntryAdmin(admin.ModelAdmin):
    list_display = ('name', 'diary', 'description')
    search_fields = ('name', 'diary__name')

#---------------------IMAGE ADMIN---------------------
class ImageAdmin(admin.ModelAdmin):
    list_display = ('diary_entry', 'note', 'image')
    search_fields = ('diary_entry__name', 'note__name')
    list_filter = ('diary_entry', 'note')

# Register models in admin
admin.site.register(Game, GameAdmin)
admin.site.register(Note, NoteAdmin)
admin.site.register(Diary, DiaryAdmin)
admin.site.register(DiaryEntry, DiaryEntryAdmin)
admin.site.register(Image, ImageAdmin)
