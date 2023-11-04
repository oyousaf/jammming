import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  test("renders without crashing", () => {
    render(<SearchBar onSearch={() => {}} />);
  });

  test("displays an input field", () => {
    const { getByPlaceholderText } = render(<SearchBar onSearch={() => {}} />);
    const inputField = getByPlaceholderText("Enter a song, album or artist...");
    expect(inputField).toBeInTheDocument();
  });

  test("updates the input field value when typing", () => {
    const { getByPlaceholderText } = render(<SearchBar onSearch={() => {}} />);
    const inputField = getByPlaceholderText("Enter a song, album or artist...");
    fireEvent.change(inputField, { target: { value: "Test Input" } });
    expect(inputField).toHaveValue("Test Input");
  });

  test("calls onSearch function when clicking the search button", () => {
    const onSearch = jest.fn();
    const { getByText } = render(<SearchBar onSearch={onSearch} />);
    const searchButton = getByText("Search");
    fireEvent.click(searchButton);
    expect(onSearch).toHaveBeenCalled();
  });

  test("calls onSearch function when pressing Enter in the input field", () => {
    const onSearch = jest.fn();
    const { getByPlaceholderText } = render(<SearchBar onSearch={onSearch} />);
    const inputField = getByPlaceholderText("Enter a song, album or artist...");
    fireEvent.change(inputField, { target: { value: "Test Input" } });
    fireEvent.keyDown(inputField, { key: "Enter", code: "Enter" });
    expect(onSearch).toHaveBeenCalled();
  });
});
