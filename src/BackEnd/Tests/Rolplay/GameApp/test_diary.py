import pytest
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from Apps.Rolplay.GameApp.models import Game, Diary

User = get_user_model()

@pytest.mark.django_db
class TestDiaryViews:

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def create_user(self):
        return User.objects.create_user(username='testuser', password='password123', email='test@example.com')

    @pytest.fixture
    def create_game(self, create_user):
        return Game.objects.create(name='Sample Game', description='Sample game description', user=create_user)

    # Test para crear un nuevo diario
    def test_create_diary(self, api_client, create_user, create_game):
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diary-list')
        data = {
            'name': 'New Diary',
            'description': 'This is a new diary',
            'game': create_game.id,
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Diary.objects.filter(name='New Diary').exists()

    # Test para listar todos los diarios
    def test_list_diaries(self, api_client, create_user, create_game):
        diary = Diary.objects.create(name='Test Diary', description='A test diary', game=create_game)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diary-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert diary.name in [diary['name'] for diary in response.data]

    # Test para obtener un diario por su ID
    def test_get_diary_by_id(self, api_client, create_user, create_game):
        diary = Diary.objects.create(name='Test Diary', description='A test diary', game=create_game)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diary-detail', kwargs={'pk': diary.pk})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == diary.name

    # Test para actualizar un diario
    def test_update_diary(self, api_client, create_user, create_game):
        diary = Diary.objects.create(name='Test Diary', description='A test diary', game=create_game)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diary-detail', kwargs={'pk': diary.pk})
        data = {
            'name': 'Updated Diary',
            'description': 'Updated description',
            'game': create_game.id
        }
        
        response = api_client.put(url, data)
        
        assert response.status_code == status.HTTP_200_OK
        diary.refresh_from_db()
        assert diary.name == 'Updated Diary'

    # Test para eliminar un diario
    def test_delete_diary(self, api_client, create_user, create_game):
        diary = Diary.objects.create(name='Test Diary', description='A test diary', game=create_game)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('diary-detail', kwargs={'pk': diary.pk})
        response = api_client.delete(url)
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Diary.objects.filter(id=diary.id).exists()
