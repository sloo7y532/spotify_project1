// src/firebase/playlistService.ts
import { db, storage } from "./firebase.js"; // تأكد من أن المسار صحيح و ".js" صحيح إذا كان ملفك "firebase.js"
import { Song } from "../store/slices/musicSlice.ts";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc, // *** NEW: Import updateDoc for updating documents
  doc,       // *** NEW: Import doc for referencing specific documents
  getDoc,    // *** NEW: Import getDoc for fetching single document
  arrayUnion, // *** NEW: Import arrayUnion for adding to arrays
  arrayRemove, // *** NEW: Import arrayRemove for removing from arrays
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// **تحديث NewPlaylist لتشمل كل الحقول الضرورية وتغيير ownerName إلى ownerEmail**
export interface NewPlaylist {
  name: string;
  description?: string;
  userId: string;
  songs: Song[];
  coverUrl?: string;
  ownerEmail: string; // *** CHANGED: from ownerName to ownerEmail for consistency
  createdAt?: Date; // لضمان وجودها عند إنشاء بلاي ليست جديدة
}

// **إضافة واجهة لـ PlaylistWithId - مهم جداً للمودال الجديد**
// هذه الواجهة تمثل قائمة تشغيل تم جلبها من Firebase (تحتوي على ID)
export interface PlaylistWithId extends NewPlaylist {
    id: string; // لأن Firebase Firestore يضيف ID بعد الإنشاء
}

// Export PlaylistWithId as Playlist for backward compatibility
export type Playlist = PlaylistWithId;

export async function addPlaylistToFirebase(data: NewPlaylist): Promise<PlaylistWithId> {
  const docRef = await addDoc(collection(db, "playlists"), {
    name: data.name,
    description: data.description || "",
    userId: data.userId,
    songs: data.songs,
    ownerEmail: data.ownerEmail, // *** CHANGED: using ownerEmail
    coverUrl: data.coverUrl || "",
    createdAt: new Date(), // تعيين تاريخ الإنشاء هنا
  });

  return {
    id: docRef.id,
    ...data,
    createdAt: new Date(), // إعادة createdAt ليكون كاملاً
  };
}

// **NEW FUNCTION: دالة جديدة لتحديث قائمة تشغيل موجودة في Firebase**
export async function updatePlaylistInFirebase(
  playlistId: string,
  updatedData: Partial<NewPlaylist> // نستخدم Partial للسماح بتحديث جزء من البيانات
): Promise<void> {
  const playlistRef = doc(db, "playlists", playlistId); // الحصول على مرجع المستند
  await updateDoc(playlistRef, updatedData); // تحديث المستند
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
  userId: string // نحتاج userId لتحديد مسار التخزين
): Promise<string> {
  const uniqueName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `playlist_covers/${userId}/${uniqueName}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function fetchPlaylistsByUser(userId: string): Promise<PlaylistWithId[]> {
  const q = query(collection(db, "playlists"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as NewPlaylist), // Cast to NewPlaylist, then add ID
  })) as PlaylistWithId[]; // Cast the entire array to PlaylistWithId[]
}

// *** NEW FUNCTION: Fetch playlist by ID
export async function fetchPlaylistById(playlistId: string): Promise<PlaylistWithId | null> {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    const playlistDoc = await getDoc(playlistRef);
    
    if (playlistDoc.exists()) {
      return {
        id: playlistDoc.id,
        ...(playlistDoc.data() as NewPlaylist),
      } as PlaylistWithId;
    }
    return null;
  } catch (error) {
    console.error("Error fetching playlist by ID:", error);
    return null;
  }
}

// *** NEW FUNCTION: Add song to playlist
export async function addSongToPlaylist(playlistId: string, song: Song): Promise<void> {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    await updateDoc(playlistRef, {
      songs: arrayUnion(song)
    });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    throw error;
  }
}

// *** NEW FUNCTION: Remove song from playlist
export async function removeSongFromPlaylist(playlistId: string, song: Song): Promise<void> {
  try {
    const playlistRef = doc(db, "playlists", playlistId);
    await updateDoc(playlistRef, {
      songs: arrayRemove(song)
    });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    throw error;
  }
}