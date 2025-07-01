import React, { useEffect, useRef, useState } from "react";
import "../styles/MusicPlayer.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import { setIsPlaying, setCurrentSong } from "../store/slices/musicSlice.ts";
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
import musicPlaceholder from "../assets/music-player.png";
import { useTranslation } from "react-i18next";

/**
 * MusicPlayer Component
 *
 * A comprehensive music player that provides:
 * - Audio playback controls (play, pause, skip)
 * - Progress tracking and seeking
 * - Volume control with mute functionality
 * - Current song information display
 * - Integration with Redux state management
 *
 * Features:
 * - Real-time audio progress tracking
 * - Volume persistence and mute state
 * - Responsive design with mobile support
 * - Internationalization support
 * - Error handling for audio playback
 */
const MusicPlayer = () => {
  const { t } = useTranslation();

  // =============== REDUX STATE ===============
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.music
  );
  const dispatch = useDispatch();

  // =============== LOCAL STATE ===============
  // Audio element reference for direct manipulation
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio progress and timing state
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Volume control state
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // =============== AUDIO MANAGEMENT EFFECTS ===============

  /**
   * Effect: Manage audio playback based on Redux state
   * Handles song changes, play/pause state, and error recovery
   *
   * Dependencies: currentSong, isPlaying
   */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong?.audioUrl) {
      // Load new song if URL has changed
      if (audio.src !== currentSong.audioUrl) {
        audio.src = currentSong.audioUrl;
        audio.load();
      }

      // Handle play/pause based on Redux state
      if (isPlaying) {
        audio.play().catch((err) => {
          // Handle audio play errors gracefully
          if (err.name !== "AbortError") {
            console.warn("Audio play interrupted:", err);
          }
        });
      } else {
        audio.pause();
      }
    } else {
      // Clear audio when no song is selected
      audio.pause();
      audio.src = "";
    }
  }, [currentSong, isPlaying]);

  // =============== PLAYBACK CONTROL FUNCTIONS ===============

  /**
   * Toggles between play and pause states
   * Updates Redux state and handles audio element directly
   */
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      dispatch(setIsPlaying(false));
    } else {
      audioRef.current
        .play()
        .then(() => dispatch(setIsPlaying(true)))
        .catch((err) => {
          // Handle play errors gracefully
          if (err.name !== "AbortError") {
            console.warn("Play interrupted:", err);
          }
        });
    }
  };

  /**
   * Audio event handler for time updates
   * Updates current time and duration state for progress tracking
   */
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // =============== VOLUME CONTROL FUNCTIONS ===============

  /**
   * Handles volume slider changes
   * Updates both local state and audio element volume
   *
   * @param e - Change event from volume input slider
   */
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  /**
   * Toggles mute state without changing volume level
   * Preserves volume setting for when unmuted
   */
  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // =============== SEEK CONTROL FUNCTIONS ===============

  /**
   * Handles seeking to specific time position
   * Updates audio currentTime based on progress bar interaction
   *
   * @param e - Change event from progress input slider
   */
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = parseFloat(e.target.value);
  };

  // =============== UTILITY FUNCTIONS ===============

  /**
   * Formats time in seconds to MM:SS format
   * Handles invalid/missing time values gracefully
   *
   * @param time - Time in seconds
   * @returns Formatted time string (MM:SS)
   */
  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // =============== RENDER ===============
  return (
    <div className="music-player">
      {/* Hidden audio element for actual playback */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          // Reset player state when song ends
          dispatch(setIsPlaying(false));
          dispatch(setCurrentSong(null));
        }}
      />

      {/* Left section: Current song information */}
      <div className="music-player-left">
        {/* Song cover image */}
        {currentSong?.image ? (
          <img
            src={currentSong.image}
            alt="cover"
            className="music-player-cover"
          />
        ) : (
          <img
            src={musicPlaceholder}
            alt="cover"
            className="music-player-cover"
          />
        )}

        {/* Song title and artist information */}
        <div>
          <p className="music-player-title">
            {currentSong?.title || t("No Song")}
          </p>
          <p className="music-player-artist">
            {currentSong?.artist || t("Unknown")}
          </p>
        </div>

        {/* Add to playlist button (placeholder) */}
        <button className="music-player-add-btn">+</button>
      </div>

      {/* Center section: Playback controls and progress */}
      <div className="music-player-center">
        {/* Control buttons row */}
        <div className="music-player-controls">
          <ShuffleIcon />
          <SkipPreviousIcon  className="skipPreviousIcon"/>
          <button onClick={togglePlayPause} className="music-player-play-btn">
            {isPlaying ? (
              <PauseIcon fontSize="large" />
            ) : (
              <PlayArrowIcon fontSize="large" />
            )}
          </button>
          <SkipNextIcon className="skipNextIcon" />
          <RepeatIcon />
        </div>

        {/* Progress bar and time display */}
        <div className="music-player-progress">
          <span>{formatTime(currentTime)}</span>
          <div className="music-player-progress-bar-container">
            {/* Visual progress indicator */}
            <div
              className="music-player-progress-bar-fill"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {/* Interactive progress slider */}
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

      {/* Right section: Volume control and additional features */}
      <div className="music-player-right">
        {/* Additional feature icons */}
        <QueueMusicIcon />
        <DevicesIcon />

        {/* Volume control */}
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

        {/* Volume slider */}
        <div className="music-player-volume-container">
          {/* Visual volume level indicator */}
          <div
            className="music-player-volume-fill"
            style={{ width: `${volume * 100}%` }}
          />
          {/* Interactive volume slider */}
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

        {/* Fullscreen mode button */}
        <FullscreenIcon />
      </div>
    </div>
  );
};

export default MusicPlayer;
