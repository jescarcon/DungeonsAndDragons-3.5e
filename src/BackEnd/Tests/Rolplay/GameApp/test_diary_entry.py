import pytest
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from Apps.Rolplay.GameApp.models import Game, Diary, DiaryEntry

User = get_user_model()

@pytest.mark.django_db
class TestDiaryEntryViews:

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def create_user(self):
        return User.objects.create_user(username='testuser', password='password123', email='test@example.com')

    @pytest.fixture
    def create_game(self, create_user):
        return Game.objects.create(name='Sample Game', description='Sample game description', user=create_user)

    @pytest.fixture
    def create_diary(self, create_game):
        return Diary.objects.create(name='Sample Diary', description='Sample diary description', game=create_game)

    # Test para crear una nueva entrada de diario
    def test_create_diary_entry(self, api_client, create_user, create_diary):
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diaryentry-list')
        data = {
            'name': 'New Diary Entry',
            'description': 'This is a new diary entry',
            'diary': create_diary.id,
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert DiaryEntry.objects.filter(name='New Diary Entry').exists()

    # Test para listar todas las entradas de diario
    def test_list_diary_entries(self, api_client, create_user, create_diary):
        diary_entry = DiaryEntry.objects.create(name='Test Diary Entry', description='A test diary entry', diary=create_diary)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diaryentry-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert diary_entry.name in [entry['name'] for entry in response.data]

    # Test para obtener una entrada de diario por su ID
    def test_get_diary_entry_by_id(self, api_client, create_user, create_diary):
        diary_entry = DiaryEntry.objects.create(name='Test Diary Entry', description='A test diary entry', diary=create_diary)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diaryentry-detail', kwargs={'pk': diary_entry.pk})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == diary_entry.name

    # Test para actualizar una entrada de diario
    def test_update_diary_entry(self, api_client, create_user, create_diary):
        diary_entry = DiaryEntry.objects.create(name='Test Diary Entry', description='A test diary entry', diary=create_diary)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diaryentry-detail', kwargs={'pk': diary_entry.pk})
        data = {
            'name': 'Updated Diary Entry',
            'description': 'Updated entry description',
            'diary': create_diary.id,
        }
        
        response = api_client.put(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        diary_entry.refresh_from_db()
        assert diary_entry.name == 'Updated Diary Entry'

    # Test para eliminar una entrada de diario
    def test_delete_diary_entry(self, api_client, create_user, create_diary):
        diary_entry = DiaryEntry.objects.create(name='Test Diary Entry', description='A test diary entry', diary=create_diary)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diaryentry-detail', kwargs={'pk': diary_entry.pk})
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not DiaryEntry.objects.filter(id=diary_entry.id).exists()
