# Soleri

A personal dashboard that turns your Spotify listening history into clear visual insights.

**Live at [soleri.fyi](https://www.soleri.fyi)**

## Features
- **Listening Stats**: Top tracks, artists, genre breakdown, and recent play counts, filterable by time range (last 4 weeks, last 6 months, all time)
- **Listening Clock**: Heatmap of when you listen across hours and days, with work focus vs. wind-down patterns
- **Discovery Rate**: Weekly breakdown of new tracks and artists explored versus replayed favourites
- **Listening Marathons**: Longest uninterrupted listening sessions ranked by duration
- **Artist Obsession Phases**: Detects periods where you listened to an artist heavily before moving on
- **Billboard Comparison**: Compare your top artists and average track popularity against the Billboard Hot 100
- **Taste Match**: Share your taste profile as a QR code and scan a friend's to compare listening habits

## Tech Stack
**Frontend**
- React.js
- TypeScript
- Tailwind CSS v4
- Recharts
- Framer Motion

**Backend**
- Vercel Serverless Functions
- Spotify Web API

## Getting Started
### Prerequisites
- Node.js v18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) account
- The [Vercel CLI](https://vercel.com/docs/cli) for running the serverless functions locally

### Installation
```bash
git clone https://github.com/d4n1elliu/Soleri.git
cd Soleri
npm install
```

### Environment Variables
Create a `.env` file in the project root:
```env
# Server-side (used by the api/ serverless functions)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:5173

# Client-side
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_REDIRECT_URI=http://localhost:5173

# Canonical site origin used by the SEO prerenderer
VITE_SITE_URL=https://your-domain.com
```
In production these are set in the Vercel project settings.

### Running Locally
```bash
# Terminal 1: serve the api/ functions on port 3000
vercel dev

# Terminal 2: run the Vite dev server (proxies /api to port 3000)
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Building
```bash
npm run build
```
The build type-checks, bundles the app, then prerenders the public routes to
static HTML with per-page metadata, structured data, a sitemap and robots.txt.

## Project Structure

```
Soleri/
├── api/                 # Vercel serverless functions
│   ├── _lib/            # Shared helpers (Spotify fetch, http utils)
│   ├── auth/            # Spotify OAuth endpoints
│   ├── spotify/         # Top tracks/artists and recently-played endpoints
│   └── billboard.ts     # Billboard Hot 100 data endpoint
├── public/              # Static assets (logo, OG image, demo video)
├── scripts/             # Build-time SEO prerenderer and route metadata
├── shared/
│   └── types/           # Types shared between api/ and src/
├── src/
│   ├── api/             # API client functions
│   ├── components/
│   │   ├── dashboard/   # Core dashboard widgets
│   │   ├── insights/    # Listening insight components
│   │   ├── landing/     # Landing page
│   │   ├── legal/       # Terms of Service and Privacy Policy pages
│   │   └── ui/          # Shared UI primitives
│   ├── hooks/           # React hooks
│   ├── lib/             # Pure utility and data-processing functions
│   ├── types/           # Frontend TypeScript types
│   └── entry-server.tsx # Build-time SSR entry for the prerenderer
└── vercel.json          # Vercel deployment config
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Credits
Billboard Top 100 chart data is fetched directly from [billboard.com](https://www.billboard.com).
Music data and artist metadata is provided by the [Spotify Web API](https://developer.spotify.com/documentation/web-api).
See [NOTICE](./NOTICE) for full third-party license information.

## License
Licensed under the [MIT License](LICENSE).
