# Gunther's Groupies F1 Leaderboard

A Progressive Web App (PWA) for tracking Formula 1 predictions against current Constructors and Drivers Championship standings.

## Features

- View all participants' predictions for Constructors and Drivers Championships
- Display current F1 standings (updated automatically)
- Compare predictions with actual standings
- Responsive design with Tailwind CSS
- Light/dark mode support

## Tech Stack

- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Hosting:** Netlify (planned)

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build for Production

```bash
npm run build
```

## Project structure

```
src/
├── components/     # React components (common/, ui/)
├── config/         # Configuration (env)
├── contexts/       # React contexts (auth)
├── data/           # Static data and historical seasons
├── hooks/          # Custom React hooks
├── services/       # F1 API and Supabase
├── types/          # TypeScript types
└── utils/          # Utilities (calculations, logger)
```

## Documentation

- **[User stories](docs/user-stories.md)** – Product user stories (completed and optional).
- **[Race results automation](docs/race-results-automation.md)** – How race results are synced from Ergast.
- **[Edge functions](docs/edge-functions.md)** – Supabase Edge Functions (ensure-race-results, fetch-race-results, send-race-reminders).

Older planning and review docs are in `docs/archive/`.

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Set environment variables in a `.env.local` file (do not commit `.env` or `.env.local`). Copy `.env.example` and fill in values as needed.

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (required for auth and 2026 data) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (required for auth and 2026 data) |
| `VITE_ADMIN_EMAILS` | Comma-separated emails that can access Admin (optional; empty = no gating) |
| `VITE_API_BASE_URL` | F1 API base URL (optional; default: jolpi.ca proxy) |
| `VITE_FALLBACK_API_URL` | Fallback F1 API URL (optional; default: ergast.com) |

If Supabase vars are not set, auth and 2026 features are disabled; the app still runs with defaults for other vars.

## Contributing

This is a personal project for tracking F1 predictions among friends.
