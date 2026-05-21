# Spoti List
  
A web application that connects to the Spotify Web API to display and track data from the user playlists and liked songs.

## Features

- **Genre Breakdown** — Pie chart visualising the top genres based on user's listening history
- **Listening Clock / Heatmap** — See which hours and days the user listens to the most, revealing the user's "work focus" vs. "wind down" patterns
- **Discovery Rate Graph** — Weekly breakdown of new artists and tracks that users explored versus replayed favourites
- **Longest Listening Marathons** — Tracking longest uninterrupted listening sessions ranked by duration
- **Artist Obsession Phases** — Detects periods where users listens to an artist heavily before stopping completely
- **Billboard 100 Comparison** — Comparing personal listening metrics against Billboard Top 100 artists

## Tech Stack

**Frontend**
- React
- Recharts / Chart.js
- Deployed on Vercel

**Backend**
- Node.js
- Spotify Web API
- Vercel Serverless Functions

## Getting Started

### Prerequisites
- Node.js v18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) account with an app registered

### Installation

```bash
# Clone the repository
git clone https://github.com/d4n1elliu/Spoti-list.git
cd Spoti-list

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

### Running Locally

```bash
# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
Spoti-list/
├── client/          # React frontend
├── server/          # Express backend
├── api/             # Vercel serverless functions
├── vercel.json      # Vercel deployment config
└── package.json
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Credits

This project uses the open-source [`billboard-top-100`](https://github.com/darthbatman/billboard-top-100) Node.js API by GitHub user [darthbatman](https://github.com/darthbatman), licensed under the MIT License.

See [NOTICE](./NOTICE) for full third-party license information.

## License

This project is licensed under the MIT License, see the [LICENSE](./LICENSE) file for details.
