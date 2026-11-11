# GT_Splice Command Center (Residência TIC 51: Facens & Splice)

Plataforma web em **Dark Mode** para gestão do **Plano de Trabalho Vivo**, matriz de compatibilidade **SIGABEM / LIGA / Unity**, orçamento de otimização 3D em **Realidade Mista (MR)** e mapeamento dos spots clicáveis de câmeras e postes da **Splice** no sistema viário da **Facens**.

## Stack Tecnológica
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Estilização:** Tailwind CSS + Lucide Icons
- **Persistência Híbrida:** `localStorage` imediato + Exportação/Importação JSON + suporte nativo a sincronização em nuvem via `NEXT_PUBLIC_FIREBASE_SYNC_URL`.

## Como Executar Localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` no navegador.

## Como Subir no GitHub e Fazer Deploy Gratuito na Vercel

1. Crie um repositório chamado `gt-splice-command-center` no GitHub (`https://github.com/TheyDreez`) e adicione os colaboradores da equipe:
   - Ana Paula Batista (`abatistaa`)
   - Helton Abadia (`heltonrsnet-cpu`)
2. Suba o código:
   ```bash
   git init
   git add .
   git commit -m "feat: GT_Splice Command Center initial release"
   git branch -M main
   git remote add origin https://github.com/TheyDreez/gt-splice-command-center.git
   git push -u origin main
   ```
3. Acesse a [Vercel](https://vercel.com), importe o repositório `gt-splice-command-center` e clique em **Deploy**.
4. Fixe a URL gerada pela Vercel como uma aba no canal `GT_Splice` do Microsoft Teams.

## Sincronização Opcional em Tempo Real (Firebase / Supabase)

Para sincronizar automaticamente o estado entre todos os membros sem depender apenas de exportar/importar JSON:
1. No console do **Google Firebase** (Plano Spark gratuito), crie um **Realtime Database** e copie a URL REST do documento (ex.: `https://gt-splice-facens-default-rtdb.firebaseio.com/state.json`).
2. Na Vercel (`Settings -> Environment Variables`), adicione:
   ```env
   NEXT_PUBLIC_FIREBASE_SYNC_URL=https://gt-splice-facens-default-rtdb.firebaseio.com/state.json
   ```
3. O módulo `lib/storage.ts` detecta a variável automaticamente e sincroniza cada alteração via `PUT`.
