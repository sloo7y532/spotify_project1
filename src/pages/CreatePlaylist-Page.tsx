import React from "react";
import "../styles/CreatePlaylist.css";
// import { FaUserPlus, FaEllipsisH } from 'react-icons/fa';
import musicPlaceholder from "../assets/music-player-removebg.png";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../store/index";
// import { setPlaylist } from "../store/slices/musicSlice.ts";
// import { addPlaylistToFirebase } from "../firebase/playlistService.ts";

// Icons
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const CreatePlaylist = () => {
  // const dispatch = useDispatch();
  // const playlist = useSelector((state: RootState) => state.music.playlist);

  return (
    <div className="playlist-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="sidebar-title">Your Library</p>
          <button className="add-button">
            <AddIcon />
            Create
          </button>
        </div>

        <div className="playlist-section">
          <h3 className="playlist-heading">Playlists</h3>
          <div className="playlist-item-container">
            <div className="playlist-item">
              <img src={musicPlaceholder} alt="music" className="music-icon" />
              <PlayArrowIcon className="play-icon" />
              <div>
                <p className="playlist-name">My Playlist #1</p>
                <p className="playlist-owner">صالح العتيبي • Playlist</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="playlist-header">
          <div className="cover-photo">Choose photo</div>
          <div className="playlist-info">
            <p className="playlist-type">Public Playlist</p>
            <h1 className="playlist-title">My Playlist #1</h1>
            <p className="playlist-user">صالح العتيبي •</p>
          </div>
        </div>

        {/* <div className="playlist-controls">
          <FaUserPlus className="icon" />
          <FaEllipsisH className="icon" />
        </div> */}

        <div className="search-section">
          <h2 className="search-text">
            Let's find something for your playlist
          </h2>
          <input
            type="text"
            placeholder="Search for songs or episodes"
            className="search-input"
          />
        </div>
      </main>
    </div>
  );
};

export default CreatePlaylist;
