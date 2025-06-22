import React, { useEffect, useRef, useState } from "react";
import "../styles/MusicPlayer.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import { setIsPlaying } from "../store/slices/musicSlice.ts";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import RepeatIcon from "@mui/icons-material/Repeat";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import DevicesIcon from "@mui/icons-material/Devices";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
//import musicPlaceholder from "../assets/spotify-icon.png";

const MusicPlayer = () => {
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.music
  );
  const dispatch = useDispatch();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current && currentSong?.audioUrl) {
      audioRef.current.load();
      audioRef.current.play();
      dispatch(setIsPlaying(true));
    }
  }, [currentSong, dispatch]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      dispatch(setIsPlaying(false));
    } else {
      audioRef.current.play();
      dispatch(setIsPlaying(true));
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = parseFloat(e.target.value);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60) || "0";
    const seconds = Math.floor(time % 60) || "00";
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => dispatch(setIsPlaying(false))}
      >
        <source src={currentSong?.audioUrl} type="audio/mpeg" />
      </audio>

      {/* Left: Song info */}
      <div className="music-player-left">
        {currentSong?.image ? (
          <img
            src={currentSong?.image}
            alt="cover"
            className="music-player-cover"
          />
        ) : (
          <img
            src={""}
            alt="cover"
            className="music-player-cover"
          />
        )}
        <div>
          <p className="music-player-title">
            {currentSong?.title || "No Song"}
          </p>
          <p className="music-player-artist">
            {currentSong?.artist || "Unknown"}
          </p>
        </div>
        <button className="music-player-add-btn">+</button>
      </div>

      {/* Center: Controls */}
      <div className="music-player-center">
        <div className="music-player-controls">
          <ShuffleIcon />
          <SkipPreviousIcon />
          <button onClick={togglePlayPause} className="music-player-play-btn">
            {isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </button>
          <SkipNextIcon />
          <RepeatIcon />
        </div>
        <div className="music-player-progress">
          <span>{formatTime(currentTime)}</span>
          <div className="music-player-progress-bar-container">
            <div
              className="music-player-progress-bar-fill"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <input
              type="range"
              value={currentTime}
              max={duration || 0}
              onChange={handleSeek}
              className="music-player-progress-bar"
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & More */}
      <div className="music-player-right">
        <QueueMusicIcon />
        <DevicesIcon />
        {isMuted ? (
          <VolumeOffIcon
            onClick={toggleMute}
            className="music-player-volume-icon"
          />
        ) : (
          <VolumeUpIcon
            onClick={toggleMute}
            className="music-player-volume-icon"
          />
        )}
        <div className="music-player-volume-container">
          <div
            className="music-player-volume-fill"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="music-player-volume-bar"
          />
        </div>
        <FullscreenIcon />
      </div>
    </div>
  );
};

export default MusicPlayer;
