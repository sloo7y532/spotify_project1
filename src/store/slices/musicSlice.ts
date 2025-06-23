import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import {NewPlaylist} from '../../firebase/playlistService.ts'
export interface Song {
  id?: string;
  title?: string;
  artist?: string;
  image?: string;
  audioUrl?: string;
  playlistName?: string;
  userId?: string;
  createdAt?: Date;
}
// const filteredSongs= songs?.filter((song => song?.title?.includes(searchquery)))

interface MusicState {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
}

const initialState: MusicState = {
  currentSong: null,
  isPlaying: false,
  playlist: [],
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
    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      state.playlist = action.payload;
    },
  },
});

export const { setCurrentSong, setIsPlaying, setPlaylist } = musicSlice.actions;
export default musicSlice.reducer;
