# Soleri

A personal dashboard that turns your Spotify listening history into clear visual insights.

## Features
- **Listening Stats**: Top tracks, artists, genre breakdown, and recent play counts
- **Listening Clock**: Heatmap of when you listen across hours and days, with work focus vs. wind-down patterns
- **Discovery Rate**: Weekly breakdown of new tracks and artists explored versus replayed favourites
- **Listening Marathons**: Longest uninterrupted listening sessions ranked by duration
- **Artist Obsession Phases**: Detects periods where you listened to an artist heavily before moving on
- **Billboard Comparison**: Compare your top artists and average track popularity against the Billboard Hot 100

## Tech Stack
**Frontend**
- React 19 + TypeScript
- Tailwind CSS v4
- Recharts
- Vite
- Deployed on Vercel

**Backend**
- Vercel Serverless Functions
- Spotify Web API

## Getting Started
### Prerequisites
- Node.js v18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) account

### Installation
```bash
# Clone the repository
git clone https://github.com/d4n1elliu/Soleri.git
cd Soleri/client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables
Create a `.env` file inside the `client/` directory:
```env
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_REDIRECT_URI=http://localhost:5173
```

### Running Locally
```bash
# From the client/ directory
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
Soleri/
├── api/             # Vercel serverless functions (Spotify OAuth + data endpoints)
├── client/          # React frontend
│   ├── public/      # Static assets
│   └── src/
│       ├── api/     # API client functions
│       ├── components/
│       │   ├── dashboard/   # Core dashboard widgets
│       │   ├── insights/    # Listening insight components
│       │   └── landing/     # Landing page
│       ├── hooks/   # React hooks
│       ├── lib/     # Pure utility and data-processing functions
│       └── types/   # Shared TypeScript types
├── server/          # Local development server
└── vercel.json      # Vercel deployment config
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Credits
Billboard Top 100 chart data is fetched directly from [billboard.com](https://www.billboard.com).
Music data and artist metadata is provided by the [Spotify Web API](https://developer.spotify.com/documentation/web-api).
See [NOTICE](./NOTICE) for full third-party license information.

## License
This project is licensed under the MIT License, see the [LICENSE](./LICENSE) file for details.
