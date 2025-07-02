import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "./musicSlice";

/**
 * Interface representing a playlist object
 */
export interface Playlist {
  id: string; // Unique identifier for the playlist
  name: string; // Display name of the playlist
  description?: string; // Optional description text
  coverUrl?: string; // Optional URL for playlist cover image
  songs: Song[]; // Array of songs in the playlist
  userId: string; // ID of the user who owns the playlist
  ownerEmail: string; // Email of the playlist owner
  createdAt?: string; // Optional creation timestamp
}

/**
 * Interface defining the shape of the playlist state
 */
interface PlaylistState {
  currentPlaylist: Playlist | null; // Currently selected/active playlist
  loading: boolean; // Loading state for async operations
  error: string | null; // Error message if any operation fails
  userPlaylists: Playlist[]; // Array of all user's playlists
}

/**
 * Initial state for the playlist slice
 */
const initialState: PlaylistState = {
  currentPlaylist: null,
  loading: false,
  error: null,
  userPlaylists: [],
};

/**
 * Redux slice for managing playlist state and operations
 */
const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    /**
     * Sets the currently active playlist
     * @param state - Current playlist state
     * @param action - Action containing the playlist to set as current
     */
    setCurrentPlaylist(state, action: PayloadAction<Playlist | null>) {
      state.currentPlaylist = action.payload;
      state.error = null; // Clear any previous errors
    },

    /**
     * Sets the user's playlists array and updates loading state
     * @param state - Current playlist state
     * @param action - Action containing array of user playlists
     */
    setUserPlaylists(state, action: PayloadAction<Playlist[]>) {
      state.userPlaylists = action.payload;
      state.loading = false; // Operation completed
      state.error = null; // Clear any previous errors
    },

    /**
     * Adds a new playlist to the user's playlist collection
     * @param state - Current playlist state
     * @param action - Action containing the new playlist to add
     */
    addPlaylist(state, action: PayloadAction<Playlist>) {
      state.userPlaylists.push(action.payload);
    },

    /**
     * Updates an existing playlist in both userPlaylists array and currentPlaylist if applicable
     * @param state - Current playlist state
     * @param action - Action containing the updated playlist data
     */
    updatePlaylist(state, action: PayloadAction<Playlist>) {
      // Find and update playlist in userPlaylists array
      const index = state.userPlaylists.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.userPlaylists[index] = action.payload;
      }

      // Update currentPlaylist if it's the same playlist being updated
      if (state.currentPlaylist?.id === action.payload.id) {
        state.currentPlaylist = action.payload;
      }
    },

    /**
     * Removes a playlist from the user's collection
     * @param state - Current playlist state
     * @param action - Action containing the ID of the playlist to delete
     */
    deletePlaylist(state, action: PayloadAction<string>) {
      // Remove playlist from userPlaylists array
      state.userPlaylists = state.userPlaylists.filter(
        (p) => p.id !== action.payload
      );

      // Clear currentPlaylist if it's the one being deleted
      if (state.currentPlaylist?.id === action.payload) {
        state.currentPlaylist = null;
      }
    },

    /**
     * Sets loading state to true for async playlist operations
     * @param state - Current playlist state
     */
    playlistLoading(state) {
      state.loading = true;
      state.error = null; // Clear any previous errors
    },

    /**
     * Sets an error message and stops loading state
     * @param state - Current playlist state
     * @param action - Action containing the error message
     */
    playlistError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export specific actions that are used in other parts of the application
export const { setCurrentPlaylist, updatePlaylist } = playlistSlice.actions;

// Export the reducer to be used in the store configuration
export default playlistSlice.reducer;
