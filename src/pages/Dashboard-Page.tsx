// src/pages/Dashboard-Page.tsx
import React, { useState, useEffect } from "react";
import "../styles/Dashboard-Page.css";
import ShowSongs from "../components/showSongs.tsx";
import MusicPlayer from "../components/MusicPlayer.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import { useNavigate } from "react-router-dom";
import LoginPromptModal from "../components/LoginPrompt.tsx";
import {
  fetchPlaylistsByUser,
  deletePlaylistFromFirebase,
} from "../firebase/playlistService.ts";
import { Link } from "react-router-dom";
import { setIsPlaying, setCurrentSong } from "../store/slices/musicSlice.ts";

// Icons
import AddIcon from "@mui/icons-material/Add";

interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  userId: string;
  ownerEmail: string;
  songs: any[];
  createdAt: Date;
}

export default function DashboardPage({ searchTerm = "" }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [errorPlaylists, setErrorPlaylists] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Stop playback and clear current song when visiting the page
  useEffect(() => {
    dispatch(setIsPlaying(false));
    dispatch(setCurrentSong(null));
  }, [dispatch]);

  const handleCreatePlaylist = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    navigate("/create-playlist");
  };

  const handleBrowsePodcasts = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    navigate("/browse-podcasts");
  };

  useEffect(() => {
    const loadUserPlaylists = async () => {
      if (user?.id) {
        setLoadingPlaylists(true);
        setErrorPlaylists(null);
        try {
          const data = await fetchPlaylistsByUser(user.id);
          setUserPlaylists(data as unknown as Playlist[]);
        } catch (error) {
          console.error("Error fetching user playlists:", error);
          setErrorPlaylists("Failed to load your playlists.");
        } finally {
          setLoadingPlaylists(false);
        }
      } else {
        setUserPlaylists([]);
        setLoadingPlaylists(false);
      }
    };
    loadUserPlaylists();
  }, [user?.id]);

  return (
    <div className="dashboard-container">
      {isLoginPromptOpen && (
        <LoginPromptModal isOpen={isLoginPromptOpen} setOpen={setIsLoginPromptOpen} />
      )}
      <div className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <p>Your Library</p>
          <div className="dashboard-sidebar-header-icon">
            <Link to="/create-playlist">
              <AddIcon />
            </Link>
          </div>
        </div>
        <div className="dashboard-sidebar-body">
          {user && (
            <div className="user-playlists-section">
              {loadingPlaylists ? (
                <p className="loading-message">Loading your playlists...</p>
              ) : errorPlaylists ? (
                <p className="error-message">{errorPlaylists}</p>
              ) : userPlaylists.length === 0 ? (
                <div className="dashboard-sidebar-body-item">
                  <p className="dashboard-sidebar-body-item-title">
                    Create your first playlist
                  </p>
                  <p className="dashboard-sidebar-body-item-description">
                    It's easy, we'll help you
                  </p>
                  <button
                    className="dashboard-sidebar-body-item-button"
                    onClick={handleCreatePlaylist}
                  >
                    Create playlist
                  </button>
                </div>
              ) : (
                <div className="user-playlists-list">
                  {userPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="user-playlist-item"
                      onClick={() =>
                        navigate(`/create-playlist/${playlist.id}`)
                      }
                      onContextMenu={async (e) => {
                        e.preventDefault();
                        const confirmed = window.confirm(
                          `Delete playlist '${playlist.name}'? This cannot be undone.`
                        );
                        if (confirmed) {
                          try {
                            await deletePlaylistFromFirebase(playlist.id);
                            setUserPlaylists((prev) =>
                              prev.filter((p) => p.id !== playlist.id)
                            );
                            // Clear localStorage for deleted playlist
                            if (
                              localStorage.getItem("playlistName") ||
                              localStorage.getItem("selectedSongs")
                            ) {
                              localStorage.removeItem("playlistName");
                              localStorage.removeItem("playlistDescription");
                              localStorage.removeItem("coverPreviewUrl");
                              localStorage.removeItem("selectedSongs");
                            }
                          } catch (err) {
                            alert(
                              "Failed to delete playlist. Please try again."
                            );
                          }
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="playlist-cover-thumb">
                        {playlist.coverUrl ? (
                          <img src={playlist.coverUrl} alt={playlist.name} />
                        ) : (
                          <div className="playlist-default-icon">
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="playlist-info">
                        <div className="playlist-name">{playlist.name}</div>
                        <div className="playlist-meta">
                          {playlist.ownerEmail || user?.email || "Unknown"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {userPlaylists.length === 0 && (
            <div className="dashboard-sidebar-body-item">
              <p className="dashboard-sidebar-body-item-title">
                Let's find some podcasts to follow
              </p>
              <p className="dashboard-sidebar-body-item-description">
                We'll keep you updated on new episodes
              </p>
              <button
                className="dashboard-sidebar-body-item-button"
                onClick={handleBrowsePodcasts}
              >
                Browse podcasts
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="dashboard-main-container">
        <div className="dashboard-main-container-header">
          <a href="#" className="dashboard-main-container-header-title">
            Trending songs
          </a>
          <a href="#" className="dashboard-main-container-header-see-all">
            See all
          </a>
        </div>
        <div>
          <ShowSongs searchTerm={searchTerm} />
        </div>
      </div>

      {user && <MusicPlayer />}
    </div>
  );
}