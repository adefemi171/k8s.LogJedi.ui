# k8s LogJedi UI

![K8s LogJedi](images/k8s_jedi.png)

Landing site and live analysis console for **k8s LogJedi**, built with **Vue 3**, **Vue Router**, and **Vite**.

- **UI repo:** https://github.com/adefemi171/k8s.LogJedi.ui
- **Main app repo:** https://github.com/adefemi171/k8s.LogJedi

## Setup

```bash
npm install
```

## Develop

```bash
npm run dev
```

- Home: `http://localhost:5173/`
- Console: `http://localhost:5173/console`

The Vite dev server proxies `/api/*` → `http://127.0.0.1:8000` (override with `VITE_LLM_PROXY_TARGET`). Port-forward the LLM service first:

```bash
kubectl -n logjedi port-forward svc/llm-service 8000:8000
```

Optional: set `VITE_LLM_API_URL` to call a remote LLM base URL directly (requires `CORS_ALLOW_ORIGINS` on the service).

## Build

```bash
npm run build
```

Output is in `dist/`.

## What’s inside

- Cinematic landing page (brand hero, flow, install)
- `/console` — live view of `/analyses` and `/reports` with optional auth header + auto-refresh
