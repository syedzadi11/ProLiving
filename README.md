# ProLiving

A role-agnostic room rental / roommate-finder platform. Every registered user
can act as both an **Owner** (posts listings) and a **Seeker** (browses
listings and sends connection requests) — there's no separate account type.

## Tech Stack

**Backend**
- Node.js + Express
- Sequelize ORM + MySQL
- JWT authentication
- Joi request validation
- Multer for image uploads

**Frontend**
- Next.js (TypeScript, App Router)
- Tailwind CSS
- shadcn/ui components
- TanStack Query for server state
- React Hook Form + Zod for forms/validation
- Axios
- Sonner (toast notifications)

## Project Structure

```
ProLiving/
├── server/          # Express API (see server/README or below)
└── client/          # Next.js frontend
    └── src/
        ├── app/                  # Pages (App Router)
        ├── components/           # Shared UI + common components
        ├── context/              # AuthContext (user/token state)
        ├── lib/                  # API client, validation schemas, helpers
        └── types/                # Shared TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL running locally (or a connection string to a hosted instance)

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env   # fill in DB credentials, JWT_SECRET, etc.
npm run dev
```

The API runs at `http://localhost:5000/api` by default.

### 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment Variables

**Backend (`server/.env`)**
| Variable | Description |
|---|---|
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection details |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `http://localhost:3000`) |

**Frontend (`client/.env.local`)**
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api`) |

## Core Features

- JWT-based signup/login, with route protection on the frontend
- Browse/search listings by city, area, room type, and budget, with sorting and pagination
- Post, edit, delete, and manage the status of your own listings (Active / Rented / Expired)
- Send, accept, and reject connection requests between seekers and owners
- Phone numbers are only revealed once a connection request is accepted
- Profile management with photo upload
- Listing photo upload

## API Reference

See `server/README.md` (or the project's API documentation) for the full
list of endpoints. Key routes:

- `POST /api/auth/signup`, `POST /api/auth/login`
- `GET /api/listings`, `POST /api/listings`, `GET/PUT/DELETE /api/listings/:id`
- `PATCH /api/listings/:id/rented`, `PATCH /api/listings/:id/reactivate`
- `POST /api/connections`, `GET /api/connections/my-requests`, `GET /api/connections/incoming`
- `PATCH /api/connections/:id/decision`, `DELETE /api/connections/:id`
- `GET/PUT /api/users/me`

