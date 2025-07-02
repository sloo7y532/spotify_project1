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
import { useTranslation } from "react-i18next";

/**
 * CreatePlaylistPage Component
 *
 * This component handles both creating new playlists and editing existing ones.
 * It provides functionality to:
 * - Create a new playlist with custom name, description, and cover
 * - Edit existing playlist details
 * - Add/remove songs from playlists
 * - Search and browse available songs
 * - Play selected songs
 *
 * The component supports both create mode (no playlistId) and edit mode (with playlistId)
 */
const CreatePlaylistPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const { showToast } = useToast();

  // =============== STATE MANAGEMENT ===============
  // Playlist metadata state
  const [playlistName, setPlaylistName] = useState("My Playlist #1");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  // Songs and selection state
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);

  // Modal and UI state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingPlaylist, setCurrentEditingPlaylist] =
    useState<PlaylistToEdit | null>(null);

  // Playlist management state
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(
    null
  );
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  // URL parameters and navigation
  const { playlistId } = useParams();
  const navigate = useNavigate();

  // =============== DATA LOADING EFFECTS ===============

  /**
   * Effect: Load existing playlist data when editing
   * Triggers when playlistId changes (from URL params)
   * Fetches playlist details and populates the form
   */
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
          showToast(t("Failed to load playlist. Please try again."), "error");
        }
      }
    };
    loadPlaylistFromBackend();
  }, [playlistId, dispatch, showToast, t]);

  /**
   * Effect: Fetch all available songs from Firebase
   * Loads song library and calculates durations for audio files
   * This provides the song pool for adding to playlists
   */
  useEffect(() => {
    fetch("https://spotify-project-123-default-rtdb.firebaseio.com/songs.json")
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        showToast(t("Songs loaded successfully."), "success");
        return response.json();
      })
      .then((data) => {
        const loadedSongs: Song[] = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // Calculate audio duration for each song
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
      .catch((error) => {
        console.error("Error fetching songs:", error);
        showToast(t("Failed to load songs. Please try again."), "error");
      });
  }, [showToast, t]);

  /**
   * Effect: Update current editing playlist data
   * Keeps the edit modal data in sync with current playlist state
   * Triggers whenever playlist metadata or songs change
   */
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

  /**
   * Effect: Reset music player state when component mounts
   * Ensures clean state when entering playlist creation/editing
   */
  useEffect(() => {
    dispatch(setIsPlaying(false));
    dispatch(setCurrentSong(null));
  }, [dispatch]);

  // =============== PLAYLIST MANAGEMENT FUNCTIONS ===============

  /**
   * Creates a new playlist in Firebase with the first selected song
   * This function is called when user adds their first song to a new playlist
   *
   * @param firstSong - The first song to add to the new playlist
   * @returns Promise<FirebasePlaylistType | null> - The created playlist or null on failure
   */
  const createNewPlaylistAndGetId = async (
    firstSong: Song
  ): Promise<FirebasePlaylistType | null> => {
    if (!user || !playlistName.trim()) {
      showToast(t("Please provide a playlist name."), "error");
      return null;
    }

    if (isCreatingPlaylist) {
      showToast(t("Playlist is being created, please wait..."), "info");
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
        ownerEmail: email || t("Unknown"),
      };

      const newPlaylist = await addPlaylistToFirebase(playlistToSave);
      setCurrentPlaylistId(newPlaylist.id);
      dispatch(setCurrentPlaylist(newPlaylist));
      dispatch(setPlaylist(newPlaylist.songs));
      setSelectedSongs(newPlaylist.songs);
      showToast(
        t("Playlist created successfully!", { name: playlistName }),
        "success"
      );
      navigate(`/create-playlist/${newPlaylist.id}`);
      return newPlaylist;
    } catch (error) {
      console.error("Error creating playlist:", error);
      showToast(t("Failed to create playlist. Please try again."), "error");
      return null;
    } finally {
      setIsCreatingPlaylist(false);
    }
  };

  /**
   * Handles adding/removing songs from the playlist
   * Creates new playlist if none exists, otherwise updates existing playlist
   *
   * @param song - The song to add or remove
   */
  const handleSongToggle = async (song: Song) => {
    // Prevent operations while creating playlist
    if (isCreatingPlaylist) {
      showToast(t("Please wait while playlist is being created..."), "info");
      return;
    }

    let playlistIdToUse = currentPlaylistId;
    const isSelected = selectedSongs.some((s) => s.id === song.id);

    // Create new playlist if none exists
    if (!playlistIdToUse) {
      const newPlaylist = await createNewPlaylistAndGetId(song);
      if (newPlaylist) {
        // Song already added during playlist creation
        return;
      } else {
        showToast(t("Cannot add song, playlist creation failed."), "error");
        return;
      }
    }

    // Handle adding/removing songs from existing playlist
    try {
      if (isSelected) {
        // Remove song from playlist
        await removeSongFromPlaylist(playlistIdToUse, song);
        const newSelectedSongs = selectedSongs.filter((s) => s.id !== song.id);
        setSelectedSongs(newSelectedSongs);
        dispatch(setPlaylist(newSelectedSongs));
        showToast(t("Removed from playlist", { title: song.title }), "info");
      } else {
        // Add song to playlist
        const songWithDate = {
          ...song,
          dateAdded: song.dateAdded || new Date().toISOString(),
        };
        await addSongToPlaylist(playlistIdToUse, songWithDate);
        const newSelectedSongs = [...selectedSongs, songWithDate];
        setSelectedSongs(newSelectedSongs);
        dispatch(setPlaylist(newSelectedSongs));
        showToast(t("Added to playlist", { title: song.title }), "success");
      }
    } catch (error) {
      console.error("Error updating song in playlist:", error);
      showToast(t("Failed to update playlist. Please try again."), "error");
    }
  };

  // =============== UI EVENT HANDLERS ===============

  /**
   * Opens the edit playlist modal
   */
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  /**
   * Handles successful playlist details save from edit modal
   * Updates local state and navigation if needed
   *
   * @param updatedPlaylist - The updated playlist data from modal
   */
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

  /**
   * Handles form submission
   * Provides user feedback about playlist creation process
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentPlaylistId) {
      showToast(
        t(
          "Playlist will be created automatically when you add your first song."
        ),
        "info"
      );
    } else {
      showToast(
        t(
          "Playlist already exists. You can edit details by clicking the name or manage songs below."
        ),
        "info"
      );
    }
  };

  // =============== COMPUTED VALUES ===============

  /**
   * Filter songs based on search input
   * Searches in both title and artist fields
   */
  const filteredSongs = songs?.filter(
    (song) =>
      song.title?.toLowerCase().includes(search.toLowerCase()) ||
      song.artist?.toLowerCase().includes(search.toLowerCase())
  );

  // =============== RENDER ===============
  return (
    <div className="create-playlist-container">
      {/* Edit Playlist Modal */}
      {isEditModalOpen && currentEditingPlaylist && (
        <EditPlaylistModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentPlaylist={currentEditingPlaylist}
          onSaveSuccess={handleSavePlaylistDetails}
        />
      )}

      {/* Sidebar with playlist info and library */}
      <div className="create-playlist-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">{t("Your Library")}</h2>
        </div>

        <div className="playlists-section">
          <h3 className="playlists-section-title">{t("Playlists")}</h3>
        </div>

        <div className="recents-header">
          <span className="recents-title">{t("Recents")}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
          </svg>
        </div>

        {/* Current playlist preview */}
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
            <div className="playlist-meta">
              {t("Playlist")} • {email || t("User")}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="main">
        <form onSubmit={handleSubmit} className="create-playlist-main">
          {/* Playlist header with cover and details */}
          <div className="playlist-header">
            <div
              className={`cover-upload-container ${
                coverPreviewUrl ? "has-image" : ""
              }`}
              onClick={() =>
                showToast(
                  t(
                    "Image upload functionality is no longer available. You can set it manually in edit mode."
                  ),
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
              <div className="playlist-type">{t("Playlist")}</div>
              <input
                className="playlist-name-input"
                placeholder={playlistName}
                value={playlistName}
                readOnly
                onClick={handleOpenEditModal}
              />
              <input
                className="playlist-description-input"
                placeholder={t("Add playlist description")}
                value={playlistDescription}
                readOnly
                onClick={handleOpenEditModal}
              />
              <div className="playlist-owner-info">
                {t("By")} {email || t("Unknown")}
              </div>
            </div>
          </div>

          {/* Playlist controls and content */}
          <div className="playlist-main-content">
            {/* Play button and song count */}
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
                {selectedSongs.length}{" "}
                {selectedSongs.length === 1
                  ? t("song selected")
                  : t("songs selected")}
              </div>
            </div>

            {/* Selected songs table */}
            <div className="song-row">
              <MusicTable songsData={selectedSongs} />
            </div>

            {/* Song search section */}
            <div className="search-section">
              <div className="search-title">
                {t("Let's find something for your playlist")}
              </div>
              <div className="search-header">
                <div className="search-input-container">
                  <div className="search-icon">
                    <FaSearch />
                  </div>
                  <input
                    type="text"
                    placeholder={t("Search for songs...")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            {/* Available songs list */}
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
                      ? t("Creating...")
                      : selectedSongs.some((s) => s.id === song.id)
                        ? t("Added")
                        : t("Add")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Music Player Component */}
      <MusicPlayer />
    </div>
  );
};

export default CreatePlaylistPage;
