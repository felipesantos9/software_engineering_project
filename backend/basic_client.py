import requests

BASE_URL = "http://127.0.0.1:8000/"  # Altere para o endpoint correto, se
# necessário


# Teste de registro de usuário
def test_register():
    url = f"{BASE_URL}auth/users/"
    payload = {
        "name": "testuser",
        "email": "testuser2@example.com",
        "password": "TestPassword123",
    }
    response = requests.post(url, json=payload)
    print("Register User:", response.status_code, response.json())


# Teste de login de usuário
def test_login():
    url = f"{BASE_URL}auth/token/login/"
    payload = {
        "email": "testuser2@example.com",
        "password": "TestPassword123",
    }
    response = requests.post(url, json=payload)
    print("Login User:", response.status_code, )
    return response.json().get("auth_token")


# Teste para obter detalhes do perfil de usuário
def test_get_profile(token):
    url = f"{BASE_URL}auth/users/me/"
    headers = {
        "Authorization": f"Token {token}"
    }
    response = requests.get(url, headers=headers)
    print(response.json())


# Teste de logout de usuário
def test_logout(token):
    url = f"{BASE_URL}auth/token/logout/"
    headers = {
        "Authorization": f"Token {token}"
    }
    response = requests.post(url, headers=headers)
    print("Logout User:", response.status_code)


if __name__ == "__main__":
    test_register()
    token = test_login()
    if token:
        test_get_profile(token)
        test_logout(token)
