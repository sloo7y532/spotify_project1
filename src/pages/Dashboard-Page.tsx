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
import { setIsPlaying, setCurrentSong } from "../store/slices/musicSlice.ts";
import Footer from "../components/Footer.tsx";
import { useTranslation } from "react-i18next";

// Icons
import AddIcon from "@mui/icons-material/Add";
import { useToast } from "../context/ToastContext.tsx";

/**
 * Playlist interface for dashboard display
 * Contains essential playlist information for rendering in the sidebar
 */
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

/**
 * Dashboard Page Component
 *
 * Main landing page that displays:
 * - User's personal playlist library in sidebar
 * - Trending songs in main content area
 * - Quick actions for creating playlists and browsing podcasts
 * - Login prompts for unauthenticated users
 *
 * Features:
 * - Playlist management (create, view, delete)
 * - Music discovery through trending songs
 * - Responsive design with mobile support
 * - Search functionality integration
 */
export default function DashboardPage({ searchTerm = "" }) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  // =============== STATE MANAGEMENT ===============
  // Modal state for unauthenticated users
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  // User playlist management state
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [errorPlaylists, setErrorPlaylists] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { showToast } = useToast();

  // =============== INITIALIZATION EFFECTS ===============

  /**
   * Effect: Reset music player state when dashboard loads
   * Ensures clean state when user navigates to dashboard
   */
  useEffect(() => {
    dispatch(setIsPlaying(false));
    dispatch(setCurrentSong(null));
  }, [dispatch]);

  /**
   * Effect: Load user's playlists when user changes
   * Fetches all playlists belonging to the authenticated user
   * Handles loading states and error management
   */
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
          setErrorPlaylists(t("Failed to load your playlists."));
        } finally {
          setLoadingPlaylists(false);
        }
      } else {
        // Clear playlists for unauthenticated users
        setUserPlaylists([]);
        setLoadingPlaylists(false);
      }
    };
    loadUserPlaylists();
  }, [user?.id, t]);

  // =============== NAVIGATION HANDLERS ===============

  /**
   * Handles playlist creation navigation
   * Shows login prompt for unauthenticated users
   */
  const handleCreatePlaylist = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    navigate("/create-playlist");
  };

  /**
   * Handles podcast browsing navigation
   * Shows login prompt for unauthenticated users
   */
  const handleBrowsePodcasts = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    navigate("/browse-podcasts");
  };

  // =============== RENDER ===============
  return (
    <div className="dashboard-container">
      {/* Login prompt modal for unauthenticated users */}
      {isLoginPromptOpen && (
        <LoginPromptModal
          isOpen={isLoginPromptOpen}
          setOpen={setIsLoginPromptOpen}
        />
      )}

      <div className="dashboard-content">
        {/* Sidebar with user library and playlists */}
        <div className="dashboard-sidebar">
          {/* Sidebar header with library title and add button */}
          <div className="dashboard-sidebar-header">
            <p>{t("Your Library")}</p>
            <div className="dashboard-sidebar-header-icon">
              <div onClick={handleCreatePlaylist} style={{ cursor: "pointer" }}>
                <AddIcon />
              </div>
            </div>
          </div>

          {/* Sidebar content based on user authentication status */}
          <div className="dashboard-sidebar-body">
            {user ? (
              // User is logged in
              <div className="user-playlists-section">
                {loadingPlaylists ? (
                  <p className="loading-message">
                    {t("Loading your playlists...")}
                  </p>
                ) : errorPlaylists ? (
                  <p className="error-message">{errorPlaylists}</p>
                ) : userPlaylists.length === 0 ? (
                  // Logged in user with no playlists: show both create playlist and browse podcasts
                  <>
                    <div className="dashboard-sidebar-body-item">
                      <p className="dashboard-sidebar-body-item-title">
                        {t("Create your first playlist")}
                      </p>
                      <p className="dashboard-sidebar-body-item-description">
                        {t("It's easy, we'll help you")}
                      </p>
                      <button
                        className="dashboard-sidebar-body-item-button"
                        onClick={handleCreatePlaylist}
                      >
                        {t("Create playlist")}
                      </button>
                    </div>
                    <div className="dashboard-sidebar-body-item">
                      <p className="dashboard-sidebar-body-item-title">
                        {t("Let's find some podcasts to follow")}
                      </p>
                      <p className="dashboard-sidebar-body-item-description">
                        {t("We'll keep you updated on new episodes")}
                      </p>
                      <button
                        className="dashboard-sidebar-body-item-button"
                        onClick={handleBrowsePodcasts}
                      >
                        {t("Browse podcasts")}
                      </button>
                    </div>
                  </>
                ) : (
                  // Logged in user with playlists: show only playlists
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
                          // Handle playlist deletion with confirmation
                          const confirmed = window.confirm(
                            `${t("Delete playlist")} '${playlist.name}'? ${t("This cannot be undone.")}`
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
                              showToast(
                                t(
                                  "Failed to delete playlist. Please try again."
                                )
                              );
                            }
                          }
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Playlist cover thumbnail */}
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
                        {/* Playlist information */}
                        <div className="playlist-info">
                          <div className="playlist-name">{playlist.name}</div>
                          <div className="playlist-meta">
                            {playlist.ownerEmail || user?.email || t("Unknown")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in: show both create playlist and browse podcasts
              <>
                <div className="dashboard-sidebar-body-item">
                  <p className="dashboard-sidebar-body-item-title">
                    {t("Create your first playlist")}
                  </p>
                  <p className="dashboard-sidebar-body-item-description">
                    {t("It's easy, we'll help you")}
                  </p>
                  <button
                    className="dashboard-sidebar-body-item-button"
                    onClick={handleCreatePlaylist}
                  >
                    {t("Create playlist")}
                  </button>
                </div>
                <div className="dashboard-sidebar-body-item">
                  <p className="dashboard-sidebar-body-item-title">
                    {t("Let's find some podcasts to follow")}
                  </p>
                  <p className="dashboard-sidebar-body-item-description">
                    {t("We'll keep you updated on new episodes")}
                  </p>
                  <button
                    className="dashboard-sidebar-body-item-button"
                    onClick={handleBrowsePodcasts}
                  >
                    {t("Browse podcasts")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main content area with trending songs */}
        <div className="dashboard-main-container">
          {/* Main content header */}
          <div className="dashboard-main-container-header">
            <p className="dashboard-main-container-header-title">
              {t("Trending songs")}
            </p>
            <p className="dashboard-main-container-header-see-all">
              {t("See all")}
            </p>
          </div>

          {/* Songs display component with search functionality */}
          <div>
            <ShowSongs searchTerm={searchTerm} />
          </div>
        </div>
      </div>

      {/* Music player for authenticated users */}
      {user && <MusicPlayer />}

      {/* Page footer */}
      <Footer />
    </div>
  );
}
