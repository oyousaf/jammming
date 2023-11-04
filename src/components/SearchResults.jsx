import React from "react";
import Tracklist from "./Tracklist";

const SearchResults = ({ searchResults, error, onAdd }) => {
  return (
    <div className="pt-5 w-1/2 h-[600px] overflow-y-scroll no-scrollbar p-[.88rem] bg-[rgba(1, 12, 63, 0.7)] shadow-lg lg:w-90 lg:mb-8">
      <h2 className="uppercase text-2xl text-white mt-3 pb-4">Results</h2>
      <Tracklist
        searchResults={searchResults}
        error={error}
        onAdd={onAdd}
      />
    </div>
  );
};

export default SearchResults;
