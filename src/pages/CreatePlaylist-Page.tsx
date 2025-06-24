import React, { useEffect, useState, FormEvent } from "react";
import "../styles/CreatePlaylist.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setPlaylist,
  setCurrentSong,
  setIsPlaying,
} from "../store/slices/musicSlice.ts";
import { FaSearch, FaPlay } from "react-icons/fa";
import musicPlaceholder from "../assets/music-player-1.png";
import { RootState } from "../store/index.ts";
import MusicTable from "../components/MusicTable.tsx";
import {
  addPlaylistToFirebase,
  Playlist as FirebasePlaylistType,
  NewPlaylist,
  fetchPlaylistById,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../firebase/playlistService.ts";
import { Song } from "../store/slices/musicSlice.ts";
import { setCurrentPlaylist } from "../store/slices/playlistSlice.ts";
import EditPlaylistModal, {
  PlaylistToEdit,
} from "../components/EditPlaylistModal.tsx";
import { useParams, useNavigate } from "react-router-dom";
import MusicPlayer from "../components/MusicPlayer.tsx";
import { useToast } from "../context/ToastContext.tsx";

const CreatePlaylistPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const { showToast } = useToast();

  const [playlistName, setPlaylistName] = useState("My Playlist #1");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingPlaylist, setCurrentEditingPlaylist] =
    useState<PlaylistToEdit | null>(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(
    null
  );
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const { playlistId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlaylistFromBackend = async () => {
      if (playlistId) {
        try {
          const playlist = await fetchPlaylistById(playlistId);
          if (playlist) {
            setPlaylistName(playlist.name || "My Playlist #1");
            setPlaylistDescription(playlist.description || "");
            setCoverPreviewUrl(playlist.coverUrl || null);
            setSelectedSongs(playlist.songs || []);
            setCurrentPlaylistId(playlist.id);
            dispatch(setPlaylist(playlist.songs || []));
          }
        } catch (error) {
          console.error("Error loading playlist:", error);
        }
      }
    };
    loadPlaylistFromBackend();
  }, [playlistId, dispatch]);

  useEffect(() => {
    fetch("https://spotify-project-123-default-rtdb.firebaseio.com/songs.json")
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const loadedSongs: Song[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // For each song, fetch duration if audioUrl exists
        const fetchDurations = loadedSongs.map(
          (song) =>
            new Promise<Song>((resolve) => {
              if (song.audioUrl) {
                const audio = new window.Audio();
                audio.src = song.audioUrl;
                audio.addEventListener("loadedmetadata", () => {
                  resolve({ ...song, duration: audio.duration });
                });
                audio.addEventListener("error", () => {
                  resolve(song); // fallback if audio fails to load
                });
              } else {
                resolve(song);
              }
            })
        );

        Promise.all(fetchDurations).then((songsWithDurations) => {
          setSongs(songsWithDurations);
        });
      })
      .catch((error) => console.error("Error fetching songs:", error));
  }, []);

  useEffect(() => {
    const defaultCoverUrl = "https://example.com/default-playlist-cover.png";
    const playlistData = {
      id: currentPlaylistId || "new",
      name: playlistName,
      description: playlistDescription,
      coverUrl: coverPreviewUrl || defaultCoverUrl,
      userId: user?.id || "",
      ownerEmail: email || "",
      songs: selectedSongs,
    };

    setCurrentEditingPlaylist(playlistData);
  }, [
    playlistName,
    playlistDescription,
    coverPreviewUrl,
    selectedSongs,
    currentPlaylistId,
    user?.id,
    email,
  ]);

  useEffect(() => {
    dispatch(setIsPlaying(false));
    dispatch(setCurrentSong(null));
  }, [dispatch]);

  const createNewPlaylistAndGetId = async (
    firstSong: Song
  ): Promise<FirebasePlaylistType | null> => {
    if (!user || !playlistName.trim()) {
      showToast("Please provide a playlist name.", "error");
      return null;
    }

    if (isCreatingPlaylist) {
      showToast("Playlist is being created, please wait...", "info");
      return null;
    }

    setIsCreatingPlaylist(true);

    try {
      const imageUrl =
        coverPreviewUrl || "https://example.com/default-playlist-cover.png";
      const playlistToSave: NewPlaylist = {
        name: playlistName,
        description: playlistDescription,
        coverUrl: imageUrl,
        songs: [{ ...firstSong, dateAdded: new Date().toISOString() }],
        userId: user.id,
        ownerEmail: email || "Unknown",
      };

      const newPlaylist = await addPlaylistToFirebase(playlistToSave);
      setCurrentPlaylistId(newPlaylist.id);
      dispatch(setCurrentPlaylist(newPlaylist));
      dispatch(setPlaylist(newPlaylist.songs));
      setSelectedSongs(newPlaylist.songs);
      showToast(`Playlist "${playlistName}" created successfully!`, "success");
      navigate(`/create-playlist/${newPlaylist.id}`);
      return newPlaylist;
    } catch (error) {
      console.error("Error creating playlist:", error);
      showToast("Failed to create playlist. Please try again.", "error");
      return null;
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  const handleSongToggle = async (song: Song) => {
    // Prevent operations while creating playlist
    if (isCreatingPlaylist) {
      showToast("Please wait while playlist is being created...", "info");
      return;
    }

    let playlistIdToUse = currentPlaylistId;
    const isSelected = selectedSongs.some((s) => s.id === song.id);

    // If no playlist exists, create one with the first song
    if (!playlistIdToUse) {
      const newPlaylist = await createNewPlaylistAndGetId(song);
      if (newPlaylist) {
        // The song is already added during playlist creation, so we're done
        return;
      } else {
        showToast("Cannot add song, playlist creation failed.", "error");
        return;
      }
    }

    // Handle adding/removing songs from existing playlist
    try {
      if (isSelected) {
        await removeSongFromPlaylist(playlistIdToUse, song);
        const newSelectedSongs = selectedSongs.filter((s) => s.id !== song.id);
        setSelectedSongs(newSelectedSongs);
        dispatch(setPlaylist(newSelectedSongs));
        showToast(`Removed "${song.title}" from playlist`, "info");
      } else {
        const songWithDate = {
          ...song,
          dateAdded: song.dateAdded || new Date().toISOString(),
        };
        await addSongToPlaylist(playlistIdToUse, songWithDate);
        const newSelectedSongs = [...selectedSongs, songWithDate];
        setSelectedSongs(newSelectedSongs);
        dispatch(setPlaylist(newSelectedSongs));
        showToast(`Added "${song.title}" to playlist`, "success");
      }
    } catch (error) {
      console.error("Error updating song in playlist:", error);
      showToast("Failed to update playlist. Please try again.", "error");
    }
  };

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleSavePlaylistDetails = (updatedPlaylist: PlaylistToEdit) => {
    console.log("Saving playlist details:", updatedPlaylist);
    console.log("Current playlist ID before save:", currentPlaylistId);

    setPlaylistName(updatedPlaylist.name);
    setPlaylistDescription(updatedPlaylist.description || "");
    setCoverPreviewUrl(updatedPlaylist.coverUrl || null);

    // Update the currentPlaylistId if we have a valid ID
    if (updatedPlaylist.id && updatedPlaylist.id !== "new") {
      setCurrentPlaylistId(updatedPlaylist.id);

      // If this is a newly created playlist, navigate to it
      if (!currentPlaylistId) {
        navigate(`/create-playlist/${updatedPlaylist.id}`);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPlaylistId) {
      showToast(
        "Playlist will be created automatically when you add your first song.",
        "info"
      );
    } else {
      showToast(
        "Playlist already exists. You can edit details by clicking the name or manage songs below.",
        "info"
      );
    }
  };

  const filteredSongs = songs?.filter(
    (song) =>
      song.title?.toLowerCase().includes(search.toLowerCase()) ||
      song.artist?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="create-playlist-container">
      {isEditModalOpen && currentEditingPlaylist && (
        <EditPlaylistModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentPlaylist={currentEditingPlaylist}
          onSaveSuccess={handleSavePlaylistDetails}
        />
      )}

      <div className="create-playlist-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Your Library</h2>
        </div>

        <div className="playlists-section">
          <h3 className="playlists-section-title">Playlists</h3>
        </div>

        <div className="recents-header">
          <span className="recents-title">Recents</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
        </div>

        <div className="current-playlist-item">
          <div
            className="playlist-cover-thumb"
            style={{
              backgroundImage: coverPreviewUrl
                ? `url(${coverPreviewUrl})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {!coverPreviewUrl && (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            )}
          </div>
          <div className="playlist-info">
            <div
              className="playlist-name-editable"
              onClick={handleOpenEditModal}
            >
              {playlistName}
            </div>
            <div className="playlist-meta">Playlist • {email || "User"}</div>
          </div>
        </div>
      </div>

      <div className="main">
        <form onSubmit={handleSubmit} className="create-playlist-main">
          <div className="playlist-header">
            <div
              className={`cover-upload-container ${
                coverPreviewUrl ? "has-image" : ""
              }`}
              onClick={() =>
                showToast(
                  "Image upload functionality is no longer available. You can set it manually in edit mode.",
                  "info"
                )
              }
              style={{
                backgroundImage: coverPreviewUrl
                  ? `url(${coverPreviewUrl})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {!coverPreviewUrl && (
                <img
                  className="img-cover"
                  src={musicPlaceholder}
                  alt="placeholder"
                />
              )}
            </div>
            <div className="playlist-details">
              <div className="playlist-type">Playlist</div>
              <input
                className="playlist-name-input"
                placeholder={playlistName}
                value={playlistName}
                readOnly
                onClick={handleOpenEditModal}
              />
              <input
                className="playlist-description-input"
                placeholder="Add playlist description"
                value={playlistDescription}
                readOnly
                onClick={handleOpenEditModal}
              />
              <div className="playlist-owner-info">By {email || "Unknown"}</div>
            </div>
          </div>

          <div className="playlist-main-content">
            <div className="playlist-controls">
              <button
                className={`play-button ${
                  selectedSongs.length === 0 || !playlistName.trim()
                    ? "disabled"
                    : ""
                }`}
                type="button"
                disabled={selectedSongs.length === 0 || !playlistName.trim()}
                onClick={() => {
                  if (selectedSongs.length > 0) {
                    dispatch(setPlaylist(selectedSongs));
                    dispatch(setCurrentSong(selectedSongs[0]));
                    dispatch(setIsPlaying(true));
                  }
                }}
              >
                <FaPlay />
              </button>

              <div className="songs-count-indicator">
                {selectedSongs.length} song
                {selectedSongs.length !== 1 ? "s" : ""} selected
              </div>
            </div>

            <div className="song-row">
              <MusicTable songsData={selectedSongs} />
            </div>

            <div className="search-section">
              <div className="search-title">
                Let's find something for your playlist
              </div>
              <div className="search-header">
                <div className="search-input-container">
                  <div className="search-icon">
                    <FaSearch />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for songs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            <div className="song-list">
              {filteredSongs.map((song, index) => (
                <div
                  key={
                    song.id ? `${song.id}-${index}` : `song-list-item-${index}`
                  }
                  className="song-list-item"
                  onClick={() => handleSongToggle(song)}
                >
                  <div className="song-index">{index + 1}</div>
                  <div className="song-cover-container">
                    <img
                      src={song.image}
                      alt={song.title}
                      className="song-cover"
                    />
                    <span className="play-icon">
                      <FaPlay />
                    </span>
                  </div>
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <button
                    type="button"
                    className={`add-button ${
                      selectedSongs.some((s) => s.id === song.id) ? "added" : ""
                    } ${isCreatingPlaylist ? "disabled" : ""}`}
                    disabled={isCreatingPlaylist}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSongToggle(song);
                    }}
                  >
                    {isCreatingPlaylist
                      ? "Creating..."
                      : selectedSongs.some((s) => s.id === song.id)
                      ? "Added"
                      : "Add"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      <MusicPlayer />
    </div>
  );
};

export default CreatePlaylistPage;
