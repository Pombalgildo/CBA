# Convenção Baptista de Angola — Site Oficial

Site oficial da Convenção Baptista de Angola (C.B.A), com painel de administração completo.

## 🚀 Deploy na Vercel — Guia Passo-a-Passo

### Pré-requisitos
- Conta na [Vercel](https://vercel.com) (gratuita)
- Conta num serviço de PostgreSQL (recomendado: [Neon](https://neon.tech) — gratuito e rápido)
- [Git](https://git-scm.com) instalado (opcional, pode usar upload directo)

---

### Passo 1: Criar a Base de Dados PostgreSQL

**Opção A — Neon (recomendado, mais simples):**
1. Aceda a https://neon.tech e crie uma conta gratuita
2. Clique em **"New Project"**
3. Dê o nome `cba-database`
4. Copie a **Connection String** que aparece (formato: `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`)

**Opção B — Supabase:**
1. Aceda a https://supabase.com e crie um projecto
2. Vá a **Settings > Database > Connection string**
3. Copie a URL (formato URI)

**Opção C — Vercel Postgres:**
1. No painel da Vercel, vá a **Storage > Create > Postgres**
2. Dê o nome `cba-database`
3. Copie a `DATABASE_URL`

---

### Passo 2: Fazer Deploy na Vercel

#### Método A — Upload directo (mais rápido)
1. Extraia o ficheiro ZIP enviado
2. Aceda a https://vercel.com/new
3. Arraste a pasta extraída para a página da Vercel
4. Aguarde o build completar (pode demorar 2-3 minutos)

#### Método B — Via GitHub (recomendado a longo prazo)
1. Crie um repositório no GitHub
2. Faça upload dos ficheiros do ZIP para o repositório
3. Na Vercel, clique em **"Add New > Project"**
4. Importe o repositório do GitHub
5. A Vercel detecta automaticamente que é um projecto Next.js

---

### Passo 3: Configurar Variáveis de Ambiente

No painel da Vercel, vá a **Settings > Environment Variables** e adicione:

| Nome | Valor | Descrição |
|------|-------|-----------|
| `DATABASE_URL` | `postgresql://...` | A connection string do Passo 1 |
| `BLOB_READ_WRITE_TOKEN` | (ver abaixo) | Token do Blob Store para uploads |
| `ADMIN_SECRET` | (string aleatória longa) | Chave para assinar tokens admin |

**Para obter o `BLOB_READ_WRITE_TOKEN`:**
1. No painel da Vercel, vá a **Storage > Create > Blob Store**
2. Dê o nome `cba-uploads`
3. Seleccione o projecto do site
4. Copie o token `BLOB_READ_WRITE_TOKEN`

**Para gerar o `ADMIN_SECRET`:**
Abra um terminal e execute:
```
openssl rand -hex 32
```
Ou use uma string aleatória longa à sua escolha.

---

### Passo 4: Inicializar a Base de Dados

Após o primeiro deploy, precisa de criar as tabelas e carregar os dados iniciais.

**Método fácil — via Vercel CLI:**
1. Instale a Vercel CLI: `npm i -g vercel`
2. Faça login: `vercel login`
3. Na pasta do projecto, execute:
   ```
   vercel env pull .env.local
   npx prisma db push
   bun run scripts/seed.ts
   ```

**Método alternativo — via painel da base de dados:**
1. Aceda ao painel SQL do Neon/Supabase
2. Execute o conteúdo do ficheiro `prisma/schema.sql` (gerado)

---

### Passo 5: Aceder ao Site

- **Site público:** https://o-seu-projecto.vercel.app
- **Painel admin:** https://o-seu-projecto.vercel.app/#/admin
- **Login admin:**
  - Utilizador: `admin`
  - Palavra-passe: `cba2026`

⚠️ **Importante:** Após o primeiro login, deve alterar a palavra-passe padrão.

---

## 🗂 Estrutura do Projecto

```
/
├── prisma/
│   └── schema.prisma          # Esquema da base de dados (PostgreSQL)
├── public/
│   └── uploads/               # Uploads locais (apenas dev)
├── scripts/
│   ├── seed.ts                # Dados iniciais completos
│   └── deploy-init.ts         # Inicialização para produção
├── src/
│   ├── app/
│   │   ├── api/               # API routes (21 endpoints)
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── page.tsx           # Rota única (público + admin)
│   │   └── globals.css        # Estilos globais
│   ├── components/
│   │   ├── admin/             # Painel administrativo
│   │   └── public/            # Site público
│   └── lib/
│       ├── api-client.ts      # Cliente da API
│       ├── auth.ts            # Autenticação
#       ├── db.ts               # Cliente Prisma
│       └── types.ts           # Tipos TypeScript
├── .env.example               # Modelo de variáveis de ambiente
├── vercel.json                # Configuração Vercel
├── next.config.ts             # Configuração Next.js
└── package.json
```

---

## 🔧 Desenvolvimento Local

```bash
# 1. Instalar dependências
bun install

# 2. Copiar .env.example para .env e preencher
cp .env.example .env
# Edite o .env com a sua DATABASE_URL local

# 3. Criar tabelas e carregar dados iniciais
bun run db:push
bun run db:seed

# 4. Iniciar servidor de desenvolvimento
bun run dev
```

Aceda a http://localhost:3000

---

## 🔐 Segurança

- **Palavra-passe admin padrão:** `cba2026` — altere imediatamente após o deploy
- **Tokens JWT:** Expiram em 7 dias
- **Uploads:** Validados por tipo (JPG, PNG, WebP, GIF, PDF) e tamanho (máx 10MB)
- **API admin:** Todas as rotas `/api/admin/*` exigem token de autenticação válido

---

## 📞 Suporte

Desenvolvido por **Hermenegildo José Pombal**
