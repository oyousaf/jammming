import React from "react";

const PlaylistsItem = ({
  playlistId,
  name,
  selectPlaylist,
  onSelectPlaylist,
}) => {
  const handleClick = () => {
    selectPlaylist(playlistId);
    onSelectPlaylist({ id: playlistId, name });
  };

  return (
    <div
      className="bg-[#003636] p-4 rounded-md mb-4 shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <p className="text-lg font-medium text-gray-300 hover:text-gray-100">
        {name}
      </p>
    </div>
  );
};

export default PlaylistsItem;
