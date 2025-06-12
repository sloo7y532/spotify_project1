import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const PLAYLISTS_COLLECTION = "playlists";

export interface Playlist {
  name: string;
  userId: string;
  songs: Array<{
    title?: string;
    artist?: string;
    image?: string;
    audioUrl?: string;
  }>;
  createdAt: Date;
}

export const addPlaylistToFirebase = async (
  playlist: Omit<Playlist, "createdAt">
) => {
  try {
    const playlistWithTimestamp = {
      ...playlist,
      createdAt: new Date(),
    };
    const docRef = await addDoc(
      collection(db, PLAYLISTS_COLLECTION),
      playlistWithTimestamp
    );
    return { id: docRef.id, ...playlistWithTimestamp };
  } catch (error) {
    console.error("Error adding playlist:", error);
    throw error;
  }
};

export const fetchPlaylistsFromFirebase = async (userId: string) => {
  try {
    const q = query(
      collection(db, PLAYLISTS_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const playlists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
};
