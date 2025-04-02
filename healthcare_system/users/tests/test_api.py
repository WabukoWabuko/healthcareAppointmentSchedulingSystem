from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.tests.factories import CustomUserFactory
from rest_framework_simplejwt.tokens import AccessToken

class UserAPITests(APITestCase):
    def setUp(self):
        self.user = CustomUserFactory(email='test@example.com', role='patient')
        self.token = str(AccessToken.for_user(self.user))

    def test_login(self):
        response = self.client.post(
            reverse('jwt-create'),
            {'email': 'test@example.com', 'password': 'pass123'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        response = self.client.post(
            reverse('jwt-create'),
            {'email': 'test@example.com', 'password': 'wrongpass'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
