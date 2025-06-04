import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Song {
  title?: string;
  artist?: string;
  image?: string;
  audioUrl?: string;
}

interface MusicState {
  currentSong: Song | null;
  isPlaying: boolean;
}

const initialState: MusicState = {
  currentSong: null,
  isPlaying: false,
};

const musicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
  },
});

export const { setCurrentSong, setIsPlaying } = musicSlice.actions;
export default musicSlice.reducer;
