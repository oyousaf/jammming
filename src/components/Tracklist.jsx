import React from "react";
import Track from "./Track";

const Tracklist = ({ searchResults, error, onAdd }) => {
  return (
    <div className="w-full">
      {error ? (
        <p>Error: {error.message}</p>
      ) : searchResults &&
        searchResults.tracks &&
        Array.isArray(searchResults.tracks.items) ? (
        searchResults.tracks.items.map((track) => (
          <div className="flex items-center mb-4" key={track.data.id}>
            <Track track={track.data} />
            <button
              className="text-3xl text-green-600 hover:text-green-500 font-bold"
              onClick={() => onAdd(track.data)}
            >
              +
            </button>
          </div>
        ))
      ) : (
        <p>No data received</p>
      )}
    </div>
  );
};

export default Tracklist;
