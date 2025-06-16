// store/slices/playlistSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

interface PlaylistState {
  playlists: Playlist[];
}

const initialState: PlaylistState = {
  playlists: [],
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      const index = state.playlists.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.playlists[index] = action.payload;
      }
    },
  },
});

export const { updatePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
