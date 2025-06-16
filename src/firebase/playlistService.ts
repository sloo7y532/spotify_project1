import { db, storage } from "./firebase.js";
import { Song } from "../store/slices/musicSlice.ts";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface NewPlaylist {
  name: string;
  description?: string;
  userId: string;
  songs: Song[];
  coverUrl?: string;
}

export async function addPlaylistToFirebase(data: NewPlaylist) {
  const docRef = await addDoc(collection(db, "playlists"), {
    name: data.name,
    description: data.description || "",
    userId: data.userId,
    songs: data.songs,
    coverUrl: data.coverUrl || "",
    createdAt: new Date(),
  });
  return docRef.id;
}

export async function fetchSongsFromFirebase(
  queryText: string
): Promise<Song[]> {
  const songsCol = collection(db, "songs");
  const q = query(
    songsCol,
    where("keywords", "array-contains", queryText.toLowerCase())
  );
  const snapshot = await getDocs(q);
  if (!queryText.trim()) return [];

  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Song) }));
}

export async function uploadPlaylistImage(
  file: File,
  userId: string
): Promise<string> {
  const storageRef = ref(storage, `playlist_covers/${userId}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
