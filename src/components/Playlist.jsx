import React, { useState, useEffect } from "react";
import { authConfig } from "../constants/authConfig";
import Playlists from "./Playlists";

const Playlist = ({ playlist, name, onEdit, onSave, onRemove }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [error, setError] = useState(null);
  const [playlistId, setPlaylistId] = useState(null);

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
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        setUser(await response.json());
      } else {
        console.error("Error fetching user data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("spotify_refresh_token");

      if (refreshToken) {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
    handleSpotifyCallback();

    if (accessToken) {
      fetchUserData();
      const expirationTime = localStorage.getItem("spotify_token_expiration");
      if (expirationTime && Date.now() > parseInt(expirationTime, 10)) {
        refreshAccessToken();
      }
    }
    setLoading(false);
    // eslint-disable-next-line
  }, [accessToken]);

  const initiateSpotifyLogin = () => {
    const { clientId, redirectUri, scope } = authConfig;
    window.location.href = `${authConfig.authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
  };

  const savePlaylistToSpotify = async () => {
    if (!accessToken || !playlist.tracks.length) {
      setError("Playlist cannot be empty! Try adding some tracks.");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      const playlistData = {
        name,
        description: "Playlist created using Jammming",
        public: false,
      };

      if (playlistId) {
        const updatePlaylistResponse = await fetch(
          `https://api.spotify.com/v1/users/${user.id}/playlists/${playlistId}`,
          { method: "PUT", headers, body: JSON.stringify(playlistData) }
        );
        if (!updatePlaylistResponse.ok) {
          setError("Error updating the playlist.");
          return;
        }
      } else {
        const createPlaylistResponse = await fetch(
          "https://api.spotify.com/v1/me/playlists",
          {
            method: "POST",
            headers,
            body: JSON.stringify(playlistData),
          }
        );

        if (createPlaylistResponse.ok) {
          const { id } = await createPlaylistResponse.json();
          setPlaylistId(id);
        } else {
          setError("Error creating playlist.");
          return;
        }
      }

      const uris = playlist.tracks.map((track) => track.uri);

      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ uris }),
        }
      );

      if (addTracksResponse.ok) {
        alert("Playlist saved to Spotify!");
        onEdit([]);
        setPlaylistId(null);
      } else {
        setError("Error adding tracks to the playlist.");
      }
    } catch (error) {
      setError(`Error saving playlist to Spotify: ${error.message}`);
    }
  };

  const playTrackSample = (track) => {
    if (track.preview_url) {
      const audio = new Audio(track.preview_url);
      audio.play();
    } else {
      alert("No preview available for this track.");
      console.log("No preview available for this track.");
    }
  };

  const handleSelectPlaylist = (selectedPlaylist) => {
    setSelectedPlaylist(selectedPlaylist);
  };

  const formatDuration = (duration_ms) => {
    if (typeof duration_ms !== "number" || isNaN(duration_ms)) {
      return "Not Available";
    }
    const minutes = Math.floor(duration_ms / 60000);
    const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const renderPlaylistHeader = () => (
    <input
      type="text"
      className="w-[287px] bg-[#003636] text-white p-1 border-[3px] rounded mb-4 text-center"
      value={name}
      onChange={(e) => onEdit(e.target.value)}
      onBlur={onSave}
    />
  );

  const renderTrack = (track) => (
    <div
      key={track.id}
      className="flex justify-center h-7 text-[#003636] text-[1rem] border-b border-gray-300"
    >
      <li>
        {track.name} - {track.artist}
      </li>
      <span className="ml-2 text-gray-500">
        {formatDuration(track.duration_ms)}
      </span>
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
  );

  const renderPlaylist = () => (
    <>
      {selectedPlaylist?.tracks
        ? selectedPlaylist.tracks.map(renderTrack)
        : playlist?.tracks?.map(renderTrack)}
      <div className="mt-10 text-green-700">
        {user ? (
          <>
            <div className="flex items-center justify-center">
              <p className="mr-2">Logged in as {user.display_name}</p>
              <img
                className="rounded-full"
                src={user.images[0]?.url}
                alt="User profile"
                height={30}
                width={30}
              />
            </div>
            <button
              className="font-bold text-white hover:text-[#6c41e9] bg-[#6c41e9] hover:bg-[lightgrey] py-[.57rem] px-2 mt-10 rounded-[54px] transition 0.25s"
              onClick={savePlaylistToSpotify}
            >
              SAVE PLAYLIST
            </button>
            <Playlists
              accessToken={accessToken}
              playlist={playlist}
              onSelectPlaylist={handleSelectPlaylist}
            />
          </>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </>
  );

  const renderLoginButton = () => (
    <button
      className="font-bold text-gray-400 hover:text-white bg-purple-200 hover:bg-[#6c41e9] uppercase py-[.57rem] px-2 mt-10 rounded-[54px] transition 0.25s"
      onClick={initiateSpotifyLogin}
    >
      Login to Spotify
    </button>
  );

  return (
    <div className="flex-1 justify-center mt-[50px] shadow-lg lg:w-90 lg:mb-8">
      {renderPlaylistHeader()}
      <ul>
        {!loading
          ? accessToken
            ? renderPlaylist()
            : renderLoginButton()
          : null}
      </ul>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default Playlist;
