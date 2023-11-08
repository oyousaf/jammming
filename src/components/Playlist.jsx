import React, { useState, useEffect } from "react";
import { authConfig } from "../constants/authConfig";

const Playlist = ({ playlist, name, onEdit, onSave, onRemove }) => {
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error("Error fetching user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSpotifyCallback = () => {
    const token = new URLSearchParams(window.location.hash.substring(1)).get(
      "access_token"
    );
    if (token) {
      setAccessToken(token);
      const expiresIn = new URLSearchParams(
        window.location.hash.substring(1)
      ).get("expires_in");
      if (expiresIn) {
        const expirationTime = Date.now() + parseInt(expiresIn, 10) * 1000;
        localStorage.setItem("spotify_token_expiration", expirationTime);
      }
      window.history.replaceState(null, "", window.location.pathname);
      fetchUserData();
    }
  };

  useEffect(() => {
    handleSpotifyCallback();
    // eslint-disable-next-line
  }, []);

  const initiateSpotifyLogin = () => {
    const { clientId, redirectUri, scope } = authConfig;
    window.location.href = `${authConfig.authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
  };

  const savePlaylistToSpotify = async () => {
    if (!accessToken || !playlist.tracks.length) {
      setError(
        <p className="mt-5 text-red-600">
          Playlist cannot be empty! Try adding some tracks.
        </p>
      );
      return;
    }

    try {
      // ... (the rest of your savePlaylistToSpotify code)
    } catch (error) {
      setError(`Error saving playlist to Spotify: ${error.message}`);
    }
  };

  // Function to refresh the access token when it expires
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("spotify_refresh_token");

      if (refreshToken) {
        const response = await fetch("YOUR_REFRESH_TOKEN_URL", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.access_token);
          localStorage.setItem("spotify_refresh_token", data.refresh_token);
          const expiresIn = new URLSearchParams(
            window.location.hash.substring(1)
          ).get("expires_in");
          if (expiresIn) {
            const expirationTime = Date.now() + parseInt(expiresIn, 10) * 1000;
            localStorage.setItem("spotify_token_expiration", expirationTime);
          }
        }
      } else {
        initiateSpotifyLogin();
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
    }
  };

  useEffect(() => {
    // If the access token exists and is about to expire, refresh it
    if (accessToken) {
      const expirationTime = localStorage.getItem("spotify_token_expiration");
      if (expirationTime && Date.now() > parseInt(expirationTime, 10)) {
        refreshAccessToken();
      }
    }
  }, [accessToken]);

  return (
    <div className="flex-1 justify-center mt-[50px] shadow-lg lg:w-90 lg:mb-8">
      <input
        type="text"
        className="w-[287px] bg-[#003636] text-white p-1 border-[3px] rounded mb-4 text-center"
        value={name}
        onChange={(e) => {
          onEdit(e.target.value);
        }}
        onBlur={onSave}
      />
      <ul>
        {playlist.tracks.map((track) => (
          <div
            className="flex justify-center h-7 text-[#003636] text-[1rem] border-b border-gray-300"
            key={track.id}
          >
            <li>
              {track.name} - {track.artist}
            </li>
            <button
              className="text-teal-500 hover:text-teal-600 font-bold pl-2"
              onClick={() => playTrackSample(track)}
            >
              ▷
            </button>
            <button
              className="text-red-600 hover:text-red-500 font-bold pl-2 flex-end"
              onClick={() => onRemove(track)}
            >
              x
            </button>
          </div>
        ))}
      </ul>
      {accessToken ? (
        <div className="mt-10 text-green-700">
          {user ? (
            <div className="flex items-center justify-center">
              <p className="mr-2">Logged in as {user.display_name}</p>
              <img
                className="rounded-full"
                src={user.images[0].url}
                alt="user"
                height={30}
                width={30}
              />
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
          <button
            className="font-bold text-white hover-text-[#6c41e9] bg-[#6c41e9] hover-bg-[lightgrey] py-[.57rem] px-2 mt-10 rounded-[54px] transition 0.25s"
            onClick={savePlaylistToSpotify}
          >
            SAVE PLAYLIST
          </button>
        </div>
      ) : (
        <button
          className="font-bold text-gray-400 hover-text-white bg-purple-200 hover-bg-[#6c41e9] uppercase py-[.57rem] px-2 mt-10 rounded-[54px] transition 0.25s"
          onClick={initiateSpotifyLogin}
        >
          Login with Spotify
        </button>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Playlist;
