import React, { useState } from "react";
import "../styles/Dashboard-Page.css";
import ShowSongs from "../components/showSongs.tsx";
import MusicPlayer from "../components/MusicPlayer.tsx";

// Icons
import AddIcon from "@mui/icons-material/Add";

export default function DashboardPage() {
  // const [signin, setSignin] = useState(false);
  return (
    <div className="dashboard-container">
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
            <button className="dashboard-sidebar-body-item-button">
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
            <button className="dashboard-sidebar-body-item-button">
              Browse podcasts
            </button>
          </div>
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
          <ShowSongs />
        </div>
      </div>
      <MusicPlayer />
    </div>
  );
}
