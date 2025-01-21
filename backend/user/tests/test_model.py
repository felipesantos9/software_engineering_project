from django.db import IntegrityError
from django.forms import ValidationError
from django.test import TestCase
from user.models import User

  
valid_email = 'exemple@exemple.com'
valid_password = '12345678'
valid_name = 'exemple'
valid_cnpj = '99.999.999/9999-99'
valid_phonenumber = '+5581999999999'

def get_object_user(**overrides):
  return {
    "email": valid_email,
    "password": valid_password,
    "name": valid_name,
    "cnpj": valid_cnpj,
    "phonenumber": valid_phonenumber,
    "is_staff": False,
    "is_superuser": False,
    **overrides
  }

class UserModelTest(TestCase):
    def setUp(self):
      self.user_model = User.objects

    def test_user_creation(self):
      """
        Test create a valid user with sucess
      """
      self.user = self.user_model.create_user(**get_object_user())
      
      self.assertEqual(self.user.email, valid_email)
      self.assertEqual(self.user.name, valid_name)
      self.assertFalse(self.user.is_verified) 
      self.assertFalse(self.user.is_staff) 
      self.assertFalse(self.user.is_superuser) 
      self.assertTrue(self.user.is_active)  

    def test_superuser_creation(self):
      """
        Test create a valid superuser with sucess
      """
      self.user = self.user_model.create_user(**get_object_user(is_staff=True, is_superuser=True))
      
      self.assertTrue(self.user.is_staff) 
      self.assertTrue(self.user.is_superuser) 
      

    def test_email_invalid(self):
      """
        Test should raise Validation error when email is invalid
      """
      user = self.user_model.create_user(**get_object_user(email='invalid_email.com'))
      
      with self.assertRaises(ValidationError):
          user.full_clean()
      
    def test_unique_email(self):
      '''
      Test  should raise IntegrityError when email not is unique
      '''
      
      self.user_model.create_user(**get_object_user(email='exemplo@exemplo.com'))
      
      with self.assertRaises(IntegrityError):
        self.user_model.create_user(**get_object_user(email='exemplo@exemplo.com'))
      