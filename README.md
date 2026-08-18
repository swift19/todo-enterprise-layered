# Todo Enterprise Layered - Fixed v4

## Fixes applied

- Tailwind v4: postcss.config.mjs with @tailwindcss/postcss, globals.css uses @import tailwindcss
- global.d.ts to fix Cannot find module './globals.css'
- dev script: next dev --no-turbopack
- Prisma: DATABASE_URL (pooler 6543) + DIRECT_URL (5432 direct)
- Auth: NextAuth v5 Google OAuth + PrismaAdapter + User/Todo relation
- BFF: /bff/todos, /bff/todos/[id] -> Bus -> Prisma Adapter
- Persistence: todos saved per user

## Setup

1. npm install
2. Copy .env.example to .env and fill
3. npx prisma db push
4. npm run dev

Login with Google then todos persist on refresh.

## Running App in Vercel

https://todo-enterprise-layered-jf262epdl-test-project-x.vercel.app/
