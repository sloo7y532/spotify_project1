// src/store/slices/playlistSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "./musicSlice";

export interface Playlist {
  id?: string;
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
}

const initialState: PlaylistState = {
  currentPlaylist: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setCurrentPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.currentPlaylist = action.payload;
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
