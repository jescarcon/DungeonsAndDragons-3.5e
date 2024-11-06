import pytest
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from Apps.Rolplay.GameApp.models import Game, Note

User = get_user_model()

@pytest.mark.django_db
class TestNoteViews:

    # Fixture para el API client
    @pytest.fixture
    def api_client(self):
        return APIClient()

    # Fixture para crear un usuario de prueba
    @pytest.fixture
    def create_user(self):
        return User.objects.create_user(username='testuser', password='password123', email='test@example.com')

    # Fixture para crear un juego, necesario para la relación en Note
    @pytest.fixture
    def create_game(self, create_user):
        return Game.objects.create(name='Sample Game', description='Sample game description', user=create_user)

    # Test para crear una nueva nota
    def test_create_note(self, api_client, create_user, create_game):
        """
        Prueba que un usuario autenticado puede crear una nueva nota.
        """
        api_client.force_authenticate(user=create_user)
        
        url = reverse('note-list')
        data = {
            'name': 'New Note',
            'description': 'This is a new note',
            'type': 'Nota',
            'game': create_game.id,
        }
        
        response = api_client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert Note.objects.filter(name='New Note').exists()

    # Test para listar todas las notas
    def test_list_notes(self, api_client, create_user, create_game):
        """
        Prueba que un usuario autenticado puede listar todas las notas.
        """
        note = Note.objects.create(name='Test Note', description='A test note', type='Nota', game=create_game)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('note-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert note.name in [note['name'] for note in response.data]

    # Test para obtener una nota por su ID
    def test_get_note_by_id(self, api_client, create_user, create_game):
        """
        Prueba que un usuario autenticado puede obtener una nota por su ID.
        """
        note = Note.objects.create(name='Test Note', description='A test note', type='Nota', game=create_game)
        
        api_client.force_authenticate(user=create_user)
        
        url = reverse('note-detail', kwargs={'pk': note.pk})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == note.name

    # Test para actualizar una nota
    def test_update_note(self, api_client, create_user, create_game):
        """
        Prueba que un usuario autenticado puede actualizar una nota.
        """
        note = Note.objects.create(name='Test Note', description='A test note', type='Nota', game=create_game)

        api_client.force_authenticate(user=create_user)
        
        url = reverse('note-detail', kwargs={'pk': note.pk})
        data = {
            'name': 'Updated Note',
            'description': 'Updated note description',
            'type': 'Misión Principal',
            'game': create_game.id,
        }

        response = api_client.put(url, data)

        assert response.status_code == status.HTTP_200_OK
        note.refresh_from_db()
        assert note.name == 'Updated Note'
        assert note.type == 'Misión Principal'

    # Test para eliminar una nota
    def test_delete_note(self, api_client, create_user, create_game):
        """
        Prueba que un usuario autenticado puede eliminar una nota.
        """
        note = Note.objects.create(name='Test Note', description='A test note', type='Nota', game=create_game)

        api_client.force_authenticate(user=create_user)

        url = reverse('note-detail', kwargs={'pk': note.pk})
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Note.objects.filter(id=note.id).exists()
