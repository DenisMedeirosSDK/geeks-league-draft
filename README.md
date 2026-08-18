# API LEAGUE

Este projeto é uma API backend em TypeScript usando Fastify, com banco de dados SQLite via LibSQL/Turso e ORM Drizzle. A ideia principal é gerenciar ligas, times, jogadores e estado de draft.

---

## 1. O que esse projeto faz?

A API serve como backend para um sistema de ligas esportivas. Ela permite:

- criar ligas
- listar ligas
- buscar uma liga por ID
- atualizar informações da liga
- excluir ligas
- criar jogadores relacionados a uma liga
- organizar o estado de draft de uma liga

A estrutura já mostra que o projeto está em andamento e que o foco principal é o gerenciamento de competições e draft.

---

## 2. Tecnologias usadas

Esse projeto usa as seguintes ferramentas:

- Node.js
- TypeScript
- Fastify: framework HTTP para criar APIs
- Zod: validação de dados
- Drizzle ORM: acesso ao banco de dados
- LibSQL/Turso: banco SQLite em nuvem/servidor
- Swagger + Scalar: documentação da API
- Biome: formatador e lint do código

Se você ainda está aprendendo, pense assim:

- Node.js = ambiente para rodar JavaScript no servidor
- TypeScript = JavaScript com tipagem mais segura
- Fastify = responsável por receber requisições HTTP
- Drizzle = responsável por conversar com o banco de dados
- Zod = valida as informações antes de salvar

---

## 3. Como o projeto está organizado?

```bash
src/
├── env.ts
├── index.ts
├── @types/
│   └── index.d.ts
├── db/
│   ├── index.ts
│   ├── migrations/
│   └── schema/
│       ├── index.ts
│       └── schema.ts
├── routes/
│   ├── index.ts
│   ├── leagues/
│   │   ├── routes.ts
│   │   └── service.ts
│   └── player/
│       ├── routes.ts
│       └── service.ts
```

### Explicando cada parte

#### src/index.ts
É o ponto de entrada da aplicação. Aqui a API é criada, configurada e iniciada.

Ele faz coisas importantes como:

- habilita CORS
- configura documentação Swagger
- registra as rotas da aplicação
- inicia o servidor na porta configurada

#### src/env.ts
Carrega e valida as variáveis de ambiente usando Zod.

Aqui o projeto exige:

- PORT
- TURSO_DATABASE_URL
- TURSO_AUTH_TOKEN

Se alguma variável estiver faltando ou inválida, a aplicação não inicia.

#### src/routes/
Pasta responsável pelas rotas e regras de negócio.

- routes/index.ts: registra as rotas principais
- routes/leagues/: rotas e serviços relacionados a ligas
- routes/player/: rotas e serviços relacionados a jogadores

#### src/db/
Pasta com o banco de dados:

- schema/schema.ts: modelagem das tabelas
- db/index.ts: conexão com o banco
- migrations/: histórico de migrations do banco

---

## 4. Como rodar o projeto na sua máquina

### 4.1. Requisitos

Você precisa ter instalado:

- Node.js 20+ (recomendado)
- npm
- Git

### 4.2. Instale as dependências

No terminal, dentro da pasta do projeto:

```bash
npm install
```

### 4.3. Configure o arquivo de ambiente

Há um arquivo `.env.example` com o modelo das variáveis:

