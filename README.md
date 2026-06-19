# Foundry Studio

"Where Ideas Become Brands." — premium brand studio website built with Vite + React + Tailwind CSS.

## Local development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite — defaults are correct:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

Or via CLI:

```bash
npm install -g vercel
vercel
```

`vercel.json` is included to handle SPA routing rewrites.
