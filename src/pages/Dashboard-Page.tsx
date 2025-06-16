import React, { useState, useEffect } from "react";
import "../styles/Dashboard-Page.css";
import ShowSongs from "../components/showSongs.tsx";
import MusicPlayer from "../components/MusicPlayer.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import BrowsePodcasts from "../components/BrowsePodcasts.tsx";
import { useNavigate } from "react-router-dom";
import { setPlaylist } from "../store/slices/musicSlice.ts";
import LoginPromptModal from "../components/LoginPrompt.tsx";
import { fetchSongsFromFirebase } from "../firebase/playlistService.ts";

// Icons
import AddIcon from "@mui/icons-material/Add";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const [isBrowsePodcastsOpen, setIsBrowsePodcastsOpen] = useState(false);
  const dispatch = useDispatch();
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const handleCreatePlaylist = () => {
    // if (!user) {
    //   setIsLoginPromptOpen(true);
    //   return;
    // }
    navigate("/CreatePlaylist-Page");
  };

  const handleBrowsePodcasts = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    setIsBrowsePodcastsOpen(true);
  };

  useEffect(() => {
    const loadPlaylists = async () => {
      if (user) {
        const data = await fetchSongsFromFirebase(user.id);
        dispatch(setPlaylist(data));
      }
    };
    loadPlaylists();
  }, [user, dispatch]);

  return (
    <div className="dashboard-container">
      {isLoginPromptOpen && (
        <LoginPromptModal
          isOpen={isLoginPromptOpen}
          setOpen={setIsLoginPromptOpen}
        />
      )}
      <div className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <p>Your Library</p>
          <div className="dashboard-sidebar-header-icon">
            <AddIcon />
          </div>
        </div>
        <div className="dashboard-sidebar-body">
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
          <div className="dashboard-sidebar-body-item">
            <p className="dashboard-sidebar-body-item-title">
              let's find some podcasts to follow
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
        </div>
      </div>

      {isBrowsePodcastsOpen ? (
        <BrowsePodcasts />
      ) : (
        <div className="dashboard-main-container">
          <div className="dashboard-main-container-header">
            <a href="#" className="dashboard-main-container-header-title">
              Trending songs
            </a>
            <a href="" className="dashboard-main-container-header-see-all">
              See all
            </a>
          </div>
          <div>
            <ShowSongs />
          </div>
        </div>
      )}

      {/* {user && <MusicPlayer />} */}
      <MusicPlayer />
    </div>
  );
}
