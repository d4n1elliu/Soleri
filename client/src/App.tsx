import './App.css'
import {useState, useEffect } from 'react';

function App() {
    const [topSongs, setTopSongs] = useState<any[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const clientId = "56f9ce77e267463a93248740284844e9"; // Get your own client id from spotify dev
    const redirectUri = "https://victorious-field-0525a4700.2.azurestaticapps.net"; //Frontend azure deployment link
    const scopes = "user-read-email user-top-read";

    const userLogin = () => {
        const spotifyLoginUrl = `https://accounts.spotify.com/authorize?` +
            new URLSearchParams({
                response_type: "code",
                client_id: clientId,
                redirect_uri: redirectUri,
                scope: scopes,
            });

        window.location.href = spotifyLoginUrl;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
            fetch(`/api/authenticate?code=${code}`)
            .then(res => res.json())
            .then(data => {
                const token = data.access_token;
                if (token) {
                    setIsLoggedIn(true);
                    fetch('/api/top-songs', {
                        headers: {
                            Authorisation: `Bearer ${token}`,
                        },
                    })
                        .then(res => res.json())
                        .then(data => setTopSongs(data.items || []));
                }
            });
        }
    }, []);

    return (
        <div className="App">
            <h1>🎧 Spoti-List 🎵</h1>
            <p>Personal Spotify playlist data tracker.</p>

            {!isLoggedIn ? (
                <button onClick = {userLogin}>Login Through Spotify</button>
            ) : (
            <div>
                <h2>Top 10 Tracks From playlist</h2>
                <ul>
                    { topSongs.map(track=> (
                        <li key={track.id}>
                            {track.name} by {track.artists.map((artist: any) => artist.name).join(', ')}
                        </li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    );
}

export default App