import React, { useState, useEffect } from "react";
import { authConfig } from "../constants/authConfig";

const Playlist = ({ playlist, name, onEdit, onSave, onRemove }) => {
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const handleSpotifyCallback = () => {
    const token = new URLSearchParams(window.location.hash.substring(1)).get(
      "access_token"
    );
    if (token) {
      setAccessToken(token);
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const initiateSpotifyLogin = () => {
    const { clientId, redirectUri, scope } = authConfig;
    window.location.href = `${authConfig.authorizationUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
  };

  const savePlaylistToSpotify = async () => {
    if (!accessToken || !playlist.tracks.length) {
      setError(
        <p className="mt-5 text-red-600">
          Playlist cannot be empty. Try adding some tracks first
        </p>
      );
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      const playlistData = {
        name: name,
        description: "Playlist created using Jammming",
        public: false,
      };

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
        const uris = playlist.tracks.map((track) => track.uri);

        const addTracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${id}/tracks`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ uris }),
          }
        );

        if (addTracksResponse.ok) {
          alert("Playlist saved to Spotify!");
          playlist.tracks = [];
        } else {
          setError("Error adding tracks to the playlist.");
        }
      } else {
        setError("Error creating the playlist.");
      }
    } catch (error) {
      setError(`Error saving playlist to Spotify: ${error.message}`);
    }
  };

  useEffect(() => {
    handleSpotifyCallback();
  }, []);

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
              className="text-red-600 hover:text-red-500 font-bold pl-2"
              onClick={() => onRemove(track)}
            >
              x
            </button>
          </div>
        ))}
      </ul>
      {accessToken ? (
        <div className="mt-10 uppercase text-green-700">
          <p>Logged in to Spotify</p>
          <button
            className="font-bold text-white hover:text-[#6c41e9] bg-[#6c41e9] hover:bg-[lightgrey] py-[.57rem] px-2 mt-10 rounded-[54px] transition 0.25s"
            onClick={savePlaylistToSpotify}
          >
            SAVE PLAYLIST
          </button>
        </div>
      ) : (
        <button
          className="font-bold text-gray-400 hover:text-white bg-purple-200 hover:bg-[#6c41e9] uppercase py-[.57rem] px-2 mt-10 rounded-[54px] transition 0.25s"
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
