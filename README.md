# AI Legal Doc Explainer

Full-stack app for CodeStorm AI competition.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- PDF extraction: pdf-parse
- Auth: JWT + bcrypt
- AI: OpenAI (model configurable via `OPENAI_MODEL`)
- Deployment: Frontend on Vercel, Backend on Render or Railway

## Quick Start (Local)

### 1) Backend
```bash
cd server
cp .env.example .env
# edit .env with your Mongo URI, JWT secret, FRONTEND_ORIGIN, OPENAI_API_KEY
npm i
npm run dev
```

### 2) Frontend
```bash
cd client
cp .env.example .env
# set VITE_API_BASE_URL to your backend URL
npm i
npm run dev
```

## API Endpoints

- `POST /api/auth/signup` – create user
- `POST /api/auth/login` – login and receive JWT
- `POST /api/auth/forgot-password` – send password reset email (logs URL if SMTP not set)
- `POST /api/auth/reset-password` – set new password with token

- `POST /api/documents/upload` – upload PDF, extract text, run initial AI (summary/clauses/risks) and store
- `GET /api/documents` – list user’s docs
- `GET /api/documents/:id` – detail (text + AI + QA history)
- `DELETE /api/documents/:id` – delete

- `POST /api/ai/summarize` – recompute summary (body: `{ documentId }`)
- `POST /api/ai/clauses` – recompute clauses (body: `{ documentId }`)
- `POST /api/ai/risks` – recompute risks (body: `{ documentId }`)
- `POST /api/ai/qa` – Q&A on doc (body: `{ documentId, question }`)

## Security Notes

- Passwords are hashed with bcrypt.
- JWT required for all non-auth endpoints.
- CORS restricted to `FRONTEND_ORIGIN` in `.env`.
- PDF file type/size validated (max 20MB).

## Deployment

### Backend (Render or Railway)
- Create a new service from GitHub repo pointing to `/server`.
- Set build command: `npm i` and start command: `npm start`.
- Environment variables (Render/Railway dashboard):
  - `PORT` (Render sets automatically)
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN` (e.g., `7d`)
  - `FRONTEND_ORIGIN` (e.g., `https://your-frontend.vercel.app`)
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL` (e.g., `gpt-5-turbo`)
  - Optional SMTP vars for reset emails

### Frontend (Vercel)
- Import project from GitHub and select `/client` folder.
- Set `VITE_API_BASE_URL` to your Render/Railway backend URL.
- Deploy.

## Legal Disclaimer
This tool provides automated assistance and does not constitute legal advice. If unsure, it will respond: "I recommend consulting a lawyer for this matter."
