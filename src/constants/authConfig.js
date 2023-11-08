export const authConfig = {
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    redirectUri: "http://localhost:3000",
    scope: "user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private",
    authorizationUrl: "https://accounts.spotify.com/authorize",
    tokenUrl: "https://accounts.spotify.com/api/token",
  };