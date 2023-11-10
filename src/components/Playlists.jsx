import React, { useState, useEffect, useCallback } from "react";
import PlaylistsItem from "./PlaylistsItem";

const Playlists = ({ accessToken, onSelectPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);

  const getCurrentUserId = useCallback(async () => {
    const storedUserId = localStorage.getItem("spotify_user_id");
    if (storedUserId) return storedUserId;

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await response.json();
    localStorage.setItem("spotify_user_id", userData.id);
    return userData.id;
  }, [accessToken]);

  const getUserPlaylists = useCallback(async () => {
    try {
      const userId = await getCurrentUserId();
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.ok) {
        const playlistsData = await response.json();
        setPlaylists(
          playlistsData.items.map(({ id, name }) => ({ playlistId: id, name }))
        );
      } else {
        console.error("Error fetching user playlists:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user playlists:", error);
    }
  }, [getCurrentUserId, accessToken]);

  useEffect(() => {
    getUserPlaylists();
  }, [getUserPlaylists]);

  const getPlaylist = async (playlistId) => {
    try {
      const userId = await getCurrentUserId();
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.ok) {
        const playlistData = await response.json();
        return playlistData.items.map(({ track }) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          preview_url: track.preview_url,
          duration_ms: track.duration_ms,
        }));
      } else {
        console.error("Error fetching playlist tracks:", response.status);
      }
    } catch (error) {
      console.error("Error fetching playlist tracks", error);
    }
  };

  const selectPlaylist = async (playlistId) => {
    try {
      const tracks = await getPlaylist(playlistId);
      const selectedPlaylist = { id: playlistId, tracks };
      onSelectPlaylist(selectedPlaylist);
      console.log("Selected Playlist:", selectedPlaylist);
    } catch (error) {
      console.error("Error selecting playlist:", error);
    }
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-gray-300 shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-[#003636]">Your Playlists</h2>
      {playlists.map(({ playlistId, name }) => (
        <PlaylistsItem
          key={playlistId}
          playlistId={playlistId}
          name={name}
          selectPlaylist={selectPlaylist}
          onSelectPlaylist={onSelectPlaylist}
        />
      ))}
    </div>
  );
};

export default Playlists;
