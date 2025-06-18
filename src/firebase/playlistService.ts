// playlistService.ts
import { db, storage } from "./firebase.js";
import { Song } from "../store/slices/musicSlice.ts";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface NewPlaylist {
  name: string;
  description?: string;
  userId: string;
  songs: Song[];
  coverUrl?: string;
  ownerName: string;
}

export async function addPlaylistToFirebase(data: NewPlaylist) {
  const docRef = await addDoc(collection(db, "playlists"), {
    name: data.name,
    description: data.description || "",
    userId: data.userId,
    songs: data.songs,
    ownerName: data.ownerName,
    coverUrl: data.coverUrl || "",
    createdAt: new Date(),
  });

  return {
    id: docRef.id,
    ...data,
    createdAt: new Date(),
  };
}


export async function fetchSongsFromFirebase(): Promise<Song[]> {
  const snapshot = await getDocs(collection(db, "songs"));
  const allSongs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Song),
  }));
  console.log("from fire",allSongs)
  return allSongs;
}

export async function uploadPlaylistImage(
  file: File,
  userId: string
): Promise<string> {
  const uniqueName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `playlist_covers/${userId}/${uniqueName}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function fetchPlaylistsByUser(userId: string) {
  const q = query(collection(db, "playlists"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
