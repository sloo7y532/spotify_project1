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
import { useTranslation } from "react-i18next";

/**
 * Interface for playlist data used in the edit modal
 * Extends the base playlist structure with optional ID for new playlists
 */
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

/**
 * Props interface for the EditPlaylistModal component
 */
interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlaylist: PlaylistToEdit | null;
  onSaveSuccess: (updatedPlaylist: PlaylistToEdit) => void;
}

/**
 * EditPlaylistModal Component
 *
 * A modal dialog for editing playlist metadata including:
 * - Playlist name and description
 * - Cover image URL
 * - Creating new playlists or updating existing ones
 *
 * Features:
 * - Form validation and error handling
 * - Firebase integration for persistence
 * - Redux state management updates
 * - Image preview functionality
 * - Internationalization support
 * - Loading states and user feedback
 */
const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  onClose,
  currentPlaylist,
  onSaveSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  // =============== LOCAL STATE ===============
  // Loading state for save operations
  const [isLoading, setIsLoading] = useState(false);

  // Form data state for controlled inputs
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverUrl: "",
  });

  // =============== INITIALIZATION EFFECT ===============

  /**
   * Effect: Initialize form data when playlist changes
   * Populates form fields with existing playlist data or resets for new playlists
   */
  useEffect(() => {
    if (currentPlaylist) {
      setFormData({
        name: currentPlaylist.name,
        description: currentPlaylist.description || "",
        coverUrl: currentPlaylist.coverUrl || "",
      });
    } else {
      // Reset form for new playlist
      setFormData({ name: "", description: "", coverUrl: "" });
    }
  }, [currentPlaylist]);

  // Early return if modal is closed
  if (!isOpen) {
    return null;
  }

  // =============== FORM HANDLING ===============

  /**
   * Handles input field changes for controlled form components
   * Updates form data state for all text inputs and textareas
   *
   * @param e - Change event from input or textarea elements
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission and playlist saving
   * Manages both creation of new playlists and updates to existing ones
   * Includes comprehensive error handling and user feedback
   */
  const handleSave = async () => {
    // Validation checks
    if (!currentPlaylist || !currentPlaylist.userId) {
      showToast(
        t("Error: User ID is missing or no playlist to edit."),
        "error"
      );
      return;
    }
    if (!formData.name.trim()) {
      showToast(t("Please enter a playlist name."), "error");
      return;
    }

    setIsLoading(true);

    try {
      // Set default cover URL if none provided
      let finalCoverUrl =
        formData.coverUrl || "https://example.com/default-playlist-cover.png";

      const updatedData: Partial<Playlist> = {
        name: formData.name,
        description: formData.description,
        coverUrl: finalCoverUrl,
      };

      // Handle existing playlist updates vs new playlist creation
      if (currentPlaylist.id && currentPlaylist.id !== "new") {
        try {
          // Check if playlist exists in Firestore before updating
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

            const createdPlaylist =
              await addPlaylistToFirebase(newPlaylistData);

            // Update the playlist ID reference
            currentPlaylist.id = createdPlaylist.id;
          }

          // Prepare updated playlist data for parent component
          const updatedPlaylist: PlaylistToEdit = {
            ...currentPlaylist,
            name: formData.name,
            description: formData.description,
            coverUrl: finalCoverUrl,
          };

          // Update Redux store with new playlist data
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

          // Notify parent component of successful save
          onSaveSuccess(updatedPlaylist);
          showToast(t("Playlist saved to Firestore successfully!"), "success");
        } catch (updateError) {
          console.error("❌ Error during Firestore operation:", updateError);
          showToast(
            t("Failed to save playlist to Firestore. Please try again."),
            "error"
          );
        }
      } else {
        try {
          // Create a completely new playlist
          const newPlaylistData = {
            name: formData.name,
            description: formData.description,
            coverUrl: finalCoverUrl,
            userId: currentPlaylist.userId,
            ownerEmail: currentPlaylist.ownerEmail,
            songs: currentPlaylist.songs || [],
          };

          const createdPlaylist = await addPlaylistToFirebase(newPlaylistData);

          // Prepare response data for parent component
          const updatedPlaylist: PlaylistToEdit = {
            ...currentPlaylist,
            id: createdPlaylist.id,
            name: formData.name,
            description: formData.description,
            coverUrl: finalCoverUrl,
          };

          // Update Redux store with new playlist
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

          // Notify parent component with the new playlist data
          onSaveSuccess(updatedPlaylist);
          showToast(
            t("Playlist created successfully!", { name: formData.name }),
            "success"
          );
        } catch (createError) {
          console.error("❌ Error creating new playlist:", createError);
          showToast(t("Failed to create playlist. Please try again."), "error");
        }
      }

      // Close modal on success
      onClose();
    } catch (error) {
      console.error("❌ Error saving playlist:", error);
      showToast(t("Failed to save playlist. Please try again."), "error");
    } finally {
      setIsLoading(false);
    }
  };

  // =============== RENDER ===============
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal header with title and close button */}
        <div className="modal-header">
          <h2 className="modal-title">{t("Edit details")}</h2>
          <button onClick={onClose} className="modal-close-button">
            <X size={24} />
          </button>
        </div>

        {/* Modal body with form fields */}
        <div className="modal-body">
          <div className="image-upload-section">
            {/* Cover image preview and upload area */}
            <div
              className="image-preview"
              onClick={() => {
                console.log(
                  "Image selection is disabled as Firebase Storage is not used."
                );
                showToast(
                  t(
                    "Image selection functionality is disabled. You can manually enter the URL if provided."
                  ),
                  "info"
                );
              }}
              style={{
                backgroundImage: formData.coverUrl
                  ? `url(${formData.coverUrl})`
                  : "none",
              }}
            >
              {/* Default music icon when no cover image */}
              {!formData.coverUrl && <Music size={48} color="#b3b3b3" />}

              {/* Upload overlay that appears on hover */}
              <div className="upload-icon-overlay">
                <Upload size={16} />
                <span>{t("Choose photo")}</span>
              </div>
            </div>

            {/* Form input fields */}
            <div className="form-fields">
              {/* Playlist name input */}
              <div className="form-group">
                <label htmlFor="playlist-name-modal">{t("Name")}</label>
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

              {/* Playlist description textarea */}
              <div className="form-group">
                <label htmlFor="playlist-description-modal">
                  {t("Description")}
                </label>
                <textarea
                  id="playlist-description-modal"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("Add an optional description")}
                  rows={4}
                  className="textarea-field"
                />
              </div>

              {/* Cover image URL input */}
              <div className="form-group">
                <label htmlFor="playlist-cover-url-modal">
                  {t("Cover Image URL")}
                </label>
                <input
                  type="text"
                  id="playlist-cover-url-modal"
                  name="coverUrl"
                  value={formData.coverUrl}
                  onChange={handleInputChange}
                  placeholder={t(
                    "Enter image URL (e.g., https://example.com/image.jpg)"
                  )}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Privacy notice */}
          <p className="privacy-notice">
            {t(
              "By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image."
            )}
          </p>
        </div>

        {/* Modal footer with save button */}
        <div className="modal-footer">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`save-button ${isLoading ? "disabled" : ""}`}
          >
            {isLoading ? t("Saving...") : t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
