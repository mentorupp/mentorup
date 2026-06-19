# MentorUp — Plataforma Acadêmica com IA

Plataforma completa para estudantes universitários: ferramentas de IA, painel de usuário, sistema de créditos freemium e consultoria acadêmica.

## Funcionalidades

### Ferramentas IA (Core)
- **Mapa Mental IA** — mapas interativos com React Flow
- **Questões sobre PDF** — objetivas + dissertativas com gabarito
- **Reescrever Texto** — melhoria acadêmica
- **Resumir Material** — resumos estruturados
- **Flashcards** — cartões interativos
- **Referências ABNT/APA** — grátis e ilimitado
- **Correção Gramatical**
- **Chat com Documento**
- **Simulador de Prova**
- **Estudo de Caso**

### Ferramentas por Área (8 áreas)
Saúde · Psicologia & Humanas · Engenharia · Direito · Administração · Biológicas · Comunicação · Arquitetura

### Painel do Usuário
- Dashboard com créditos e atividade
- Histórico de uso e resultados salvos
- Configurações de perfil acadêmico
- Planos e billing (Stripe/PIX em breve)

## Stack

- Next.js 15 · React 19 · TypeScript
- Tailwind CSS 4 · React Flow
- NextAuth v5 · Prisma · PostgreSQL (Neon)
- OpenAI GPT-4o-mini (opcional — modo demo sem chave)

## Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Neon PostgreSQL |
| `AUTH_SECRET` | Segredo NextAuth (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | URL do app (ex: `http://localhost:3000`) |
| `OPENAI_API_KEY` | Opcional — sem ela, usa modo demonstração |

### 3. Criar banco de dados (Neon)
1. Crie um projeto em [neon.tech](https://neon.tech)
2. Copie a connection string para `DATABASE_URL`
3. Execute:
```bash
npm run db:push
```

### 4. Rodar
```bash
npm run dev
```

## Deploy Vercel

1. **Root Directory:** deixe vazio (`.`)
2. Adicione as variáveis de ambiente no painel Vercel
3. Conecte o Neon e rode `db:push` uma vez
4. Deploy automático a cada push

## Estrutura

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/ register/      # Autenticação
│   ├── dashboard/            # Painel completo
│   │   ├── tools/[tool]/     # Ferramentas IA
│   │   ├── areas/[slug]/     # Ferramentas por área
│   │   ├── history/ billing/ settings/
│   └── api/                  # Auth + Tools + User
├── components/
│   ├── dashboard/            # Sidebar, ToolRunner, MindMap...
│   └── ...                   # Landing page components
├── lib/
│   ├── auth.ts prisma.ts ai.ts credits.ts tools-config.ts
└── prisma/schema.prisma
```

## Créditos

| Plano | Créditos/mês | Preço |
|---|---|---|
| Grátis | 15 | R$ 0 |
| Estudante | 150 | R$ 29 |
| Pro | Ilimitado* | R$ 59 |

*Referências ABNT sempre grátis.

## Licença

Projeto privado — MentorUp © 2026
