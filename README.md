# qyt

A small full-stack task manager used to demonstrate a working Cloud Agent
development environment.

- **client/** — Vite + React single-page app (dev server on port `5173`).
- **server/** — Express JSON API with an in-memory task store (port `3001`).

The Vite dev server proxies `/api` requests to the Express API, so the two
services work together during development. In production (`npm run build`
followed by `npm start`), the API also serves the built client from a single
port.

## Prerequisites

- Node.js 22+
- npm 10+

## Getting started

```bash
npm install        # installs both workspaces
npm run dev        # runs the API and the client together
```

Then open http://localhost:5173.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API (`3001`) and client (`5173`) together |
| `npm run dev:server` | Run only the Express API |
| `npm run dev:client` | Run only the Vite dev server |
| `npm run build` | Build the client into `client/dist` |
| `npm start` | Serve the built client + API on port `3001` |
| `npm test` | Run server and client tests |
| `npm run lint` | Lint the whole repo with ESLint |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks` | List tasks |
| `POST` | `/api/tasks` | Create a task (`{ "title": "..." }`) |
| `PATCH` | `/api/tasks/:id` | Update a task (`{ "done": true }`) |
| `DELETE` | `/api/tasks/:id` | Delete a task |
