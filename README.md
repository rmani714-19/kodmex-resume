# KodMex Resume Builder

Fullstack `3-Click Ready Resume` app with:

- `client/`: React + Vite + Tailwind CSS
- `server/`: Node.js + Express
- `shared/`: shared app configuration

## Features

- Quick start and resume upload entry paths
- Auto-generated resume content with role-based templates
- ATS scoring via backend API
- Editable preview with PDF download
- Zustand state management and Axios API integration

## Run

Install dependencies:

```bash
npm install
```

Start client and server together:

```bash
npm run dev
```

Client:

- `http://localhost:4173`

Server:

- `http://localhost:5001/api/health`

## Build

```bash
npm run build --workspace client
```
