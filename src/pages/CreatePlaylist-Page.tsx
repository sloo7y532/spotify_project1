// src/pages/CreatePlaylist-Page.tsx
import React, { useEffect, useState, useRef, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import { Music, Upload } from "lucide-react";
import musicPlaceholder from "../assets/music-player.png";
import "../styles/CreatePlaylist.css";

import EditPlaylistModal, { PlaylistToEdit } from "../components/EditPlaylistModal.tsx";
import { addPlaylistToFirebase, uploadPlaylistImage, PlaylistWithId, updatePlaylistInFirebase, NewPlaylist } from "../firebase/playlistService.ts";
import { setCurrentPlaylist, addPlaylist as addPlaylistToStore, updatePlaylist as updatePlaylistInStore } from "../store/slices/playlistSlice.ts";

export default function CreatePlaylistPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const currentPlaylist = useSelector((state: RootState) => state.playlist.currentPlaylist);
  const dispatch = useDispatch();

<<<<<<< HEAD
  useEffect(() => {
    fetch("https://spotify-project-123-default-rtdb.firebaseio.com/songs.json")
      .then((response) => response.json())
      .then((data) => setSongs(data));
  }, []);
=======
  const fileInputRef = useRef<HTMLInputElement>(null);
>>>>>>> c3af3ea65a5dd423bc3efec5da6fef81ea802aaa

  const [playlistName, setPlaylistName] = useState("My Playlist #1");
  const [playlistDescription, setPlaylistDescription] = useState("Add an optional description");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState(musicPlaceholder);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState<PlaylistToEdit | null>(null);

  const handleCreateOrSavePlaylist = async () => {
    if (!user) {
      alert("الرجاء تسجيل الدخول لإنشاء قائمة تشغيل.");
      return;
    }
    if (!playlistName.trim()) {
      alert("الرجاء إدخال اسم لقائمة التشغيل.");
      return;
    }

    // *** التعديل هنا: التأكد من أن ownerEmail هو string
    const ownerEmail = user.email || "unknown@example.com"; // توفير قيمة افتراضية إذا كان user.email هو null

    setIsLoading(true);
    let finalCoverUrl = musicPlaceholder;

    try {
      if (coverImageFile) {
        finalCoverUrl = await uploadPlaylistImage(coverImageFile, user.id);
      } else if (currentPlaylist && currentPlaylist.coverUrl) {
        finalCoverUrl = currentPlaylist.coverUrl;
      }

      if (!currentPlaylist || !currentPlaylist.id) {
        const newPlaylistData: NewPlaylist = {
          name: playlistName,
          description: playlistDescription,
          userId: user.id,
          songs: [],
          coverUrl: finalCoverUrl,
          ownerEmail: ownerEmail, // *** استخدام المتغير الجديد ownerEmail
        };

        const addedPlaylist = await addPlaylistToFirebase(newPlaylistData);
        dispatch(setCurrentPlaylist(addedPlaylist));
        dispatch(addPlaylistToStore(addedPlaylist));
        alert("تم إنشاء قائمة التشغيل بنجاح!");
      } else {
        const updatedData: Partial<NewPlaylist> = {
            name: playlistName,
            description: playlistDescription,
            coverUrl: finalCoverUrl
        };
        await updatePlaylistInFirebase(currentPlaylist.id, updatedData);
        const updatedPlaylistWithId: PlaylistWithId = { ...currentPlaylist, ...updatedData };
        dispatch(setCurrentPlaylist(updatedPlaylistWithId));
        dispatch(updatePlaylistInStore(updatedPlaylistWithId));
        alert("تم تحديث قائمة التشغيل بنجاح!");
      }

    } catch (error) {
      console.error("خطأ في إنشاء/تحديث قائمة التشغيل:", error);
      alert("فشل إنشاء/تحديث قائمة التشغيل. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setCoverImageUrl(URL.createObjectURL(file));
    }
  };

  const openEditModal = () => {
    if (!user) {
      alert("الرجاء تسجيل الدخول لتعديل قائمة التشغيل.");
      return;
    }
    // *** التعديل هنا أيضًا: التأكد من أن ownerEmail هو string عند تهيئة playlistToEdit
    const ownerEmailForModal = user.email || "unknown@example.com";

    if (currentPlaylist) {
      setPlaylistToEdit(currentPlaylist as PlaylistToEdit);
      setIsEditModalOpen(true);
    } else {
        setPlaylistToEdit({
            id: 'new-playlist-temp-id',
            name: playlistName,
            description: playlistDescription,
            coverUrl: coverImageUrl,
            userId: user.id,
            ownerEmail: ownerEmailForModal, // *** استخدام المتغير الجديد ownerEmailForModal
            songs: []
        });
        setIsEditModalOpen(true);
    }
  };

  const handleModalSaveSuccess = (updatedPlaylist: PlaylistToEdit) => {
    setPlaylistName(updatedPlaylist.name);
    setPlaylistDescription(updatedPlaylist.description || "");
    setCoverImageUrl(updatedPlaylist.coverUrl || musicPlaceholder);
    setCoverImageFile(null);
  };

  useEffect(() => {
    //
  }, []);

  return (
    <div className="create-playlist-page">
      <div className="create-playlist-header">
        <div className="playlist-info-section" onClick={openEditModal}>
          <div className="playlist-cover-placeholder">
            {coverImageUrl === musicPlaceholder ? (
              <Music size={80} color="#b3b3b3" />
            ) : (
              <img src={coverImageUrl} alt="Playlist Cover" className="playlist-cover-image" />
            )}
            <div className="upload-icon-overlay-circle">
                <Upload size={24} color="white" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
          <div className="playlist-text-info">
            <p className="playlist-type">PLAYLIST</p>
            <h1 className="playlist-title">{playlistName}</h1>
            <p className="playlist-description">{playlistDescription}</p>
            <p className="playlist-owner">
              {user?.displayName || "Your Name"} • 0 songs
            </p>
          </div>
        </div>
      </div>

      <div className="playlist-actions">
        <button onClick={handleCreateOrSavePlaylist} disabled={isLoading} className="save-button">
          {isLoading ? "Saving..." : "Save Playlist"}
        </button>
      </div>

      <div className="playlist-songs-section">
        {/* هنا يمكنك عرض الأغاني إذا كانت قائمة التشغيل تحتوي على أغاني */}
        {/* <p>No songs yet. Add some!</p> */}
      </div>

      <EditPlaylistModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentPlaylist={playlistToEdit}
        onSaveSuccess={handleModalSaveSuccess}
      />
    </div>
  );
}