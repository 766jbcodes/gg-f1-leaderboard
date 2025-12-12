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

## Project Structure

```
src/
├── components/     # React components
├── data/          # Hardcoded predictions and data
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Optional environment variables can be configured in a `.env.local` file:

```env
VITE_API_BASE_URL=https://api.jolpi.ca/ergast/f1
VITE_FALLBACK_API_URL=https://ergast.com/api/f1
```

If not provided, the app will use sensible defaults.

## Project Structure

```
src/
├── components/     # React components
│   ├── common/     # Shared/reusable components
│   └── ...         # Feature components
├── config/         # Configuration files
├── data/           # Static data (predictions, standings)
│   └── staticData/ # Historical season data
├── hooks/          # Custom React hooks
├── services/      # API services and data fetching
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Contributing

This is a personal project for tracking F1 predictions among friends.
