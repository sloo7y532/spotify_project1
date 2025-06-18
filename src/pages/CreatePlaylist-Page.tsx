import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import "../styles/CreatePlaylist.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/index.ts";
import {
  addPlaylistToFirebase,
  fetchSongsFromFirebase,
  uploadPlaylistImage,
} from "../firebase/playlistService.ts";
import { setPlaylist } from "../store/slices/musicSlice.ts";
import { Song } from "../store/slices/musicSlice.ts";

export default function CreatePlaylistPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [playlistName, setPlaylistName] = useState("");
  const [playlistDesc, setPlaylistDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load songs when query changes
  useEffect(() => {
    const loadSongs = async () => {
      if (searchQuery.trim()) {
        const songs = await fetchSongsFromFirebase(searchQuery.trim());
        setSearchResults(songs);
      } else {
        setSearchResults([]);
      }
    };
    loadSongs();
  }, [searchQuery]);

  const handleAddSong = (song: Song) => {
    if (!selectedSongs.find((s) => s.id === song.id)) {
      setSelectedSongs((prev) => [...prev, song]);
    }
  };

  const handleRemoveSong = (id?: string) => {
    setSelectedSongs((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      // Upload cover image if provided
      let coverUrl: string | undefined;
      if (coverFile) {
        coverUrl = await uploadPlaylistImage(coverFile, user.id);
      }

      const newPlaylist = {
        name: playlistName,
        description: playlistDesc,
        userId: user.id,
        songs: selectedSongs,
        coverUrl,
      };

      await addPlaylistToFirebase(newPlaylist);
      dispatch(setPlaylist([]));
      // Reset form
      setPlaylistName("");
      setPlaylistDesc("");
      setSelectedSongs([]);
      setCoverFile(null);
      setCoverPreview(null);
      alert("Playlist created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="create-playlist-page">
      <form className="playlist-form" onSubmit={handleSubmit}>
        <h2>Create New Playlist</h2>

        <label>
          Name
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Playlist name"
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={playlistDesc}
            onChange={(e) => setPlaylistDesc(e.target.value)}
            placeholder="Add a description (optional)"
          />
        </label>

        <label className="cover-input">
          Cover Image
          <input type="file" accept="image/*" onChange={handleCoverChange} />
        </label>

        {coverPreview && (
          <div className="cover-preview">
            <img src={coverPreview} alt="Cover preview" />
          </div>
        )}

        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs..."
          />
        </div>

        {isLoading && <p className="loading">Searching...</p>}

        {!isLoading && searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((song) => {
              const alreadyAdded = selectedSongs.some((s) => s.id === song.id);

              return (
                <li key={song.id} className="song-item">
                  <img src={song.image} alt={song.title} />
                  <div className="song-info">
                    <p className="title">{song.title}</p>
                    <p className="artist">{song.artist}</p>
                  </div>
                  <button
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => handleAddSong(song)}
                  >
                    {alreadyAdded ? "Added" : "Add"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {!isLoading && searchQuery.trim() && searchResults.length === 0 && (
          <p className="no-results">No songs found for “{searchQuery}”</p>
        )}

        <button type="submit" disabled={isSaving || !playlistName}>
          {isSaving ? "Saving..." : "Create Playlist"}
        </button>
      </form>
    </div>
  );
}
