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
  // arrayUnion,
  // arrayRemove,
} from "firebase/firestore";

/**
 * Interface for creating a new playlist
 * Contains all required fields for playlist creation
 */
export interface NewPlaylist {
  name: string;
  description?: string;
  userId: string;
  songs: Song[];
  coverUrl?: string;
  ownerEmail: string;
}

/**
 * Interface for existing playlist data
 * Includes the Firestore document ID along with playlist data
 */
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

/**
 * Creates a new playlist in Firestore
 *
 * @param data - NewPlaylist object containing playlist information
 * @returns Promise<Playlist> - The created playlist with Firestore ID
 * @throws Error if validation fails or Firestore operation fails
 *
 * Features:
 * - Input validation for required fields
 * - Data sanitization for Firestore compatibility
 * - Automatic timestamp generation
 * - Comprehensive error logging
 */
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

    // Clean and prepare data for Firestore
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

    // Add document to Firestore
    const docRef = await addDoc(collection(db, "playlists"), cleanPlaylistData);

    // Format response for application use
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

/**
 * Updates an existing playlist in Firestore
 *
 * @param playlistId - The Firestore document ID of the playlist to update
 * @param data - Partial playlist data to update
 * @throws Error if playlistId is invalid or update fails
 *
 * Features:
 * - Validates playlist ID format
 * - Sanitizes update data
 * - Prevents updating immutable fields (id, createdAt)
 * - Comprehensive error handling
 */
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

    // Clean and validate the update data
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

    // Update the document in Firestore
    const playlistRef = doc(db, "playlists", playlistId);
    await updateDoc(playlistRef, cleanData);

    console.log("✅ Playlist updated successfully in Firestore");
  } catch (error) {
    console.error("❌ Error updating playlist in Firestore:", error);
    throw error;
  }
}

/**
 * Adds a single song to an existing playlist
 *
 * @param playlistId - The Firestore document ID of the playlist
 * @param song - The song object to add to the playlist
 * @throws Error if playlist not found or song addition fails
 *
 * Features:
 * - Prevents duplicate songs in playlist
 * - Adds timestamp when song was added
 * - Maintains existing playlist structure
 */
export async function addSongToPlaylist(playlistId: string, song: Song) {
  const playlistRef = doc(db, "playlists", playlistId);
  const docSnap = await getDoc(playlistRef);

  if (!docSnap.exists()) {
    throw new Error("Playlist not found");
  }

  const data = docSnap.data();
  const originalSongs = data.songs as Song[];

  // Check if song already exists in playlist
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

/**
 * Removes a song from an existing playlist
 *
 * @param playlistId - The Firestore document ID of the playlist
 * @param song - The song object to remove from the playlist
 * @throws Error if playlist not found
 *
 * Features:
 * - Filters out song by ID match
 * - Maintains order of remaining songs
 * - Safe operation if song doesn't exist
 */
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

/**
 * Replaces all songs in a playlist with a new song array
 *
 * @param playlistId - The Firestore document ID of the playlist
 * @param songs - Array of songs to replace existing songs
 *
 * Features:
 * - Adds dateAdded timestamp to songs without one
 * - Completely replaces existing song list
 * - Useful for reordering or bulk updates
 */
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

/**
 * Adds multiple songs to a playlist in a single operation
 *
 * @param playlistId - The Firestore document ID of the playlist
 * @param songs - Array of songs to add to the playlist
 * @returns Promise<number> - Number of songs actually added (excludes duplicates)
 * @throws Error if playlist not found
 *
 * Features:
 * - Efficient bulk song addition
 * - Automatic duplicate detection
 * - Returns count of newly added songs
 * - Preserves existing songs in playlist
 */
export async function addMultipleSongsToPlaylist(
  playlistId: string,
  songs: Song[]
) {
  const playlistRef = doc(db, "playlists", playlistId);

  // Get current playlist to check for duplicates
  const currentPlaylist = await fetchPlaylistById(playlistId);
  if (!currentPlaylist) {
    throw new Error("Playlist not found");
  }

  // Filter out songs that already exist in the playlist
  const newSongs = songs.filter(
    (song) =>
      !currentPlaylist.songs.some((existingSong) => existingSong.id === song.id)
  );

  // Add only new songs
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

/**
 * Fetches all songs from the Firebase Realtime Database
 *
 * @returns Promise<Song[]> - Array of all available songs
 *
 * Note: This function uses Firebase Realtime Database instead of Firestore
 * for the songs collection, which is why it has a different implementation
 */
export async function fetchSongsFromFirebase(): Promise<Song[]> {
  const snapshot = await getDocs(collection(db, "songs"));
  const allSongs = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Song),
  }));
  console.log("from fire", allSongs);
  return allSongs;
}

/**
 * Fetches all playlists belonging to a specific user
 *
 * @param userId - The user ID to fetch playlists for
 * @returns Promise<Playlist[]> - Array of user's playlists
 *
 * Features:
 * - Queries by userId for efficient filtering
 * - Converts Firestore timestamps to ISO strings
 * - Handles missing fields gracefully
 * - Returns empty array if no playlists found
 */
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

/**
 * Deletes a playlist from Firestore
 *
 * @param playlistId - The Firestore document ID of the playlist to delete
 *
 * Features:
 * - Permanent deletion operation
 * - No recovery possible after deletion
 * - Should be used with user confirmation
 */
export async function deletePlaylistFromFirebase(playlistId: string) {
  const playlistRef = doc(db, "playlists", playlistId);
  await deleteDoc(playlistRef);
}

/**
 * Fetches a single playlist by its ID
 *
 * @param playlistId - The Firestore document ID of the playlist
 * @returns Promise<Playlist | null> - The playlist data or null if not found
 *
 * Features:
 * - Safe handling of non-existent playlists
 * - Converts Firestore timestamps to ISO strings
 * - Returns null instead of throwing error for missing playlist
 * - Comprehensive data transformation
 */
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
