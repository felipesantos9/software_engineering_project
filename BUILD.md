# Sistema de pegada de carbono

## Pré=requisitos:
- [NodeJS](https://nodejs.org/pt-br/download)
- [Python](https://www.python.org/downloads/)

## Linhas de comando

### Servidor:
Rode os seguintes comandos, em ordem, para executar o servidor do projeto.

#### 1.Entrar no diretório do servidor
```bash
  cd backend
```

#### 2. Instalar ambiente virtual
```bash
  pip install pipenv
```

#### 3. Criar Ambiente Virtual
Utilize o **pipenv** para criar e ativar o ambiente virtual:
```bash
  pipenv install
  pipenv shell
```

#### 4.Instalar Dependências
Todas as dependências necessárias estão listadas no arquivo *Pipfile*. Após ativar o ambiente, instale as dependências:
```bash
  pipenv install
```

#### 5.Configurar o Banco de Dados
Execute as migrações do Django para configurar o banco de dados:
```bash
  python manage.py migrate
```

#### 6.Executar o Servidor
Inicie o servidor de desenvolvimento:
```bash
  python manage.py runserver
```
A API estará disponível em http://127.0.0.1:8000/

### Servidor:
Rode os seguintes comandos, em ordem, para executar o cliente do projeto.

#### 1.Entrar nos arquivos do servidor
```bash
  cd client
```

#### 2.Instalar Dependências
```bash
  npm install
```

#### 3.Inicie o cliente
```bash
  npm run dev
```

O cliente estará disponivel em http://localhost:5173/
