import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Playlist from "./Playlist";

describe("Playlist Component", () => {
  test("renders without crashing", () => {
    render(
      <Playlist
        playlistTracks={[]}
        onRemove={() => {}}
        onNameChange={() => {}}
        onSave={() => {}}
      />
    );
  });

  test("displays the playlist name input field", () => {
    const { getByPlaceholderText } = render(
      <Playlist
        playlistTracks={[]}
        onRemove={() => {}}
        onNameChange={() => {}}
        onSave={() => {}}
      />
    );
    const nameInput = getByPlaceholderText("New Playlist");
    expect(nameInput).toBeInTheDocument();
  });

  test("updates the playlist name when typing", () => {
    const { getByPlaceholderText } = render(
      <Playlist
        playlistTracks={[]}
        onRemove={() => {}}
        onNameChange={() => {}}
        onSave={() => {}}
      />
    );
    const nameInput = getByPlaceholderText("New Playlist");
    fireEvent.change(nameInput, { target: { value: "Test Playlist" } });
    expect(nameInput).toHaveValue("Test Playlist");
  });

  test("displays the playlist tracks", () => {
    const { getByText } = render(
      <Playlist
        playlistTracks={[
          { id: 1, name: "Track 1" },
          { id: 2, name: "Track 2" },
        ]}
        onRemove={() => {}}
        onNameChange={() => {}}
        onSave={() => {}}
      />
    );
    const track1 = getByText("Track 1");
    const track2 = getByText("Track 2");
    expect(track1).toBeInTheDocument();
    expect(track2).toBeInTheDocument();
  });

  test("calls onRemove function when removing a track", () => {
    const onRemove = jest.fn();
    const { getByText } = render(
      <Playlist
        playlistTracks={[{ id: 1, name: "Track 1" }]}
        onRemove={onRemove}
        onNameChange={() => {}}
        onSave={() => {}}
      />
    );
    const removeButton = getByText("Remove");
    fireEvent.click(removeButton);
    expect(onRemove).toHaveBeenCalled();
  });

  test("calls onNameChange function when changing the playlist name", () => {
    const onNameChange = jest.fn();
    const { getByPlaceholderText } = render(
      <Playlist
        playlistTracks={[]}
        onRemove={() => {}}
        onNameChange={onNameChange}
        onSave={() => {}}
      />
    );
    const nameInput = getByPlaceholderText("New Playlist");
    fireEvent.change(nameInput, { target: { value: "Test Playlist" } });
    expect(onNameChange).toHaveBeenCalledWith("Test Playlist");
  });

  test('displays the "Save to Spotify" button', () => {
    const { getByText } = render(
      <Playlist
        playlistTracks={[]}
        onRemove={() => {}}
        onNameChange={() => {}}
        onSave={() => {}}
      />
    );
    const saveButton = getByText("Save to Spotify");
    expect(saveButton).toBeInTheDocument();
  });

  test('calls onSave function when clicking the "Save to Spotify" button', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Playlist
        playlistTracks={[]}
        onRemove={() => {}}
        onNameChange={() => {}}
        onSave={onSave}
      />
    );
    const saveButton = getByText("Save to Spotify");
    fireEvent.click(saveButton);
    expect(onSave).toHaveBeenCalled();
  });

  // New tests:

  test('disables the "Save to Spotify" button when the playlist name is empty', () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Playlist
        playlistTracks={[]}
        onRemove={() => {}}
        onNameChange={() => {}}
        onSave={onSave}
      />
    );
    const saveButton = getByText("Save to Spotify");
    fireEvent.click(saveButton);
    expect(onSave).not.toHaveBeenCalled();
  });

  test('enables the "Save to Spotify" button when the playlist name is not empty', () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <Playlist
        playlistTracks={[]}
        onRemove={() => {}}
        onNameChange={() => {}}
        onSave={onSave}
      />
    );
    const nameInput = getByPlaceholderText("New Playlist");
    fireEvent.change(nameInput, { target: { value: "Test Playlist" } });
    const saveButton = getByText("Save to Spotify");
    fireEvent.click(saveButton);
    expect(onSave).toHaveBeenCalled();
  });
});
