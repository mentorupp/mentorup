# MentorUp

Site institucional da **MentorUp** — plataforma de consultoria acadêmica para estudantes universitários.

## Serviços

- TCC & Monografia
- Relatório de Estágio
- Relatórios Acadêmicos
- Atividades & Trabalhos
- Artigos Científicos
- Apresentações & Slides
- Revisão & Normatização (ABNT/APA)
- Projetos de Pesquisa
- Fichamentos & Resenhas

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- TypeScript

## Desenvolvimento local

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Faça push do repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. A Vercel detecta automaticamente o Next.js — nenhuma configuração extra necessária
4. Clique em **Deploy**

### Variáveis de ambiente (opcional)

Para integrar o formulário de contato com um serviço real (Resend, Formspree, etc.), adicione as variáveis no painel da Vercel.

## Estrutura

```
src/
├── app/
│   ├── globals.css      # Estilos globais e tema
│   ├── layout.tsx       # Layout raiz + metadata SEO
│   └── page.tsx         # Página principal
├── components/          # Componentes da landing page
└── lib/
    └── data.ts          # Dados (serviços, depoimentos, FAQ, etc.)
```

## Licença

Projeto privado — MentorUp © 2026
