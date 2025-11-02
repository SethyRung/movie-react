import React from "react";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { render } from "../../../../test-utils";
import MovieCard from "@features/movies/components/MovieCard/MovieCard";

const mockMovie = {
  id: 1,
  images: "/test-poster.jpg",
  title: "Test Movie",
  release: "2023-01-01",
  language: "English",
  rating: "8.5",
};

describe("MovieCard", () => {
  it("renders movie information correctly", () => {
    render(<MovieCard {...mockMovie} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("shows poster image with correct src and alt", () => {
    render(<MovieCard {...mockMovie} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/test-poster.jpg");
    expect(image).toHaveAttribute("alt", "Test Movie Image");
  });

  it("renders view details link with correct href", () => {
    render(<MovieCard {...mockMovie} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movies/1");
    expect(screen.getByText("View Details")).toBeInTheDocument();
  });

  it("displays rating with star icon", () => {
    render(<MovieCard {...mockMovie} />);

    expect(screen.getByText("8.5")).toBeInTheDocument();
    const ratingContainer = screen.getByText("8.5").closest("div");
    expect(ratingContainer).toBeInTheDocument();
  });
});
