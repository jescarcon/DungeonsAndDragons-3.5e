import pytest
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from Apps.Rolplay.GameApp.models import Game, Note, Diary, DiaryEntry


User = get_user_model()

@pytest.mark.django_db
class TestGameViews:

    # Fixture to provide an API client for making requests
    @pytest.fixture
    def api_client(self):
        return APIClient()

    # Fixture to create a sample user for testing purposes
    @pytest.fixture
    def create_user(self):
        return User.objects.create_user(username='testuser', password='password123', email='test@example.com')

    # Test case for creating a new game
    def test_create_game(self, api_client, create_user):
        """
        Test that a new game can be created successfully by sending
        a POST request to the 'game-list' endpoint.
        """
        # Authenticate the API client as the created user
        api_client.force_authenticate(user=create_user)
        
        url = reverse('game-list')  # Get the URL for game creation
        data = {
            'name': 'New Game',
            'description': 'This is a new game',
            'user': create_user.id,  # Assign the user id
        }
        
        # Make the POST request with game data
        response = api_client.post(url, data)
        
        # Assert that the game is successfully created (HTTP 201)
        assert response.status_code == status.HTTP_201_CREATED
        # Assert that the new game exists in the database
        assert Game.objects.filter(name='New Game').exists()

    # Test case for listing all games
    def test_list_games(self, api_client, create_user):
        """
        Test that an authenticated user can list all games by sending
        a GET request to the 'game-list' endpoint.
        """
        # Create a sample game
        game = Game.objects.create(name='Test Game', description='A test game description', user=create_user)
        
        # Authenticate the API client as the created user
        api_client.force_authenticate(user=create_user)

        url = reverse('game-list')  # Get the URL for listing games
        response = api_client.get(url)  # Make a GET request to list games

        # Assert that the request is successful (HTTP 200)
        assert response.status_code == status.HTTP_200_OK
        # Assert that the 'Test Game' appears in the response data
        assert game.name in [game['name'] for game in response.data]

    # Test case for retrieving a game by its ID
    def test_get_game_by_id(self, api_client, create_user):
        """
        Test that an authenticated user can retrieve a game by its ID
        by sending a GET request to the 'game-detail' endpoint.
        """
        # Create a sample game
        game = Game.objects.create(name='Test Game', description='A test game description', user=create_user)
        
        # Authenticate the API client as the created user
        api_client.force_authenticate(user=create_user)

        url = reverse('game-detail', kwargs={'pk': game.pk})  # Get the URL for retrieving game by ID
        response = api_client.get(url)  # Make a GET request
        
        # Assert that the request is successful (HTTP 200)
        assert response.status_code == status.HTTP_200_OK
        # Assert that the game name in the response matches the created game
        assert response.data['name'] == game.name

    # Test case for updating a game
    def test_update_game(self, api_client, create_user):
        """
        Test that an authenticated user can update a game by sending
        a PUT request to the 'game-detail' endpoint.
        """
        # Create a sample game
        game = Game.objects.create(name='Test Game', description='A test game description', user=create_user)

        # Authenticate the API client as the created user
        api_client.force_authenticate(user=create_user)

        url = reverse('game-detail', kwargs={'pk': game.pk})  # Get the URL for updating game
        data = {
            'name': 'Updated Game',
            'description': 'Updated game description',
            'user': create_user.id,
        }

        response = api_client.put(url, data)  # Make a PUT request to update the game

        # Assert that the update is successful (HTTP 200)
        assert response.status_code == status.HTTP_200_OK
        game.refresh_from_db()  # Refresh the game instance from the database
        assert game.name == 'Updated Game'

    # Test case for deleting a game
    def test_delete_game(self, api_client, create_user):
        """
        Test that an authenticated user can delete a game by sending
        a DELETE request to the 'game-detail' endpoint.
        """
        # Create a sample game
        game = Game.objects.create(name='Test Game', description='A test game description', user=create_user)

        # Authenticate the API client as the created user
        api_client.force_authenticate(user=create_user)

        url = reverse('game-detail', kwargs={'pk': game.pk})  # Get the URL for deleting the game
        response = api_client.delete(url)  # Make a DELETE request to delete the game

        # Assert that the delete is successful (HTTP 204)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Game.objects.filter(id=game.id).exists()  # Assert the game is deleted