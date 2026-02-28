# Illie

Illie é um assistente pessoal de conteúdo que transforma estudos e projetos escritos no Notion em posts prontos para o LinkedIn, automaticamente, no seu estilo.

## O que ele faz

Monitora páginas do Notion marcadas como prontas, reescreve o conteúdo como um post autêntico no seu estilo e armazena tudo num banco de dados para revisão via dashboard web.

## Como funciona

Todo dia de manhã o **Kestra** verifica o Notion em busca de notas prontas, busca o conteúdo de cada página e envia para o agente de IA — construído com **Agno** — que transforma o texto em um post estruturado no estilo do Lucas e salva no banco. O resultado aparece no **dashboard em Next.js** onde Lucas revisa, edita se quiser e, quando aprovar, copia e publica manualmente no LinkedIn.

```
Notion → Kestra (cron) → Agente IA (GPT-4o) → NeonDB → Dashboard → LinkedIn
```

## Arquitetura

```
illie/
├── agentos/   → Backend Python (Agente IA + API FastAPI)
├── frontend/  → Dashboard Web (Next.js + Drizzle ORM)
└── kestra/    → Orquestrador de Pipeline (Docker)
```

## Stack

| Camada         | Tecnologia                                 |
| -------------- | ------------------------------------------ |
| Agente IA      | Python · [Agno](https://agno.com) · GPT-4o |
| API            | FastAPI (via AgentOS)                      |
| Orquestrador   | [Kestra](https://kestra.io)                |
| Banco de dados | NeonDB (PostgreSQL serverless)             |
| Frontend       | Next.js 16 · React 19 · TypeScript         |
| ORM            | Drizzle ORM                                |

---

## Instalação

### Pré-requisitos

- Python 3.12+
- Node.js 18+
- Docker + Docker Compose
- Conta no [NeonDB](https://neon.tech) (banco de dados)
- Chave de API da [OpenAI](https://platform.openai.com/api-keys)

---

### 1. Clone o repositório

```bash
git clone https://github.com/olucascdev/illie.git
cd illie
```

---

### 2. AgentOS (backend Python)

```bash
cd agentos

# Copie e preencha as variáveis de ambiente
cp example.env .env
```

Edite o `.env` com suas chaves:

```env
OPENAI_API_KEY=sk-...

# Connection string do NeonDB (usado para carregar o prompt do agente)
DATABASE_URL=postgresql://user:password@host/illie?sslmode=require
```

Instale as dependências e rode:

```bash
# Crie o ambiente virtual
python -m venv .venv
source .venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Suba o servidor (porta 7777)
python -m app.main
```

O AgentOS estará disponível em `http://localhost:7777`.

> **Opcional:** rode via Docker
>
> ```bash
> docker compose up -d --build
> ```

---

### 3. Frontend (dashboard Next.js)

```bash
cd frontend

# Copie e preencha as variáveis de ambiente
cp .env.example .env.local
```

Edite o `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host/illie?sslmode=require
```

Instale e rode:

```bash
npm install

# Sincronize o schema com o banco (primeira vez)
npm run db:push

# Suba o servidor de desenvolvimento (porta 3000)
npm run dev
```

O dashboard estará disponível em `http://localhost:3000`.

---

### 4. Kestra (orquestrador de pipeline)

```bash
cd kestra

# Copie e preencha as variáveis de ambiente
cp .env.example .env
```

Suba o Kestra com Docker:

```bash
docker compose up -d
```

A interface do Kestra estará disponível em `http://localhost:8080`.

Configure o flow para apontar para o seu workspace do Notion e para a API do AgentOS em `http://localhost:7777`.

---

## Variáveis de ambiente

### `agentos/.env`

| Variável         | Obrigatória | Descrição                   |
| ---------------- | ----------- | --------------------------- |
| `OPENAI_API_KEY` | ✅          | Chave da API da OpenAI      |
| `DATABASE_URL`   | ✅          | Connection string do NeonDB |

### `frontend/.env.local`

| Variável       | Obrigatória | Descrição                   |
| -------------- | ----------- | --------------------------- |
| `DATABASE_URL` | ✅          | Connection string do NeonDB |

---

## Funcionalidades do dashboard

- **Dashboard** — estatísticas de posts gerados, publicados e execuções do pipeline
- **Posts** — lista todos os posts com status (`gerado`, `rascunho`, `publicado`)
- **Posts / edição** — edita título, corpo, post curto e hashtags antes de publicar
- **Pipeline** — histórico de todas as execuções do Kestra com logs de erro
- **Configurações** — edita o prompt do agente em tempo real, sem precisar restartar

## Schema do banco

```
posts           → id, notionPageId, title, originalContent,
                  linkedinPost, shortPost, hashtags[], status

pipelineRuns    → id, flowExecution, pagesFound, pagesOk,
                  pagesError, errorDetail, executedAt

agentConfig     → id, prompt, updatedAt
```

---

Made by [Lucas](https://github.com/olucascdev)
