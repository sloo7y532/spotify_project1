import { db } from "./firebase.js";
import { Song } from "../store/slices/musicSlice.ts";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export interface NewPlaylist {
  name: string;
  description?: string;
  userId: string;
  songs: Song[];
  coverUrl?: string;
  ownerEmail: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  userId: string;
  ownerEmail: string;
  songs: Song[];
  createdAt?: string;
}

export async function addPlaylistToFirebase(data: NewPlaylist) {
  try {
    console.log("🆕 Creating new playlist with data:", data);

    // Validate required fields
    if (!data.name || data.name.trim() === "") {
      throw new Error("Playlist name is required");
    }
    if (!data.userId || data.userId.trim() === "") {
      throw new Error("User ID is required");
    }
    if (!data.ownerEmail || data.ownerEmail.trim() === "") {
      throw new Error("Owner email is required");
    }

    // Clean the data
    const cleanPlaylistData = {
      name: String(data.name).trim(),
      description: String(data.description || ""),
      userId: String(data.userId).trim(),
      songs: Array.isArray(data.songs) ? data.songs : [],
      ownerEmail: String(data.ownerEmail).trim(),
      coverUrl: String(data.coverUrl || ""),
      createdAt: Timestamp.fromDate(new Date()),
    };

    console.log("🧹 Cleaned playlist data for Firestore:", cleanPlaylistData);

    const docRef = await addDoc(collection(db, "playlists"), cleanPlaylistData);

    const result = {
      id: docRef.id,
      name: cleanPlaylistData.name,
      description: cleanPlaylistData.description,
      userId: cleanPlaylistData.userId,
      songs: cleanPlaylistData.songs,
      ownerEmail: cleanPlaylistData.ownerEmail,
      coverUrl: cleanPlaylistData.coverUrl,
      createdAt: new Date().toISOString(),
    };

    console.log("✅ Playlist created successfully:", result);
    return result;
  } catch (error) {
    console.error("❌ Error creating playlist in Firestore:", error);
    throw error;
  }
}

export async function updatePlaylistInFirebase(
  playlistId: string,
  data: Partial<Playlist>
) {
  try {
    console.log("🔄 Updating playlist:", playlistId);
    console.log("📝 Data to update:", data);

    // Validate the playlistId
    if (!playlistId || playlistId === "new" || playlistId.trim() === "") {
      throw new Error("Invalid playlist ID provided");
    }

    // Clean and validate the data
    const cleanData: any = {};

    if (data.name !== undefined) {
      cleanData.name = String(data.name).trim();
      if (cleanData.name === "") {
        throw new Error("Playlist name cannot be empty");
      }
    }

    if (data.description !== undefined) {
      cleanData.description = String(data.description || "");
    }

    if (data.coverUrl !== undefined) {
      cleanData.coverUrl = String(data.coverUrl || "");
    }

    if (data.songs !== undefined) {
      cleanData.songs = Array.isArray(data.songs) ? data.songs : [];
    }

    // Remove undefined values and non-updatable fields
    Object.keys(cleanData).forEach((key) => {
      if (cleanData[key] === undefined || key === "id" || key === "createdAt") {
        delete cleanData[key];
      }
    });

    console.log("🧹 Cleaned data for Firestore:", cleanData);

    const playlistRef = doc(db, "playlists", playlistId);
    await updateDoc(playlistRef, cleanData);

    console.log("✅ Playlist updated successfully in Firestore");
  } catch (error) {
    console.error("❌ Error updating playlist in Firestore:", error);
    throw error;
  }
}

export async function addSongToPlaylist(playlistId: string, song: Song) {
  const playlistRef = doc(db, "playlists", playlistId);
  const docSnap = await getDoc(playlistRef);

  if (!docSnap.exists()) {
    throw new Error("Playlist not found");
  }

  const data = docSnap.data();
  const originalSongs = data.songs as Song[];

  const songExists = originalSongs.some((s) => s.id === song.id);

  if (!songExists) {
    const songToAdd = {
      ...song,
      dateAdded: song.dateAdded || new Date().toISOString(),
    };

    const updatedSongs = [...originalSongs, songToAdd];

    await updateDoc(playlistRef, { songs: updatedSongs });
  } else {
    console.log("Song already exists in playlist");
  }
}

export async function removeSongFromPlaylist(playlistId: string, song: Song) {
  const playlistRef = doc(db, "playlists", playlistId);
  const docSnap = await getDoc(playlistRef);

  if (!docSnap.exists()) {
    throw new Error("Playlist not found");
  }

  const data = docSnap.data();
  const originalSongs = data.songs as Song[];
  const updatedSongs = originalSongs.filter((s) => s.id !== song.id);

  await updateDoc(playlistRef, { songs: updatedSongs });
}

export async function updatePlaylistSongs(playlistId: string, songs: Song[]) {
  const playlistRef = doc(db, "playlists", playlistId);

  const songsWithDate = songs.map((song) => ({
    ...song,
    dateAdded: song.dateAdded || new Date().toISOString(),
  }));

  await updateDoc(playlistRef, {
    songs: songsWithDate,
  });
}

export async function addMultipleSongsToPlaylist(
  playlistId: string,
  songs: Song[]
) {
  const playlistRef = doc(db, "playlists", playlistId);

  const currentPlaylist = await fetchPlaylistById(playlistId);
  if (!currentPlaylist) {
    throw new Error("Playlist not found");
  }

  const newSongs = songs.filter(
    (song) =>
      !currentPlaylist.songs.some((existingSong) => existingSong.id === song.id)
  );

  if (newSongs.length > 0) {
    const songsWithDate = newSongs.map((song) => ({
      ...song,
      dateAdded: song.dateAdded || new Date().toISOString(),
    }));

    await updateDoc(playlistRef, {
      songs: [...currentPlaylist.songs, ...songsWithDate],
    });
  }

  return newSongs.length;
}

export async function fetchSongsFromFirebase(): Promise<Song[]> {
  const snapshot = await getDocs(collection(db, "songs"));
  const allSongs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Song),
  }));
  console.log("from fire", allSongs);
  return allSongs;
}

export async function fetchPlaylistsByUser(
  userId: string
): Promise<Playlist[]> {
  const q = query(collection(db, "playlists"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "",
      description: data.description || "",
      coverUrl: data.coverUrl || "",
      userId: data.userId || "",
      ownerEmail: data.ownerEmail || "",
      songs: data.songs || [],
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || "",
    };
  });
}

export async function deletePlaylistFromFirebase(playlistId: string) {
  const playlistRef = doc(db, "playlists", playlistId);
  await deleteDoc(playlistRef);
}

export async function fetchPlaylistById(
  playlistId: string
): Promise<Playlist | null> {
  const playlistRef = doc(db, "playlists", playlistId);
  const docSnap = await getDoc(playlistRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name || "",
      description: data.description || "",
      coverUrl: data.coverUrl || "",
      userId: data.userId || "",
      ownerEmail: data.ownerEmail || "",
      songs: data.songs || [],
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || "",
    };
  }
  return null;
}
