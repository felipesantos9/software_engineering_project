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

Essa organização facilita a manutenção, a reutilização de código e o crescimento da base de código ao longo do tempo.

---

### Backend (`server/`)

- Estrutura baseada no padrão **MVC (Model-View-Controller)**, o que torna o código mais compreensível e modular:
  - `models/`: definição das estruturas de dados.
  - `controllers/`: lógica de negócio.
  - `routes/`: definição dos endpoints da API.

- Pastas adicionais:
  - `config/`: configurações da aplicação (ex: banco de dados, variáveis de ambiente).
  - `middlewares/`: funções intermediárias executadas nas rotas (ex: autenticação, validação).
  - `utils/`: funções utilitárias reutilizáveis, promovendo o princípio **DRY (Don't Repeat Yourself)**.

Essa organização favorece a separação de responsabilidades, facilita testes e manutenção futura da aplicação.
