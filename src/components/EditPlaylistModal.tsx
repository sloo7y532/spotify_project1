import React, { useState, useEffect } from "react";
import { X, Music, Upload } from "lucide-react";
import { useAppDispatch } from "../store/hooks.ts";
import {
  updatePlaylistInFirebase,
  fetchPlaylistById,
  addPlaylistToFirebase,
} from "../firebase/playlistService.ts";
import {
  setCurrentPlaylist,
  updatePlaylist as updatePlaylistInStore,
  Playlist,
} from "../store/slices/playlistSlice.ts";
import { Song } from "../store/slices/musicSlice.ts";
import "../styles/EditPlaylistModal.css";
import { useToast } from "../context/ToastContext.tsx";

export interface PlaylistToEdit {
  id?: string;
  name: string;
  description?: string;
  coverUrl?: string;
  userId: string;
  ownerEmail: string;
  songs?: Song[];
  createdAt?: string;
}

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlaylist: PlaylistToEdit | null;
  onSaveSuccess: (updatedPlaylist: PlaylistToEdit) => void;
}

const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  onClose,
  currentPlaylist,
  onSaveSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast(); // <-- نستخدم الـ toast هنا
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverUrl: "",
  });

  useEffect(() => {
    if (currentPlaylist) {
      setFormData({
        name: currentPlaylist.name,
        description: currentPlaylist.description || "",
        coverUrl: currentPlaylist.coverUrl || "",
      });
    } else {
      setFormData({ name: "", description: "", coverUrl: "" });
    }
  }, [currentPlaylist]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentPlaylist || !currentPlaylist.userId) {
      showToast("Error: User ID is missing or no playlist to edit.", "error");
      return;
    }
    if (!formData.name.trim()) {
      showToast("Please enter a playlist name.", "error");
      return;
    }

    setIsLoading(true);

    try {
      let finalCoverUrl =
        formData.coverUrl || "https://example.com/default-playlist-cover.png";

      const updatedData: Partial<Playlist> = {
        name: formData.name,
        description: formData.description,
        coverUrl: finalCoverUrl,
      };

      // Save playlist details to Firestore
      if (currentPlaylist.id && currentPlaylist.id !== "new") {
        try {
          // First check if the playlist exists in Firestore
          const existingPlaylist = await fetchPlaylistById(currentPlaylist.id);

          if (existingPlaylist) {
            // Update existing playlist in Firestore
            await updatePlaylistInFirebase(currentPlaylist.id, updatedData);
          } else {
            // Playlist doesn't exist in Firestore, create it
            const newPlaylistData = {
              name: formData.name,
              description: formData.description,
              coverUrl: finalCoverUrl,
              userId: currentPlaylist.userId,
              ownerEmail: currentPlaylist.ownerEmail,
              songs: currentPlaylist.songs || [],
            };

            const createdPlaylist = await addPlaylistToFirebase(
              newPlaylistData
            );

            // Update the currentPlaylist ID
            currentPlaylist.id = createdPlaylist.id;
          }

          const updatedPlaylist: PlaylistToEdit = {
            ...currentPlaylist,
            name: formData.name,
            description: formData.description,
            coverUrl: finalCoverUrl,
          };

          // Update Redux store
          const playlistForRedux: Playlist = {
            id: currentPlaylist.id,
            name: formData.name,
            description: formData.description || undefined,
            coverUrl: finalCoverUrl,
            userId: currentPlaylist.userId,
            ownerEmail: currentPlaylist.ownerEmail,
            songs: currentPlaylist.songs || [],
            createdAt: currentPlaylist.createdAt || new Date().toISOString(),
          };

          dispatch(setCurrentPlaylist(playlistForRedux));
          dispatch(updatePlaylistInStore(playlistForRedux));

          // Notify parent component
          onSaveSuccess(updatedPlaylist);
          showToast("Playlist saved to Firestore successfully!", "success");
        } catch (updateError) {
          console.error("❌ Error during Firestore operation:", updateError);
          showToast(
            "Failed to save playlist to Firestore. Please try again.",
            "error"
          );
        }
      } else {
        try {
          // Create a new playlist
          const newPlaylistData = {
            name: formData.name,
            description: formData.description,
            coverUrl: finalCoverUrl,
            userId: currentPlaylist.userId,
            ownerEmail: currentPlaylist.ownerEmail,
            songs: currentPlaylist.songs || [],
          };

          const createdPlaylist = await addPlaylistToFirebase(newPlaylistData);

          const updatedPlaylist: PlaylistToEdit = {
            ...currentPlaylist,
            id: createdPlaylist.id,
            name: formData.name,
            description: formData.description,
            coverUrl: finalCoverUrl,
          };

          // Update Redux store
          const playlistForRedux: Playlist = {
            id: createdPlaylist.id,
            name: formData.name,
            description: formData.description || undefined,
            coverUrl: finalCoverUrl,
            userId: currentPlaylist.userId,
            ownerEmail: currentPlaylist.ownerEmail,
            songs: currentPlaylist.songs || [],
            createdAt: createdPlaylist.createdAt || new Date().toISOString(),
          };

          dispatch(setCurrentPlaylist(playlistForRedux));

          // Notify parent component with the new playlist
          onSaveSuccess(updatedPlaylist);
          showToast(
            `Playlist "${formData.name}" created successfully!`,
            "success"
          );
        } catch (createError) {
          console.error("❌ Error creating new playlist:", createError);
          showToast("Failed to create playlist. Please try again.", "error");
        }
      }

      onClose();
    } catch (error) {
      console.error("❌ Error saving playlist:", error);
      showToast("Failed to save playlist. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit details</h2>
          <button onClick={onClose} className="modal-close-button">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="image-upload-section">
            <div
              className="image-preview"
              onClick={() => {
                console.log(
                  "Image selection is disabled as Firebase Storage is not used."
                );
                showToast(
                  "Image selection functionality is disabled. You can manually enter the URL if provided.",
                  "info"
                );
              }}
              style={{
                backgroundImage: formData.coverUrl
                  ? `url(${formData.coverUrl})`
                  : "none",
              }}
            >
              {!formData.coverUrl && <Music size={48} color="#b3b3b3" />}
              <div className="upload-icon-overlay">
                <Upload size={16} />
                <span>Choose photo</span>
              </div>
            </div>

            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="playlist-name-modal">Name</label>
                <input
                  type="text"
                  id="playlist-name-modal"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="My Playlist #1"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="playlist-description-modal">Description</label>
                <textarea
                  id="playlist-description-modal"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add an optional description"
                  rows={4}
                  className="textarea-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="playlist-cover-url-modal">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="playlist-cover-url-modal"
                  name="coverUrl"
                  value={formData.coverUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <p className="privacy-notice">
            By proceeding, you agree to give Spotify access to the image you
            choose to upload. Please make sure you have the right to upload the
            image.
          </p>
        </div>

        <div className="modal-footer">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`save-button ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
