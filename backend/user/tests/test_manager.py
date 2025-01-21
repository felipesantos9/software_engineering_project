from django.test import TestCase
from django.test import TestCase
from user.managers import UserManager
from unittest.mock import MagicMock, patch

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
    "save": MagicMock(),
    **overrides
  }

def get_mock_user(**overrides):
    user_object = get_object_user(**overrides)
    mock_user = MagicMock(**user_object)
    mock_user.name = user_object['name']
    return mock_user

def get_mock_extra_fields(is_staff=False, is_superuser=False, name=valid_name):
  return {
      "name": name,
      "is_staff": is_staff,
      "is_superuser": is_superuser
  }

class TestManagers(TestCase):
  
    def setUp(self):
      self.user_manager = UserManager()
      self.user_manager.model = MagicMock(return_value=get_mock_user())
      self.user_manager.normalize_email = MagicMock(return_value=valid_email)
    
    """
    Tests in create_user
    """
    @patch.object(UserManager, '_create_user', return_value=get_mock_user(password= 'mocked_hashed_password'))
    def test_sucess_create_user_and_call_function_with_correct_parameters(self, mock_create_user):
      """
        Test create a valid user with success in create_user and call _create_user with correct parameters .
      """
  
      email = valid_email
      password = valid_password
      cnpj = valid_cnpj
      phonenumber = valid_phonenumber
      
      extra_fields = get_mock_extra_fields()
      
      user = self.user_manager.create_user(email, password, name=extra_fields['name'])
      
      # checking if the functions calls with correct parameters
      mock_create_user.assert_called_once_with(email, password, **extra_fields)
    
      self.assertEqual(email, user.email)
      self.assertNotEqual(password, user.password)
      self.assertEqual(extra_fields['name'], user.name)
      self.assertEqual(cnpj, user.cnpj)
      self.assertEqual(phonenumber, user.phonenumber)
      self.assertFalse(user.is_staff)
      self.assertFalse(user.is_superuser)

  
    """
    Tests in _create_user
    """
    @patch("user.managers.make_password", return_value="mocked_hashed_password")
    def test_sucess_create_user_and_call_functions_with_correct_parameters(self, mock_make_password):
        """
          Test create a valid user with success in  _create_user and call functions with correct parameters.
        """
        
        email = valid_email
        password = valid_password
        cnpj = valid_cnpj
        phonenumber = valid_phonenumber
      
        
        extra_fields = get_mock_extra_fields()
        
        user = self.user_manager._create_user(email, password, **extra_fields )
      
        # checking if the functions calls with correct parameters 
        self.user_manager.normalize_email.assert_called_once_with(email)
        self.user_manager.model.assert_called_once_with(email=email, **extra_fields)
        mock_make_password.assert_called_once_with(password)
        user.save.assert_called()
        
        # checking if the return is correct
        self.assertEqual(email, user.email)
        self.assertEqual(extra_fields['name'], user.name)
        self.assertEqual('mocked_hashed_password', user.password)
        self.assertEqual(cnpj, user.cnpj)
        self.assertEqual(phonenumber, user.phonenumber)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        
    def test_throw_value_error_when_invalid_email(self):
        '''
        Test if throw value error when email is undefined
        '''
        
        email = None
        password = valid_password
        
        extra_fields = get_mock_extra_fields()
        
        with self.assertRaises(ValueError):
          self.user_manager._create_user(email, password, **extra_fields )
