import React from "react";

const Track = ({ track }) => {
  const { name, artists, albumOfTrack } = track;

  return (
    <div className="w-full flex items-center border-[rgba(256, 256, 256, 0.8)]">
      <div className="flex-1 justify-center min-h-[0.2rem] pb-[2rem] text-white">
        <h3 className="text-[#003636] uppercase text-xl">Name: {name}</h3>
        <p className="text-white text-[1rem] font-light">
          Artist(s):{" "}
          {artists.items.map((artist) => artist.profile.name).join(", ")}
        </p>
        <p className="text-white text-[1rem] font-light border-b border-gr-300">
          Album: {albumOfTrack.name}
        </p>
      </div>
    </div>
  );
};

export default Track;
