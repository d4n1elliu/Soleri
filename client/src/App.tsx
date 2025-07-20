import './App.css'

function App() {
    const userLogin = () => {
        const clientId = "acbf3717252e40cea2d732410395b652"; // Get your own client id from spotify dev
        const redirectUri = "https://29d61a7c5371.ngrok-free.app"; // Use 'ngrok http 8888' to use https locally. Replace this link
            // with the link given by ngrok and also add it to your spotify dev app
        const scopes = "user-read-email";

        const spotifyLoginUrl = `https://accounts.spotify.com/authorize?` +
            new URLSearchParams({
                response_type: "code",
                client_id: clientId,
                redirect_uri: redirectUri,
                scope: scopes,
            });

        window.location.href = spotifyLoginUrl;
    };


    return (
        <div className="App">
            <h1>🎧 Spoti-List 🎵</h1>
            <p>Personal Spotify playlist data tracker.</p>
            <button onClick={userLogin}> Login Through Spotify</button>
        </div>
    );
}

export default App

