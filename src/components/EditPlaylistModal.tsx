// src/components/EditPlaylistModal.tsx
import React, { useState, useEffect, ChangeEvent, useRef } from 'react'; // إضافة useRef
import { X, Music, Upload } from 'lucide-react';
import { useAppDispatch } from '../store/hooks.ts';
import { uploadPlaylistImage, updatePlaylistInFirebase } from '../firebase/playlistService.ts';
import { setCurrentPlaylist, updatePlaylist as updatePlaylistInStore, Playlist } from '../store/slices/playlistSlice.ts';
import { Song } from '../store/slices/musicSlice.ts';
import '../styles/EditPlaylistModal.css';

export interface PlaylistToEdit {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  userId: string;
  ownerEmail: string;
  songs?: Song[];
  createdAt?: Date;
}

interface EditPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlaylist: PlaylistToEdit | null;
  onSaveSuccess: (updatedPlaylist: PlaylistToEdit) => void;
}

const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({ isOpen, onClose, currentPlaylist, onSaveSuccess }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverUrl: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    if (currentPlaylist) {
      setFormData({
        name: currentPlaylist.name,
        description: currentPlaylist.description || '',
        coverUrl: currentPlaylist.coverUrl || '',
      });
      setSelectedImage(null);
    } else {
      setFormData({ name: '', description: '', coverUrl: '' });
      setSelectedImage(null);
    }
  }, [currentPlaylist]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        coverUrl: previewUrl
      }));
    }
  };

  const handleSave = async () => {
    if (!currentPlaylist) {
      alert('لا توجد قائمة تشغيل لتعديلها.');
      return;
    }
    if (!formData.name.trim()) {
      alert('الرجاء إدخال اسم لقائمة التشغيل.');
      return;
    }

    setIsLoading(true);

    try {
      let finalCoverUrl = formData.coverUrl;

      if (selectedImage) {
        if (!currentPlaylist.userId) {
            console.error("User ID is missing for image upload.");
            alert("خطأ: معرف المستخدم مفقود لرفع الصورة.");
            setIsLoading(false);
            return;
        }
        finalCoverUrl = await uploadPlaylistImage(selectedImage, currentPlaylist.userId);
      }

      const updatedData: Partial<PlaylistToEdit> = {
        name: formData.name,
        description: formData.description,
        coverUrl: finalCoverUrl,
      };

      await updatePlaylistInFirebase(currentPlaylist.id, updatedData);

      const playlistForRedux: Playlist = {
        id: currentPlaylist.id,
        name: formData.name,
        description: formData.description || undefined,
        coverUrl: finalCoverUrl,
        userId: currentPlaylist.userId,
        ownerEmail: currentPlaylist.ownerEmail,
        songs: currentPlaylist.songs || [],
        createdAt: currentPlaylist.createdAt || new Date(),
      };

      dispatch(setCurrentPlaylist(playlistForRedux));
      dispatch(updatePlaylistInStore(playlistForRedux));

      const updatedPlaylistForCallback: PlaylistToEdit = {
          ...playlistForRedux,
      };

      onSaveSuccess(updatedPlaylistForCallback);
      onClose();
    } catch (error) {
      console.error('خطأ في حفظ قائمة التشغيل:', error);
      alert('فشل حفظ قائمة التشغيل. يرجى المحاولة مرة أخرى.');
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
            {/* منطقة معاينة الصورة وتحميلها */}
            <div
              className="image-preview"
              onClick={() => fileInputRef.current?.click()} 
              style={{
                backgroundImage: formData.coverUrl ? `url(${formData.coverUrl})` : 'none',
              }}
            >
              {!formData.coverUrl && <Music size={48} color="#b3b3b3" />}
              <input
                type="file"
                ref={fileInputRef} 
                accept="image/*"
                onChange={handleImageSelect}
                className="image-file-input"
                style={{ display: 'none' }} 
              />
              <div className="upload-icon-overlay">
                <Upload size={16} />
                <span>Choose photo</span> {/* إضافة نص لأيقونة الرفع */}
              </div>
            </div>

            {/* حقول النموذج */}
            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="playlist-name-modal">Name</label> {/* معرف فريد */}
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
                <label htmlFor="playlist-description-modal">Description</label> {/* معرف فريد */}
                <textarea
                  id="playlist-description-modal" // معرف فريد
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add an optional description"
                  rows={4}
                  className="textarea-field"
                />
              </div>
            </div>
          </div>

          <p className="privacy-notice">
            By proceeding, you agree to give Spotify access to the image you choose to upload.
            Please make sure you have the right to upload the image.
          </p>
        </div>

        <div className="modal-footer">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`save-button ${isLoading ? 'disabled' : ''}`}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;