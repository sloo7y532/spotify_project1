import React from "react";
import "../styles/MusicTable.css";
import { Song } from "../store/slices/musicSlice";

interface MusicTableProps {
  songsData: Song[];
}

const MusicTable: React.FC<MusicTableProps> = ({ songsData }) => {
  const formatDuration = (duration?: number) => {
    if (!duration && duration !== 0) return "--:--";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "--";
    return date.toLocaleString();
  };

  return (
    <div className="music-table-container">
      <div className="music-table-header">
        <div className="header-item header-hash">#</div>
        <div className="header-item header-title">Title</div>
        <div className="header-item header-date-added">Date added</div>
        <div className="header-item header-duration">
          <svg className="clock-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm.9 15h-1.8V9h1.8v8zM12 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
            />
          </svg>
        </div>
      </div>
      <div className="music-table-body">
        {songsData.length > 0 ? (
          songsData.map((song: Song, index) => (
            <div
              className="music-table-row"
              key={song.id ? `${song.id}-${index}` : `row-${index}`}
            >
              <div className="row-item row-hash">{index + 1}</div>
              <div className="row-item row-title">
                <img
                  src={song.image}
                  alt="thumbnail"
                  className="song-thumbnail"
                />
                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
              </div>
              <div className="row-item row-date-added">
                {formatDate(song.dateAdded)}
              </div>
              <div className="row-item row-duration">
                {formatDuration(song.duration)}
              </div>
            </div>
          ))
        ) : (
          <div className="no-songs-message">
            No songs added to the playlist yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicTable;
