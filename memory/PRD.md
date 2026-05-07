# Memento — Smart AI Travel Planner (Full Stack MVP)

## Original Problem Statement
Build the frontend for a web app called Memento, a smart travel planner app, referencing mindtrip.ai. PRD + Tech Blueprint provided.

## Phases
- **Phase 1 (Feb 2026)**: Frontend MVP with mock data — 9 routes, editorial light theme, all UI flows.
- **Phase 2 (Feb 2026)**: Real backend wired:
  - Gemini 3 Pro (primary) + Claude Sonnet 4.5 (fallback) via Emergent LLM Key
  - Emergent-managed Google Auth (Bearer-token, localStorage)
  - MongoDB persistence with guest-session claim flow
  - Mapbox GL JS map integration
  - Generic search-URL booking deep-links

## Tech Stack
- **Frontend**: React 19 (CRA) + Tailwind CSS + shadcn/ui + lucide-react + sonner + React Router v7 + axios + mapbox-gl
- **Backend**: FastAPI + motor (MongoDB async) + emergentintegrations (LlmChat) + httpx
- **Theme**: Light editorial — `#FAF8F5` cream / `#C85A40` terracotta / `#2D2823` espresso
- **Fonts**: Playfair Display (headings) + Outfit (body)

## Routes
| Path | Purpose | Backend? |
|---|---|---|
| `/` | Landing | No |
| `/chat` | Split-panel chat + itinerary | `/api/trips/generate` |
| `/itinerary/:id` | Standalone itinerary | `/api/trips/:id` (Paris mock fallback) |
| `/trips` | User's trips dashboard | `/api/trips` |
| `/explore` | Destinations | No |
| `/saved` | Saved items | No (mock) |
| `/settings` | Settings | No (mock) |
| `/auth/login`, `/auth/signup` | Google sign-in | `/api/auth/session` |

## Backend API (`/api`)
- **Auth**: `POST /auth/session` (exchange Emergent session_id), `GET /auth/me`, `POST /auth/logout`, `POST /auth/claim-guest`
- **Trips**: `POST /trips/generate` (Gemini→Claude fallback), `GET /trips`, `GET /trips/:id`, `DELETE /trips/:id`
- **Health**: `GET /`, `POST /status`, `GET /status`

## Auth flow
1. User clicks "Continue with Google" → redirects to `https://auth.emergentagent.com/?redirect={origin}/trips`
2. After Google OAuth → returns to `/trips#session_id=xxx`
3. App.js detects hash → renders `<AuthCallback>`
4. Callback POSTs `/api/auth/session` (with optional `guest_session_id`) → receives `{user, session_token, trips_claimed}`
5. Stores `session_token` in `localStorage["memento_session_token"]`
6. All subsequent requests send `Authorization: Bearer <token>` via axios interceptor
7. Guest trips with matching `guest_session_id` are auto-claimed on first sign-in

## Why Bearer (not cookie)
The Kubernetes ingress forces `Access-Control-Allow-Origin: *` on every response, which is incompatible with `withCredentials: true`. We migrated to header-based Bearer auth to sidestep the issue. Backend still supports cookies as a fallback.

## What's been implemented
**Phase 1 (Feb 2026):**
- ✅ All 9 routes rendering with mock data
- ✅ Dual-mode intake (chat + 6-step wizard)
- ✅ Paris 5-day dummy itinerary (16 activities, 4 smart hacks)
- ✅ All `data-testid` attributes
- ✅ E2E tested 100%

**Phase 2 (Feb 2026):**
- ✅ Gemini 3 Pro itinerary generation (verified — full Lisbon trip with 3 days, smart hacks, lat/lng)
- ✅ Claude Sonnet 4.5 fallback chain
- ✅ Emergent Google Auth — Bearer token persisted in localStorage
- ✅ MongoDB collections: `users`, `user_sessions`, `trips`
- ✅ Guest-session claim on sign-in
- ✅ Mapbox GL JS — light style, terracotta numbered pins, popup on click
- ✅ Generic booking deep-links (Google Hotels / Maps / Search)
- ✅ NavRail auth-aware (avatar + logout when signed in, "IN" pill otherwise)
- ✅ 15/15 pytest pass (incl. 2 real LLM generations)

## Known platform quirks
- **Mapbox in playwright sandbox**: postMessage worker errors when running inside the testing iframe — sandbox-specific, real users see the map fine.
- **CORS `*` from ingress**: solved by switching to Bearer auth.

## P1 Backlog (next)
- Real-time conversational editing of itinerary ("make day 3 less touristy" → mutate trip JSON via LLM)
- Trip share link `/share/:token` read-only public view
- Saved items — wire to backend
- Skeleton-loader price fetching for booking cards
- Phone/responsive testing pass

## P2 Backlog
- Social media preference learning (PRD v2.0)
- Voice planning assistant
- Memento Gift recommender
- Multilingual support
- Pro subscription tier
