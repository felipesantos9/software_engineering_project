#  Estrutura de Diretórios

###  Organização Geral

A estrutura do projeto segue um padrão modular, separando os componentes de frontend, backend e documentação. A divisão entre as pastas `client/` (frontend) e `server/` (backend) é uma boa prática comum em aplicações full-stack, promovendo organização e escalabilidade.

---

###  Frontend (`client/`)

- Estrutura baseada em React, com a pasta `public/` destinada a assets estáticos e `src/` concentrando o código-fonte principal.
- Dentro de `src/`, os arquivos estão organizados de forma temática, seguindo boas práticas:
  - `components/`: componentes reutilizáveis da interface.
  - `pages/`: telas principais da aplicação.
  - `services/`: funções responsáveis por requisições e lógica externa.
  - `assets/`: imagens e ícones.
  - `styles/`: estilos globais da aplicação.
  - `types/`:armazenar os types e interfaces do projeto.

Essa organização facilita a manutenção, a reutilização de código e o crescimento da base de código ao longo do tempo.

---

### Backend (`backend/`)

A estrutura do backend é baseada no **Django REST Framework**, com organização modular que favorece a manutenção, a escalabilidade e a separação de responsabilidades.

#### Estrutura Principal

- **`project/`**  
  Armazena as configurações principais da aplicação, definindo banco de dados, acessando variáveis de ambiente e middlewares.

- **`user/`**  
  App responsável pelo gerenciamento de usuários, com autenticação, serialização e lógica personalizada.

- **`estimates/`**  
  App que contém a lógica relacionada aos cálculos e envio de dados das emissões de carbono e seus respectivos endpoints.

- **`manage.py`**  
  Script utilitário que serve como ponto de entrada para administrar um projeto Django

- **`.env`**  
  Arquivo de declaração das variáveis de ambiente

- **`requirements.txt`**  
  Armazena as dependências da aplicação e suas versões.

  

#### Pastas das Apps

- **`serializers/`**  
  Responsáveis por converter dados complexos (como objetos do banco) para formatos simples (ex: JSON), além de realizar validações.

- **`views/`**  
  Contém a lógica que responde às requisições HTTP, utilizando as classes base do Django REST Framework (ViewSets, APIViews, etc.).

- **`urls/`**  
  Define os endpoints da API e o roteamento interno.

- **`models/`**  
  Define as estruturas de dados e regras de negócio associadas ao banco de dados.
  
- **`tests/`**  
  Testes unitários e de integração para garantir a qualidade e o funcionamento correto da aplicação.

---

#### Bibliotecas e Recursos Utilizados

- **Djoser** – Endpoints prontos para autenticação de usuários (registro, login, recuperação de senha).
- **drf-spectacular** – Geração automática de documentação da API no formato OpenAPI/Swagger.
- **django-filter** – Suporte à filtragem avançada em endpoints.
- **django-cors-headers** – Permite o compartilhamento de recursos entre diferentes domínios, possibilitando a integração com o frontend.

---

Essa estrutura modular e limpa segue as boas práticas do ecossistema Django, promovendo escalabilidade e facilitando a colaboração em equipe.