```env
PORT=3333

TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

Crie um arquivo `.env` com base nele:

```bash
cp .env.example .env
```

Depois, preencha os valores:

- `PORT`: porta da API. Normalmente 3333
- `TURSO_DATABASE_URL`: URL do banco
- `TURSO_AUTH_TOKEN`: token de autenticação do banco

> Importante: sem esses valores, o app não consegue conectar ao banco.
Acesse o site [Turso](https://turso.tech/) para criar seu bando de dados e obter as credenciais na nuvem.

### 4.4. Inicie o servidor em modo desenvolvimento

```bash
npm run dev
```

Se tudo estiver certo, o servidor vai subir e mostrar algo parecido com:

```bash
Server listening at http://localhost:3333
Docs listening at http://localhost:3333/docs
```

### 4.5. Acesse a documentação da API

A documentação está em:

```bash
http://localhost:3333/docs
```

Essa página ajuda a testar os endpoints sem precisar escrever o cliente manualmente.

---

## 5. Como a aplicação funciona em prática

### 5.1. Inicialização

O arquivo principal é `src/index.ts`.

Ele:

1. cria a instância do Fastify
2. registra validação com Zod
3. habilita CORS
4. registra a documentação Swagger
5. registra as rotas principais
6. inicia o servidor

### 5.2. Rotas principais

O arquivo `src/routes/index.ts` registra:

- `/` -> rota raiz, retorna mensagem simples
- `/leagues` -> endpoints de ligas
- `/players` -> endpoints de jogadores

### 5.3. Estrutura de rotas

#### / (raiz)
Rota simples de teste:

```http
GET /
```

Resposta esperada:

```json
{
  "message": "Hello, World!"
}
```

#### /leagues
Existem endpoints para:

- criar liga
- listar ligas
- buscar uma liga por ID
- atualizar liga
- deletar liga

#### /players
A rota de jogadores já está começando a ser estruturada, com criação de jogadores em uma liga.

---

## 6. Banco de dados e schema

O projeto usa Drizzle ORM e define as tabelas em `src/db/schema/schema.ts`.

### Tabelas principais

#### leagues
Armazena as ligas.

Campos:

- id
- name
- teamsCount
- playersPerTeam
- createdAt
- updatedAt

#### players
Armazena os jogadores.

Campos:

- id
- leagueId
- name
- position
- createdAt

#### teams
Armazena os times.

Campos:

- id
- leagueId
- name
- draftPosition
- createdAt

#### team_players
Relaciona jogador com time.

#### draft_state
Guarda o estado atual do draft da liga.

Campos importantes:

- pickIdCounter
- draftPointer
- currentStep
- status
- updatedAt

#### draft_order
Guarda a ordem de escolha do draft.

---

## 7. Como o código lida com regras de negócio

A lógica principal fica em arquivos `service.ts` dentro de cada módulo.

Exemplo:

- `src/routes/leagues/service.ts` faz a criação, busca, listagem, atualização e remoção de ligas
- `src/routes/player/service.ts` cria jogadores

Essa separação ajuda porque:

- rotas cuidam da requisição HTTP
- service cuida da lógica de negócio
- banco de dados fica escondido atrás do serviço

Esse padrão é muito importante para projetos reais, porque deixa o código mais organizado e fácil de evoluir.

---

## 8. Exemplo de fluxo de criação de liga

Quando alguém faz uma requisição para criar uma liga:

1. a rota recebe os dados
2. valida o body com Zod
3. chama a função `createLeague()`
4. insere a liga no banco
5. cria também o estado inicial de draft
6. retorna a liga criada

Esse é um exemplo clássico de arquitetura em camadas.

---

## 9. Como continuar o projeto

Se você vai continuar esse backend, aqui vai uma boa ordem para aprender e evoluir:

### Etapa 1: entenda o fluxo completo

Leia estes arquivos na ordem:

1. `src/index.ts`
2. `src/routes/index.ts`
3. `src/routes/leagues/routes.ts`
4. `src/routes/leagues/service.ts`
5. `src/db/schema/schema.ts`
6. `src/db/index.ts`

Isso ajudará a montar o mapa mental do projeto.

### Etapa 2: entenda como escrever rotas

Cada rota usa Fastify e Zod. A estrutura básica é:

```ts
app.post("/", { schema: { ... } }, async (request, reply) => {
  return reply.status(200).send({ ... })
})
```

Você vai aprender:

- como receber dados
- como validar dados
- como responder com status HTTP
- como retornar JSON

### Etapa 3: entenda como conectar com o banco

O projeto usa Drizzle:

```ts
await db.insert(leagues).values({ ... })
```

Você vai precisar aprender:

- insert
- select
- update
- delete
- where
- relations

### Etapa 4: adicione novas rotas com segurança

Ao criar uma nova funcionalidade, siga este padrão:

1. criar rota em `routes/.../routes.ts`
2. criar lógica em `service.ts`
3. validar payload com Zod
4. consultar/inserir no banco
5. testar com a documentação em `/docs`

---

## 10. Exemplos de comandos úteis

### Rodar em desenvolvimento

```bash
npm run dev
```

### Compilar TypeScript

```bash
npm run build
```

### Rodar a versão compilada

```bash
npm start
```

### Testar uma rota localmente

Exemplo de criação de liga com curl:

```bash
curl -X POST http://localhost:3333/leagues \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Liga Teste",
    "teamsCount": 8,
    "playersPerTeam": 5
  }'
```

Exemplo de listagem:

```bash
curl http://localhost:3333/leagues
```

---

## 11. Boas práticas para quem está aprendendo

### 1. Comece pelo simples
Não tente entender tudo de uma vez. Primeiro entenda:

- como o app inicia
- como as rotas são registradas
- como o banco é usado

### 2. Leia a documentação do projeto
A API tem documentação em `/docs`, então sempre que quiser testar uma rota, abra essa página.

### 3. Valide tudo
O Zod ajuda a evitar erros e payloads inconsistentes.

### 4. Mantenha o código organizado
Um arquivo grande e confuso vira problema rápido. A separação por módulos e services é uma boa prática.

### 5. Entenda o ciclo de uma requisição
Uma requisição normalmente segue essa ordem:

```text
HTTP request
→ rota
→ validação
→ service
→ banco de dados
→ resposta HTTP
```

Se você entender esse ciclo, a maior parte do backend deixa de parecer mágica.

---

## 12. Possíveis próximos passos do projeto

Aqui estão ideias boas para continuar o desenvolvimento:

- criar endpoints para times
- criar endpoints para draft
- implementar regras de ordem de escolha
- criar autenticação e autorização
- melhorar schema de validação
- criar testes automatizados
- separar melhor os módulos por domínio
- adicionar paginação na listagem de ligas e jogadores
- controlar erros com mensagens mais amigáveis

---

## 13. Dicas de aprendizado

Se você quer evoluir como programador(a), estude nessa ordem:

1. JavaScript/TypeScript básico
2. Node.js e HTTP
3. APIs REST
4. Fastify
5. Banco de dados e SQL
6. Drizzle ORM
7. Validação com Zod
8. Boas práticas de organização de código

Essa sequência vai te dar uma base muito forte para continuar no projeto sem se perder.

---

## 14. Resumo rápido

Esse projeto é um backend de API em TypeScript com Fastify, usando banco SQLite/Turso e Drizzle ORM. O objetivo principal é gerenciar ligas, jogadores, times e o estado de draft. A estrutura já está organizada em rotas e services, e o próximo passo natural é continuar implementando mais módulos e regras de negócio.

Se você estiver começando, foque em entender:

- como a API inicia
- como as rotas funcionam
- como os serviços acessam o banco
- como os dados são validados

Com isso, você já terá uma base sólida para continuar o projeto.

---

## 15. Próximo passo recomendado

Para continuar de forma prática, use esta checklist:

- [ ] entender a estrutura da pasta `src`
- [ ] rodar o projeto localmente
- [ ] abrir a documentação em `/docs`
- [ ] testar as rotas de liga
- [ ] criar uma nova funcionalidade seguindo o padrão já usado
- [ ] documentar cada nova rota e regra de negócio

---
