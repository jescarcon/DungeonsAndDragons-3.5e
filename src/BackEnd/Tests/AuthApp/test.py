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
        """
        Test that a new user can register successfully by sending
        a POST request to the 'register' endpoint.
        """
        url = reverse('register')  # Get the URL for user registration
        data = {
            "username": "newuser",
            "password": "newpassword",
            "email": "newuser@example.com"
        }
        # Make the POST request with user data
        response = api_client.post(url, data)
        # Assert that the user is successfully created (HTTP 201)
        assert response.status_code == status.HTTP_201_CREATED
        # Assert that the new user exists in the database
        assert User.objects.filter(username='newuser').exists()

    # Test case for listing users as an admin
    def test_list_users_as_admin(self, api_client, create_user):
        """
        Test that an admin user can list all users by sending
        a GET request to the 'user-list' endpoint.
        """
        # Create an admin user and authenticate as the admin
        admin_user = User.objects.create_superuser(username='admin', password='adminpass', email='admin@example.com')
        api_client.force_authenticate(user=admin_user)

        url = reverse('user-list')  # Get the URL for listing users
        response = api_client.get(url)  # Make a GET request to retrieve the users
        # Assert that the request is successful (HTTP 200)
        assert response.status_code == status.HTTP_200_OK
        # Assert that 'testuser' is in the response data
        assert 'testuser' in [user['username'] for user in response.data]

    # Test case for retrieving a user by their ID
    def test_get_user_by_id(self, api_client, create_user):
        """
        Test that an authenticated user can retrieve their details
        by sending a GET request to the 'user-detail-by-id' endpoint.
        """
        # Authenticate the API client as the created user
        api_client.force_authenticate(user=create_user)

        # Get the URL for retrieving the user by their ID (primary key)
        url = reverse('user-detail-by-id', kwargs={'pk': create_user.pk})
        response = api_client.get(url)  # Make a GET request
        # Assert that the request is successful (HTTP 200)
        assert response.status_code == status.HTTP_200_OK
        # Assert that the username in the response matches the created user
        assert response.data['username'] == create_user.username

    # Test case for retrieving a user by their username
    def test_get_user_by_username(self, api_client, create_user):
        """
        Test that an authenticated user can retrieve their details
        by sending a GET request to the 'user-detail-by-username' endpoint.
        """
        # Authenticate the API client as the created user
        api_client.force_authenticate(user=create_user)

        # Get the URL for retrieving the user by their username
        url = reverse('user-detail-by-username', kwargs={'username': create_user.username})
        response = api_client.get(url)  # Make a GET request
        # Assert that the request is successful (HTTP 200)
        assert response.status_code == status.HTTP_200_OK
        # Assert that the username in the response matches the created user
        assert response.data['username'] == create_user.username
