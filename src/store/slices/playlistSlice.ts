import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Song } from "./musicSlice";

export interface Playlist {
  id?: string;
  name: string;
  description?: string;
  coverUrl?: string;
  songs: Song[];
  userId: string;
  ownerName: string;
  createdAt?: any;
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
  },
});

export const { setCurrentPlaylist, clearCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
