from rest_framework.routers import DefaultRouter
from .views import CharacterViewSet, GameViewSet, NoteViewSet, DiaryViewSet, DiaryEntryViewSet
from django.urls import path,include


router = DefaultRouter()
router.register(r'games', GameViewSet)
router.register(r'notes', NoteViewSet)
router.register(r'diaries', DiaryViewSet)
router.register(r'diaryentries', DiaryEntryViewSet)
router.register(r'character', CharacterViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
