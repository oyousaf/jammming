import React, { useState } from "react";

const SearchBar = (props) => {
  const [input, setInput] = useState("");

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSearch = () => {
    if (input === "") {
      alert("Please enter a song, album, or artist!");
    } else {
      props.onSearch(input);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="align-center pt-[3rem]">
      <div>
        <input
          placeholder="Enter a song, album or artist..."
          className="w-[287px] p-1 border-[3px] rounded mb-2 text-center"
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
      </div>
      <div>
        <button
          className="w-[7rem] text-white hover:text-[#6c41e9] bg-[#6c41e9] hover:bg-[lightgrey] cursor-pointer py-[.57rem] px-0 rounded-[54px] transition 0.25s"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
