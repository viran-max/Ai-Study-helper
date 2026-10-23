# AI Study Helper

A full-stack learning project that lets students submit an academic or programming question through a React interface and receive an AI-generated explanation from the backend.

## Tech stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **AI integration:** Google Gemini API (`@google/genai`)
- **Other:** JavaScript, REST API, CORS, dotenv, Git/GitHub

## Features

- Simple question-and-answer interface
- Express API endpoint for AI requests
- Input validation and user-facing error/loading states
- API key kept on the backend (never put the Gemini key in frontend code)

## Project structure

```text
ai-study-helper/
├── client/                 # React + Vite frontend
│   ├── src/
│   ├── .env.example
│   └── package.json
├── server/                 # Express + Gemini API
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Requirements

- Node.js compatible with the Vite version in `client/package.json`
- npm
- A Gemini API key for AI responses

## Run locally

Open two terminals from the project root.

### 1. Configure the backend

```bash
cd server
```

Copy `server/.env.example` to `server/.env` and put your own key in the file:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

Install and start the backend:

```bash
npm install
npm run dev
```

The API health endpoint should respond at `http://localhost:5000/`.

### 2. Configure the frontend

In a second terminal:

```bash
cd client
```

Copy `client/.env.example` to `client/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Install and run the frontend:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API

### `GET /`

Health check. Returns a message confirming that the backend is running.

### `POST /api/ask-ai`

Request:

```json
{
  "question": "Explain recursion with a simple example."
}
```

Successful response:

```json
{
  "answer": "The AI-generated explanation..."
}
```

The backend returns a 400 response if the question is empty and a 500 response if the AI request fails.

## Deployment

Deploy the frontend and backend as **two services from this same GitHub repository**.

### 1. Push the project to GitHub

From the project root:

```bash
git init
git add .
git status
git commit -m "Prepare AI Study Helper for deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ai-study-helper.git
git push -u origin main
```

Before `git commit`, inspect `git status` and confirm that neither `.env` nor `node_modules` is staged. Do not upload the ZIP file itself into the repository.

If your project folder already has a valid `.git` repository, do not run `git init` again or delete `.git` blindly. Add the root `.gitignore`, inspect `git status`, commit the changes, and connect/push to the intended remote if needed.

### 2. Deploy the backend on Render

Create a **Web Service** and connect this repository.

- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Add these environment variables in the Render service settings:

- `GEMINI_API_KEY` = your actual Gemini API key
- `CLIENT_URL` = your deployed frontend origin, e.g. `https://your-app.vercel.app`

Render supplies the `PORT` variable automatically; the server uses it. After deployment, test `https://YOUR-BACKEND.onrender.com/`. It should return the backend-running message. Copy the deployed backend URL.

### 3. Deploy the frontend on Vercel

Import the same GitHub repository into Vercel.

- **Root Directory:** `client`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

Add this environment variable in Vercel:

- `VITE_API_BASE_URL` = your deployed backend origin, e.g. `https://YOUR-BACKEND.onrender.com`

Deploy the frontend. Then copy its production URL and set that exact origin as `CLIENT_URL` in Render. Redeploy/restart the backend if needed, and test the app from the public frontend URL.

**Important:** Vite environment variables are bundled into frontend code. Never put `GEMINI_API_KEY` in a `VITE_` variable or any client-side file. Only the backend should receive the Gemini key.

## Before publishing

- Verify that `server/.env` and `client/.env.local` are not tracked by Git.
- If a real API key was ever pushed publicly, revoke/rotate it and create a replacement.
- Test the API health endpoint and ask a sample question after deployment.
- Keep the README's demo links updated when the deployment is live.
- This is a learning project; add rate limiting and stronger abuse/cost controls before offering it publicly to many users.

## Author

**Viran** — BCA student learning full-stack development and AI integration.
