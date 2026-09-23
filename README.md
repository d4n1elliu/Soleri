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
- **Share Links**: Publish a snapshot of your stats at a short `soleri.fyi/u/<id>` link with a styled QR code. One link per user; links expire after 90 days
- **Profile Customisation**: Add an avatar, banner, bio, pronouns, location, links, a pinned track and an accent colour, and choose which stats are public. Edits appear live on your share link

## Tech Stack
**Frontend**
- React.js
- TypeScript
- Tailwind CSS v4
- Recharts
- Framer Motion
- qr-code-styling

**Backend**
- Vercel Serverless Functions (region `syd1`)
- Spotify Web API
- Supabase (Postgres + Storage, accessed via REST from the serverless functions only)

## Getting Started
### Prerequisites
- Node.js v18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) account
- A [Supabase](https://supabase.com) project (for share links and profiles)
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
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Client-side
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_REDIRECT_URI=http://localhost:5173

# Canonical site origin used by the SEO prerenderer
VITE_SITE_URL=https://your-domain.com
```
In production these are set in the Vercel project settings. The Supabase keys are
never exposed to the browser; all database and storage access goes through `api/`.

### Supabase Setup
Soleri uses two tables and one storage bucket. Row Level Security is enabled with no
policies, so only the service role key (used server-side) can read or write.

- `public.shares` — `id` (text, PK), `payload` (jsonb), `created_at`. A daily `pg_cron`
  job deletes rows older than 90 days.
- `public.profiles` — `spotify_user_id` (PK), `display_name`, `bio`, `pronouns`,
  `location`, `links` (jsonb), `pinned_track` (jsonb), `accent_color`, `avatar_url`,
  `banner_url`, `show_genres`, `show_artists`, `show_tracks`, `created_at`, `updated_at`.
- Storage bucket `profile-images` — public, 2 MB limit, JPEG/PNG/WebP. Files are stored
  at `avatars/<id>` and `banners/<id>` and converted to WebP on upload.

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

## API
All endpoints live in `api/` and run as Vercel serverless functions. Write endpoints
verify the caller's Spotify token against `/v1/me` and act as that user only.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/share` | POST | Create or reuse the caller's share link |
| `/api/share?id=` | GET | Fetch a share snapshot for `/u/:id` |
| `/api/profile?spotifyId=` | GET | Public profile (`Cache-Control: no-store`) |
| `/api/profile` | PUT | Save profile fields (rate-limited, ~6/min) |
| `/api/profile` | DELETE | Remove profile row and images |
| `/api/profile-image?kind=avatar\|banner` | POST | Upload an image (raw bytes, sniffed, ≤ 2 MB) |

## Project Structure

```
Soleri/
├── api/                 # Vercel serverless functions
│   ├── _lib/            # Shared helpers (Spotify fetch, Supabase REST, http utils)
│   ├── auth/            # Spotify OAuth endpoints
│   ├── spotify/         # Top tracks/artists and recently-played endpoints
│   ├── billboard.ts     # Billboard Hot 100 data endpoint
│   ├── profile.ts       # Profile read/update/delete
│   ├── profile-image.ts # Avatar and banner uploads
│   └── share.ts         # Share link creation and lookup
├── public/              # Static assets (logo, OG image, demo video)
├── scripts/             # Build-time SEO prerenderer and route metadata
├── shared/
│   └── types/           # Types shared between api/ and src/
├── src/
│   ├── api/             # API client functions
│   ├── components/
│   │   ├── dashboard/   # Core dashboard widgets, share and scan modals
│   │   ├── insights/    # Listening insight components
│   │   ├── landing/     # Landing page
│   │   ├── legal/       # Terms of Service and Privacy Policy pages
│   │   ├── profile/     # Profile editor (/settings/profile)
│   │   ├── share/       # Public shared profile page (/u/:id)
│   │   └── ui/          # Shared UI primitives (modal, styled QR, avatar)
│   ├── hooks/           # React hooks
│   ├── lib/             # Pure utility and data-processing functions
│   ├── types/           # Frontend TypeScript types
│   └── entry-server.tsx # Build-time SSR entry for the prerenderer
└── vercel.json          # Vercel deployment config (region, SPA rewrites)
```

## Privacy
Spotify tokens are held in memory only and never persisted. Share links contain a
stats snapshot you choose to publish; profile data is public on your share link and
can be deleted at any time from the editor. See the [Privacy Policy](https://www.soleri.fyi/privacy).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Credits
Billboard Top 100 chart data is fetched directly from [billboard.com](https://www.billboard.com).
Music data and artist metadata is provided by the [Spotify Web API](https://developer.spotify.com/documentation/web-api).
See [NOTICE](./NOTICE) for full third-party license information.

## License
Licensed under the [MIT License](LICENSE).
