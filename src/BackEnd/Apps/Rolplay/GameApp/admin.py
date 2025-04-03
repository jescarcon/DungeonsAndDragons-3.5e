from django.contrib import admin
from django.contrib import admin
from .models import Character, Game, Note, Diary, DiaryEntry

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

#---------------------DIARY ENTRY ADMIN---------------------
class CharacterAdmin(admin.ModelAdmin):
    list_display = ('name','game','image','excel_file')
    search_fields = ('name','game')

# Register models in admin
admin.site.register(Game, GameAdmin)
admin.site.register(Note, NoteAdmin)
admin.site.register(Diary, DiaryAdmin)
admin.site.register(DiaryEntry, DiaryEntryAdmin)
admin.site.register(Character, CharacterAdmin)
