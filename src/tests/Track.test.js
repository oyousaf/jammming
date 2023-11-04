import React from "react";
import { render, screen } from "@testing-library/react";
import Track from "./Track";

describe("Track Component", () => {
  const mockTrack = {
    name: "Sample Track",
    artists: {
      items: [
        { profile: { name: "Artist 1" } },
        { profile: { name: "Artist 2" } },
        { profile: { name: "Artist 3" } },
      ],
    },
    albumOfTrack: {
      name: "Sample Album",
    },
  };

  it("should render the track name", () => {
    render(<Track track={mockTrack} />);
    expect(screen.getByText("Name: Sample Track")).toBeInTheDocument();
  });

  it("should render the artist(s)", () => {
    render(<Track track={mockTrack} />);
    expect(
      screen.getByText("Artist(s): Artist 1, Artist 2")
    ).toBeInTheDocument();
  });

  it("should render the album name", () => {
    render(<Track track={mockTrack} />);
    expect(screen.getByText("Album: Sample Album")).toBeInTheDocument();
  });

  it("should have the correct class names for styling", () => {
    render(<Track track={mockTrack} />);
    expect(screen.getByText("Name: Sample Track")).toHaveClass("text-xl");
    expect(screen.getByText("Artist(s): Artist 1, Artist 2")).toHaveClass(
      "text-white"
    );
    expect(screen.getByText("Album: Sample Album")).toHaveClass("text-white");
  });

  it("should handle empty artist list gracefully", () => {
    const trackWithNoArtists = {
      ...mockTrack,
      artists: { items: [] },
    };
    render(<Track track={trackWithNoArtists} />);
    expect(screen.getByText("Artist(s):")).toBeInTheDocument();
  });
});
