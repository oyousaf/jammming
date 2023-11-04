import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SearchResults from "./SearchResults";

describe("SearchResults Component", () => {
  test("renders without crashing", () => {
    render(<SearchResults searchResults={[]} error={null} onAdd={() => {}} />);
  });

  test('displays the "Results" header', () => {
    const { getByText } = render(
      <SearchResults searchResults={[]} error={null} onAdd={() => {}} />
    );
    const header = getByText("Results");
    expect(header).toBeInTheDocument();
  });

  test("renders the Tracklist component", () => {
    const { getByTestId } = render(
      <SearchResults searchResults={[]} error={null} onAdd={() => {}} />
    );
    const tracklist = getByTestId("tracklist"); // Set a 'data-testid' on the Tracklist component
    expect(tracklist).toBeInTheDocument();
  });

  test("calls onAdd function when interacting with the component", () => {
    const onAdd = jest.fn();
    const { getByText } = render(
      <SearchResults searchResults={[]} error={null} onAdd={onAdd} />
    );
    const addButton = getByText("Add"); // Assuming the 'Add' button is part of the Tracklist component
    fireEvent.click(addButton);
    expect(onAdd).toHaveBeenCalled();
  });

  test("displays an error message when error is provided", () => {
    const errorMessage = "An error occurred";
    const { getByText } = render(
      <SearchResults searchResults={[]} error={errorMessage} onAdd={() => {}} />
    );
    const errorElement = getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });
});
