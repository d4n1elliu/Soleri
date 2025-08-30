import './App.css'
import {useState, useEffect } from 'react';
import TopTrackCard from './components/TopTrackCard';
import TrackList from './components/TrackList';
import PopularityBarChart from './components/PopularityBarChart';


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
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then(res => res.json())
                        .then(data => setTopSongs(data.items || []));
                }
            });
        }
    }, []);

    return (  
        <div className="min-h-screen bg-zinc-900 text-black p-6">
            <h1 className ="text-3xl font-bold text-center mb-4">🎧 Spoti-List 🎵</h1>
            <p className = "text-center mb-6">Personal Spotify playlist data tracker.</p>
            {!isLoggedIn ? (
                <div className="flex justify-center">
                    <button
                        onClick={userLogin}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
                        Login Through Spotify
                    </button>
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topSongs[0] && <TopTrackCard track={topSongs[0]} />}
                <TrackList tracks={topSongs.slice(1)} />
                <PopularityBarChart data={topSongs} />
            </div>
            )}
        </div>
    );
}

export default App