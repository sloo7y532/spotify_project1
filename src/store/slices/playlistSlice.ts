// src/store/slices/playlistSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "./musicSlice";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  songs: Song[];
  userId: string;
  ownerEmail: string;
  createdAt?: string;
}

interface PlaylistState {
  currentPlaylist: Playlist | null;
  loading: boolean;
  error: string | null;
  userPlaylists: Playlist[];
}

const initialState: PlaylistState = {
  currentPlaylist: null,
  loading: false,
  error: null,
  userPlaylists: [],
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setCurrentPlaylist(state, action: PayloadAction<Playlist | null>) {
      state.currentPlaylist = action.payload;
      state.error = null;
    },
    setUserPlaylists(state, action: PayloadAction<Playlist[]>) {
      state.userPlaylists = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPlaylist(state, action: PayloadAction<Playlist>) {
      state.userPlaylists.push(action.payload);
    },
    updatePlaylist(state, action: PayloadAction<Playlist>) {
      const index = state.userPlaylists.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.userPlaylists[index] = action.payload;
      }
      if (state.currentPlaylist?.id === action.payload.id) {
        state.currentPlaylist = action.payload;
      }
    },
    deletePlaylist(state, action: PayloadAction<string>) {
      state.userPlaylists = state.userPlaylists.filter(p => p.id !== action.payload);
      if (state.currentPlaylist?.id === action.payload) {
        state.currentPlaylist = null;
      }
    },
    playlistLoading(state) {
      state.loading = true;
      state.error = null;
    },
    playlistError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      if (
        state.currentPlaylist &&
        state.currentPlaylist.id === action.payload.id
      ) {
        state.currentPlaylist = action.payload;
      }
    },
  },
});

export const { setCurrentPlaylist, clearCurrentPlaylist, updatePlaylist } =
  playlistSlice.actions;
export default playlistSlice.reducer;
