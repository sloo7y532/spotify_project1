import { createSlice, PayloadAction } from "@reduxjs/toolkit";
<<<<<<< HEAD
// import { NewPlaylist } from "../../firebase/playlistService.ts";
=======
>>>>>>> 2c1b496cd20fa66e44e3b1461a48d29e98459f87

/**
 * Song Interface
 *
 * Represents a music track with all possible metadata
 * Used throughout the application for song management
 */
export interface Song {
  id?: string; // Unique identifier from Firebase
  title?: string; // Song title
  artist?: string; // Artist name
  image?: string; // Album/song cover image URL
  audioUrl?: string; // Audio file URL for playback
  duration?: number; // Song duration in seconds
  dateAdded?: string; // ISO string of when song was added to playlist
}

/**
 * Music State Interface
 *
 * Defines the structure of the music-related Redux state
 */
interface MusicState {
  currentSong: Song | null; // Currently selected/playing song
  isPlaying: boolean; // Playback state (playing/paused)
  playlist: Song[]; // Current playlist queue
}

/**
 * Initial state for the music slice
 * All values start in a neutral/empty state
 */
const initialState: MusicState = {
  currentSong: null,
  isPlaying: false,
  playlist: [],
};

/**
 * Music Redux Slice
 *
 * Manages global music player state including:
 * - Current song selection
 * - Playback state (playing/paused)
 * - Current playlist queue
 *
 * This slice is used by:
 * - MusicPlayer component for playback controls
 * - Song selection components for updating current song
 * - Playlist components for managing song queues
 */
const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    /**
     * Sets the currently selected song
     *
     * @param state - Current music state
     * @param action - PayloadAction containing the song to set or null to clear
     *
     * Used when:
     * - User clicks on a song to play
     * - Navigating between songs in a playlist
     * - Clearing the current song selection
     */
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },

    /**
     * Updates the playback state
     *
     * @param state - Current music state
     * @param action - PayloadAction containing boolean play state
     *
     * Used when:
     * - User clicks play/pause button
     * - Audio playback starts or stops
     * - Handling audio errors or interruptions
     */
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    /**
     * Replaces the current playlist with a new song array
     *
     * @param state - Current music state
     * @param action - PayloadAction containing array of songs
     *
     * Used when:
     * - Loading a playlist for playback
     * - Updating playlist contents
     * - Creating a new playlist queue
     */
    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      state.playlist = action.payload;
    },
  },
});

// Export action creators for use in components
export const { setCurrentSong, setIsPlaying, setPlaylist } = musicSlice.actions;

// Export reducer for store configuration
export default musicSlice.reducer;
