from django.test import TestCase
from users.models import CustomUser
from users.tests.factories import CustomUserFactory

class CustomUserTests(TestCase):
    def test_create_user(self):
        user = CustomUserFactory(email='test@example.com', role='patient')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.role, 'patient')
        self.assertTrue(user.check_password('pass123'))

    def test_create_user_without_role(self):
        user = CustomUserFactory(email='test2@example.com', role=None)
        self.assertEqual(user.email, 'test2@example.com')
        self.assertIsNone(user.role)  # Role can be null
