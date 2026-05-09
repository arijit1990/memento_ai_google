# Memento — AI Travel Companion

> **Stop drowning in 47 browser tabs — your AI travel planner just did the work in 60 seconds.**

Memento is a full-stack AI travel planning app. Tell it where you're going in plain English and it returns a complete, personalised day-by-day itinerary — hyper-local picks, smart money-saving hacks, live hotel and flight prices, and every activity pinned on an interactive map. No sign-up required to start.

**Live demo:** [memento-ai-google-pb2s.vercel.app](https://memento-ai-google-pb2s.vercel.app)

---

## Table of Contents

1. [Features](#features)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Environment Variables](#environment-variables)
7. [Deployment](#deployment)
8. [API Reference](#api-reference)
9. [Trip Generation Flow](#trip-generation-flow)
10. [Authentication](#authentication)
11. [Database Schema](#database-schema)
12. [LLM Provider Configuration](#llm-provider-configuration)
13. [Demo Tooling](#demo-tooling)
14. [Contributing](#contributing)

---

## Features

| Feature | Detail |
|---------|--------|
| **Conversational intake** | Plain-English chat or a step-by-step intake wizard; Gemini parses intent into structured trip data |
| **Streaming generation** | SSE-powered real-time itinerary generation with live progress messages |
| **Hyper-local picks** | Neighbourhood-level recommendations, not generic tourist traps |
| **Smart hacks** | Actionable tips surfaced per trip — skip-the-line bookings, free alternatives, timing tricks |
| **Interactive maps** | Leaflet.js map with every activity pinned and auto-geocoded via Nominatim |
| **Live pricing** | Real-time hotel and flight prices pulled from Serpapi |
| **Budget breakdown** | Visual cost split across stays, food, activities, transport, and misc |
| **AI editing** | Post-generation edits via chat ("make day 3 less touristy") |
| **Share links** | Public share tokens so anyone can view a trip without logging in |
| **Email export** | Send the full itinerary to an inbox via a configurable webhook |
| **Guest mode** | Full functionality without a sign-in; guest trips auto-migrate on account creation |
| **Google OAuth** | One-click sign-in via Supabase; session stored in httpOnly cookie |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  Browser (React SPA)                                                 │
│  ┌──────────────┐   ┌───────────────────────────────────────────┐   │
│  │  Chat / Intake│   │  Itinerary Panel                          │   │
│  │  Wizard      │   │  DayCards · Map · Budget · Live Prices    │   │
│  └──────┬───────┘   └────────────────────────┬──────────────────┘   │
│         │  SSE stream                         │  REST (Axios)        │
└─────────┼───────────────────────────────────┬┘──────────────────────┘
          │                                   │
          ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  FastAPI Backend  (Vercel Python runtime, 5-min timeout)            │
│                                                                     │
│  /chat/intake  ──► Gemini 2.5 Flash  (structured parsing)           │
│  /trips/generate/stream                                             │
│      └─► call_llm()  ──► Gemini 2.5 Flash  (primary)               │
│                      └─► GPT-4o            (fallback)               │
│  /booking/prices ─────── Serpapi  (hotels + flights)                │
│  /trips/{id}/share ───── short-lived share tokens                   │
│  /auth/* ─────────────── Supabase JWT verification                  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Supabase (Postgres)  │
                    │  users · trips        │
                    │  sessions · shares    │
                    │  saved_items · exports│
                    └──────────────────────┘
```

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Framework | FastAPI (async Python) |
| Language | Python 3.10+ |
| Primary LLM | Google Gemini 2.5 Flash (`google-genai`) |
| Fallback LLM | OpenAI GPT-4o (`openai`) |
| Optional LLM | Anthropic Claude (`anthropic`) |
| Database | Supabase (PostgreSQL + Auth) |
| Live Prices | Serpapi (Google Hotels + Flights) |
| Geocoding | Nominatim (OpenStreetMap, free) |
| Deployment | Vercel Python runtime |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Routing | React Router v7 |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Maps | Leaflet.js (manual initialisation) |
| HTTP | Axios with credentials |
| Auth | Supabase JS client + custom auth context |
| Toasts | Sonner |
| Forms | React Hook Form + Zod |
| Deployment | Vercel (static build) |

---

## Project Structure

```
memento_ai_travel/
│
├── backend/
│   ├── server.py               # FastAPI app — all routes, LLM logic, DB calls
│   ├── requirements.txt        # Python dependencies
│   ├── vercel.json             # Vercel deployment config (5-min timeout)
│   ├── .env.example            # Environment variable reference
│   ├── supabase_schema.sql     # Full database schema with indexes
│   └── tests/
│       ├── test_chat_intake.py
│       └── test_memento_api.py
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.js              # Route definitions
│       ├── pages/
│       │   ├── Landing.jsx     # Home page with destination grid
│       │   ├── Chat.jsx        # Intake + streaming generation + split view
│       │   ├── Itinerary.jsx   # Full trip view
│       │   ├── Trips.jsx       # User's saved trips
│       │   ├── Explore.jsx     # Destination discovery
│       │   ├── Saved.jsx       # Bookmarked activities
│       │   ├── Share.jsx       # Public read-only trip view
│       │   └── Settings.jsx
│       ├── components/
│       │   ├── itinerary/
│       │   │   ├── ItineraryPanel.jsx   # Main trip container
│       │   │   ├── DayCard.jsx          # Expandable day block
│       │   │   ├── ActivityCard.jsx     # Activity with live prices
│       │   │   ├── RealMap.jsx          # Leaflet map + Nominatim geocoding
│       │   │   ├── LivePricesPanel.jsx  # Hotels + flights widget
│       │   │   ├── SmartHacksStrip.jsx  # Local tips carousel
│       │   │   └── ExportModal.jsx      # Email export UI
│       │   ├── chat/
│       │   │   ├── ChatThread.jsx       # Message history
│       │   │   └── IntakeWizard.jsx     # Multi-step intake form
│       │   ├── layout/
│       │   │   ├── AppShell.jsx
│       │   │   └── NavRail.jsx
│       │   └── ui/                      # shadcn/ui primitives
│       └── lib/
│           ├── api.js          # Axios instance + guest session ID
│           ├── auth.jsx        # AuthContext + useAuth hook
│           ├── supabase.js     # Supabase client
│           ├── stream.js       # SSE streaming helper (streamGenerate)
│           ├── intake.js       # Destination cleanup utils
│           └── mockData.js     # Sample chat for initial state
│
├── demo_recorder/
│   ├── record_demo.js          # Playwright-based automated demo recorder
│   ├── merge_audio.js          # Combines video + narration audio
│   └── setup_auth.js           # Pre-generates browser auth state
│
├── dry_run.py                  # End-to-end API smoke test
├── generate_demo_audio.py      # TTS narration generator (Gemini)
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Google AI Studio](https://aistudio.google.com/apikey) API key
- A [Serpapi](https://serpapi.com) key for live prices (100 free searches/month)
- (Optional) OpenAI API key as LLM fallback

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — see Environment Variables below

# Apply database schema
# Open supabase_schema.sql and run it in the Supabase SQL editor

# Start the dev server
uvicorn server:app --reload --port 8000
```

The API is available at `http://localhost:8000/api`.

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set REACT_APP_BACKEND_URL=http://localhost:8000

# Start the dev server
npm start
```

The app is available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
# ── Supabase ──────────────────────────────────────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # Secret — never expose in frontend
SUPABASE_JWT_SECRET=your-jwt-secret

# ── Google AI Studio (Primary LLM) ───────────────────────────────────
# Create at: https://aistudio.google.com/apikey
GOOGLE_AI_KEY=AIza...
GOOGLE_AI_KEY_2=AIza...    # Optional backup keys (auto-rotated on rate limit)
GOOGLE_AI_KEY_3=AIza...

# ── OpenAI (LLM Fallback) ────────────────────────────────────────────
OPENAI_API_KEY=sk-proj-...

# ── Anthropic (Optional — alternative fallback) ───────────────────────
ANTHROPIC_API_KEY=

# ── Serpapi (Live hotel + flight prices) ─────────────────────────────
# Sign up at: https://serpapi.com — 100 free searches/month
SERPAPI_KEY=your-serpapi-key
SERPAPI_KEY_2=

# ── App Config ────────────────────────────────────────────────────────
FRONTEND_BASE_URL=http://localhost:3000

# ── Export webhook (email itinerary) ─────────────────────────────────
# Point at a Zapier / Make / n8n webhook — leave blank to disable
EXPORT_WEBHOOK_URL=

# ── LLM Model Config (swap providers without touching code) ──────────
LLM_PRIMARY_PROVIDER=gemini
LLM_PRIMARY_MODEL=gemini-2.5-flash

LLM_FALLBACK_PROVIDER=openai
LLM_FALLBACK_MODEL=gpt-4o

LLM_INTAKE_PROVIDER=gemini
LLM_INTAKE_MODEL=gemini-2.5-flash
```

### Frontend (`frontend/.env`)

```env
# Backend API base URL (no trailing slash)
REACT_APP_BACKEND_URL=http://localhost:8000

# Supabase public keys (safe to expose in frontend)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

> `REACT_APP_*` variables are baked into the JS bundle at build time. The app ships with hardcoded production fallbacks so it works even if Vercel env vars are not configured.

---

## Deployment

The project deploys to **two separate Vercel projects** — one for the backend Python API, one for the frontend static build.

### Backend (Vercel Python)

```bash
cd backend
vercel --prod
```

`backend/vercel.json` configures a 300-second timeout, required for LLM generation calls:

```json
{
  "builds": [{ "src": "server.py", "use": "@vercel/python", "config": { "maxDuration": 300 } }],
  "routes": [{ "src": "/(.*)", "dest": "server.py" }]
}
```

Add all variables from `backend/.env` under **Vercel → Project Settings → Environment Variables**.

### Frontend (Vercel Static)

```bash
cd frontend
npm run build
vercel --prod
```

Set `REACT_APP_BACKEND_URL` to your deployed backend URL.

### Supabase Configuration

1. Run `supabase_schema.sql` in the Supabase SQL editor.
2. Enable **Google** as an OAuth provider under **Authentication → Providers**.
3. Add your frontend URL to **Authentication → URL Configuration → Redirect URLs**:
   ```
   https://your-frontend.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

---

## API Reference

All endpoints are prefixed with `/api`.

### Trip Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/trips/generate` | Generate a trip (blocking) |
| `POST` | `/trips/generate/stream` | Generate a trip (SSE stream) |
| `GET` | `/trips/{trip_id}` | Fetch a trip by ID |
| `DELETE` | `/trips/{trip_id}` | Delete a trip |
| `POST` | `/trips/{trip_id}/edit` | Edit trip via natural language message |
| `POST` | `/trips/{trip_id}/export` | Export trip via webhook (email) |
| `POST` | `/trips/{trip_id}/share` | Create a public share token |

**Generate request payload:**
```json
{
  "intake": {
    "destination": "Paris, France",
    "dates": "May 5–10, 2026",
    "group": "2 adults",
    "travelerType": ["Foodie", "Art lover"],
    "tripType": "City Break",
    "budget": "$3,000"
  },
  "guest_session_id": "guest_abc123"
}
```

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/intake` | Parse chat message thread into structured intake data |

### Saved Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/saved` | List saved activities |
| `POST` | `/saved` | Save an activity |
| `DELETE` | `/saved/{item_id}` | Remove a saved activity |

### Pricing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/booking/prices` | Hotel and flight prices for a trip |
| `GET` | `/prices/hotels` | Hotels only |
| `GET` | `/prices/flights` | Flights only |
| `GET` | `/airports/detect` | Detect nearest airports for a destination |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/session` | Create session from Supabase OAuth token |
| `GET` | `/auth/me` | Get current user (reads session cookie) |
| `POST` | `/auth/claim-guest` | Migrate guest trips to authenticated user |
| `POST` | `/auth/logout` | Clear session cookie |

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/share/{token}` | Retrieve a shared trip (no auth required) |
| `GET` | `/` | Health check |

---

## Trip Generation Flow

```
User message
     │
     ▼
POST /chat/intake
     │  Gemini extracts: destination, dates, group,
     │  travelerType, tripType, budget
     ▼
Intake complete?
     │ Yes
     ▼
POST /trips/generate/stream
     │
     ├─ Build system prompt (destination context, style guide, JSON schema)
     ├─ call_llm()
     │   ├─ Try GOOGLE_AI_KEY  (primary Gemini)
     │   ├─ On rate limit → cycle through GOOGLE_AI_KEY_2 … KEY_5
     │   └─ On all Gemini failures → GPT-4o fallback
     │
     ├─ extract_json()  — strips markdown code fences, parses JSON
     ├─ Validate structure (days, activities, budgetBreakdown, smartHacks)
     ├─ Geocode missing lat/lng via Nominatim
     ├─ Store in Supabase trips table (JSONB document)
     │
     └─ SSE stream: status messages → final `done` event with full trip JSON
```

The frontend reads the SSE stream via `streamGenerate()` in `src/lib/stream.js`, updating progress messages in real time before the itinerary panel renders.

---

## Authentication

Memento uses **Supabase Google OAuth** with a server-side session layer on top.

```
User clicks "Sign in with Google"
     │
     ▼
Supabase OAuth flow → redirects to /auth/callback
     │
     ▼
Frontend sends Supabase access token → POST /api/auth/session
     │
     ▼
Backend verifies JWT with SUPABASE_JWT_SECRET
Creates row in user_sessions, sets httpOnly SameSite=None session cookie
     │
     ▼
All subsequent requests carry the cookie automatically (withCredentials: true)
```

**Guest mode:** Unauthenticated users receive a `guest_session_id` UUID stored in `localStorage`. Trips and saved items link to this ID. On account creation, `POST /auth/claim-guest` migrates everything to the new user.

---

## Database Schema

```sql
users           -- Google OAuth identity (id, email, name, avatar_url)
user_sessions   -- Server-side sessions (token, user_id, expires_at)
trips           -- JSONB itinerary documents (id, user_id OR guest_session_id, data)
shares          -- Public share tokens (token, trip_id, expires_at)
saved_items     -- Bookmarked activities (user_id OR guest_session_id, activity_json)
exports         -- Export audit log (trip_id, email, created_at)
```

All tables cascade-delete from `users`. Indexes on `user_id`, `guest_session_id`, and session token for query performance. Full schema in `backend/supabase_schema.sql`.

---

## LLM Provider Configuration

Providers and models are **fully environment-driven** — no code changes needed to swap.

```env
LLM_PRIMARY_PROVIDER=gemini        # gemini | openai | anthropic
LLM_PRIMARY_MODEL=gemini-2.5-flash

LLM_FALLBACK_PROVIDER=openai
LLM_FALLBACK_MODEL=gpt-4o          # gpt-4o | gpt-4.1 | gpt-4o-mini

LLM_INTAKE_PROVIDER=gemini
LLM_INTAKE_MODEL=gemini-2.5-flash
```

**Google AI key rotation:** Set `GOOGLE_AI_KEY_2` through `GOOGLE_AI_KEY_5`. On a rate-limit error the backend cycles through all non-empty keys before falling back to the secondary provider, handling the default 50 RPM quota gracefully under load.

---

## Demo Tooling

`demo_recorder/` contains a full Playwright-based automated demo recording pipeline used for investor and conference demos.

```bash
# 1. Pre-generate browser auth state (run once)
node demo_recorder/setup_auth.js

# 2. Generate TTS narration audio
python generate_demo_audio.py

# 3. Record the demo (opens Chromium, runs the full user flow)
node demo_recorder/record_demo.js

# 4. Merge video + narration
node demo_recorder/merge_audio.js
```

**Dry-run smoke test** — validates the full API flow without a browser:

```bash
python dry_run.py
# Outputs: dry_run_trip.json, dry_run_hotels.json, dry_run_flights.json
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes — backend and frontend can be developed independently
4. Run the smoke test: `python dry_run.py`
5. Open a pull request against `main`

For large changes, open an issue first to align on approach.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Memento never books for you — we just point the way.*
