import React, { useEffect, useState, useRef } from "react";
import "../styles/showSongs.css";
import { useDispatch } from "react-redux";
import { setCurrentSong } from "../store/slices/musicSlice.ts";

/**
 * Song interface for local component use
 * Represents the structure of song data from Firebase
 */
interface Song {
  title?: string;
  artist?: string;
  image?: string;
  audioUrl?: string;
}

/**
 * Props interface for ShowSongs component
 */
interface ShowSongsProps {
  searchTerm?: string; // Optional search filter from parent component
}

/**
 * ShowSongs Component
 *
 * Displays a horizontally scrollable grid of song cards for music discovery.
 *
 * Features:
 * - Fetches songs from Firebase Realtime Database
 * - Real-time search filtering by title and artist
 * - Horizontal scrolling with navigation arrows
 * - Song selection for music player
 * - Responsive design with mobile support
 * - Play button overlay on hover
 *
 * Used on:
 * - Dashboard page for trending songs
 * - Any page that needs to display a song collection
 */
export default function ShowSongs({ searchTerm = "" }: ShowSongsProps) {
  // =============== STATE MANAGEMENT ===============
  const [songs, setSongs] = useState<Song[]>([]);

  // Reference for horizontal scroll container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Redux dispatch for updating global music state
  const dispatch = useDispatch();

  // =============== DATA FETCHING EFFECT ===============

  /**
   * Effect: Fetch songs from Firebase on component mount
   * Loads the complete song library from Firebase Realtime Database
   */
  useEffect(() => {
    fetch("https://spotify-project-123-default-rtdb.firebaseio.com/songs.json")
      .then((response) => response.json())
      .then((data) => setSongs(data))
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  // =============== COMPUTED VALUES ===============

  /**
   * Filters songs based on search term
   * Searches in both song title and artist fields (case-insensitive)
   */
  const filteredSongs = songs.filter((song) => {
    const term = searchTerm.toLowerCase();
    return (
      song.title?.toLowerCase().includes(term) ||
      song.artist?.toLowerCase().includes(term)
    );
  });

  // =============== SCROLL CONTROL FUNCTIONS ===============

  /**
   * Handles horizontal scrolling of the song container
   * Provides smooth scrolling navigation for the song grid
   *
   * @param direction - "left" or "right" scroll direction
   */
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Pixels to scroll per click
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // =============== RENDER ===============
  return (
    <div className="songs-wrapper">
      {/* Left scroll arrow button */}
      <button className="scroll-button left" onClick={() => scroll("left")}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* Horizontally scrollable song container */}
      <div className="songs-container" ref={scrollContainerRef}>
        {filteredSongs.map((song, index) => (
          <div key={index} className="song-card">
            {/* Song cover image with play button overlay */}
            <div className="song-image">
              <img src={song.image} alt={song.title || "Song cover"} />

              {/* Play button that appears on hover */}
              <div
                className="play-button-1"
                onClick={() => dispatch(setCurrentSong(song))}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Song metadata display */}
            <div className="song-info">
              <h3 className="song-title">{song.title || "Unknown Title"}</h3>
              <p className="song-artist">{song.artist || "Unknown Artist"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right scroll arrow button */}
      <button className="scroll-button right" onClick={() => scroll("right")}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
  );
}
