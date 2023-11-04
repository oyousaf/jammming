import React, { useState, useEffect } from "react";
import axios from "axios";

import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  // Editing the playlist
  const [playlist, setPlaylist] = useState({
    name: "My Playlist",
    tracks: [],
  });

  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data from RapidAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!searchQuery) {
          setSearchResults([]);
          setError(null);
          return;
        }

        const options = {
          method: "GET",
          url: "https://spotify23.p.rapidapi.com/search/",
          params: {
            q: searchQuery,
            type: "multi",
            offset: "0",
            limit: "10",
            numberOfTopResults: "5",
          },
          headers: {
            "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
            "X-RapidAPI-Host": "spotify23.p.rapidapi.com",
          },
        };

        try {
          const response = await axios.request(options);
          console.log(response.data);
          setSearchResults(response.data);
          setError(null);
        } catch (error) {
          console.error(error);
          setError(error);
        }
      } catch (error) {
        setSearchResults([]);
        setError(error);
      }
    };

    fetchData();
  }, [searchQuery]);

  // Setting SearchQuery to user input
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Add track to custom playlist
  const onAdd = (track) => {
    const isTrackInPlaylist = playlist.tracks.some(
      (playlistTrack) => playlistTrack.id === track.id
    );

    if (!isTrackInPlaylist) {
      setPlaylist({
        ...playlist,
        tracks: [...playlist.tracks, track],
      });
    }
  };

  // Remove track from custom playlist
  const onRemove = (track) => {
    if (track && track.id) {
      const updatedTracks = playlist.tracks.filter(
        (playlistTrack) => playlistTrack.id !== track.id
      );

      setPlaylist({
        ...playlist,
        tracks: updatedTracks,
      });
    }
  };

  return (
    <div className="bg-[#C3B1E1] w-full text-center min-h-[100vh]">
      <header className="text-4xl uppercase">Jammming</header>
      <SearchBar onSearch={handleSearch} />
      <div className="flex">
        <SearchResults
          searchResults={searchResults}
          error={error}
          onAdd={onAdd}
        />
        <Playlist
          playlist={playlist}
          name={playlistName}
          isEditing={isEditing}
          onEdit={setPlaylistName}
          onSave={() => setIsEditing(false)}
          tracks={playlist}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
};

export default App;
