import React from 'react';
import { Link } from 'react-router-dom';
import AddIcon from "@mui/icons-material/Add";
import "../styles/Dashboard-Page.css";



export default function BrowsePodcastsPage() {
  return (
    <div><div className="dashboard-sidebar">
    <div className="dashboard-sidebar-header">
      <p>Your Library</p>
      <div className="dashboard-sidebar-header-icon">
        <Link to="./create-playlist">
          <AddIcon />
        </Link>
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
        {/* <button
          className="dashboard-sidebar-body-item-button"
          onClick={handleCreatePlaylist}
        >
          Create playlist
        </button> */}
      </div>
      <div className="dashboard-sidebar-body-item">
        <p className="dashboard-sidebar-body-item-title">
          let's find some podcasts to follow
        </p>
        <p className="dashboard-sidebar-body-item-description">
          We'll keep you updated on new episodes
        </p>
        {/* <button
          className="dashboard-sidebar-body-item-button"
          onClick={handleBrowsePodcasts}
        >
          Browse podcasts
        </button> */}
      </div>
    </div>
  </div></div>
  )
}
