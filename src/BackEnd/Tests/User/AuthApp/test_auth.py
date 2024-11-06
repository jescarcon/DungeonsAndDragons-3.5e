import pytest
from rest_framework import status
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User

@pytest.mark.django_db
class TestUserViews:

    # Fixture to provide an API client for making requests
    @pytest.fixture
    def api_client(self):
        return APIClient()

    # Fixture to create a sample user for testing purposes
    @pytest.fixture
    def create_user(self):
        return User.objects.create_user(username='testuser', password='password123', email='test@example.com')

    # Test case for registering a new user
    def test_register_user(self, api_client):
        url = reverse('register')
        data = {
            "username": "newuser",
            "password": "newpassword",
            "email": "newuser@example.com"
        }
        response = api_client.post(url, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newuser').exists()

    # Test case for listing users as an admin
    def test_list_users_as_admin(self, api_client, create_user):
        admin_user = User.objects.create_superuser(username='admin', password='adminpass', email='admin@example.com')
        api_client.force_authenticate(user=admin_user)

        url = reverse('user-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert 'testuser' in [user['username'] for user in response.data]

    # Test case for retrieving a user by their ID
    def test_get_user_by_id(self, api_client, create_user):
        api_client.force_authenticate(user=create_user)
        url = reverse('user-detail-by-id', kwargs={'pk': create_user.pk})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == create_user.username

    # Test case for retrieving a user by their username
    def test_get_user_by_username(self, api_client, create_user):
        api_client.force_authenticate(user=create_user)
        url = reverse('user-detail-by-username', kwargs={'username': create_user.username})
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == create_user.username

    # Test case for user login
    def test_user_login(self, api_client, create_user):
        """
        Test que un usuario pueda iniciar sesión enviando una solicitud POST al endpoint de 'get_token'.
        """
        # Usa la URL 'get_token' en lugar de 'login'
        url = reverse('get_token')
        data = {
            "username": "testuser",
            "password": "password123"
        }

        # Envía la solicitud POST con las credenciales del usuario
        response = api_client.post(url, data)
        
        # Verifica que el código de respuesta sea 200 OK, lo cual indica un inicio de sesión exitoso
        assert response.status_code == status.HTTP_200_OK
        # Verifica que el token de acceso esté en la respuesta
        assert "access" in response.data
        assert "refresh" in response.data
