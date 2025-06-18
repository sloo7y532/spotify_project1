import React, { useState, useEffect } from 'react';
import { X, Music, Plus, Upload } from 'lucide-react';
import '.././styles/EditPlaylistModal.css'

// Firebase types and mock functions (replace with actual Firebase imports)
interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isPublic: boolean;
  createdAt: Date;
}

// Mock Firebase functions - replace with actual Firebase implementation
const mockFirebaseOperations = {
  savePlaylist: async (playlist: Omit<Playlist, 'id' | 'createdAt'>): Promise<string> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random().toString(36).substr(2, 9);
  },
  
  updatePlaylist: async (id: string, playlist: Partial<Playlist>): Promise<void> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  },
  
  uploadImage: async (file: File): Promise<string> => {
    // Simulate image upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    return URL.createObjectURL(file);
  }
};

const PlaylistEditor: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    isPublic: true
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [currentPlaylistId, setCurrentPlaylistId] = useState<string | null>(null);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: previewUrl
      }));
    }
  };

  // Open modal for creating new playlist
  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      isPublic: true
    });
    setSelectedImage(null);
    setIsEditMode(false);
    setCurrentPlaylistId(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing playlist
  const openEditModal = (playlist: Playlist) => {
    setFormData({
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.imageUrl || '',
      isPublic: playlist.isPublic
    });
    setSelectedImage(null);
    setIsEditMode(true);
    setCurrentPlaylistId(playlist.id);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      isPublic: true
    });
    setSelectedImage(null);
    setCurrentPlaylistId(null);
  };

  // Save playlist
  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a playlist name');
      return;
    }

    setIsLoading(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload image if selected
      if (selectedImage) {
        imageUrl = await mockFirebaseOperations.uploadImage(selectedImage);
      }

      const playlistData = {
        name: formData.name,
        description: formData.description,
        imageUrl,
        isPublic: formData.isPublic
      };

      if (isEditMode && currentPlaylistId) {
        // Update existing playlist
        await mockFirebaseOperations.updatePlaylist(currentPlaylistId, playlistData);
        setPlaylists(prev => prev.map(p => 
          p.id === currentPlaylistId 
            ? { ...p, ...playlistData }
            : p
        ));
      } else {
        // Create new playlist
        const newId = await mockFirebaseOperations.savePlaylist(playlistData);
        const newPlaylist: Playlist = {
          id: newId,
          ...playlistData,
          createdAt: new Date()
        };
        setPlaylists(prev => [...prev, newPlaylist]);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving playlist:', error);
      alert('Failed to save playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#121212',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #282828'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            margin: 0
          }}>Your Library</h1>
          
          <button
            onClick={openCreateModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#1db954',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1ed760';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#1db954';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Plus size={16} />
            Create Playlist
          </button>
        </div>
      </div>

      {/* Playlists Grid */}
      <div style={{
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => openEditModal(playlist)}
              style={{
                backgroundColor: '#181818',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#282828';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#181818';
              }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#333',
                borderRadius: '4px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: playlist.imageUrl ? `url(${playlist.imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                {!playlist.imageUrl && <Music size={48} color="#b3b3b3" />}
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {playlist.name}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#b3b3b3',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {playlist.isPublic ? 'Public Playlist' : 'Private Playlist'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#282828',
            borderRadius: '8px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0,
                color: '#ffffff'
              }}>
                {isEditMode ? 'Edit details' : 'Create playlist'}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b3b3b3',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Image Upload Section */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '180px',
                height: '180px',
                backgroundColor: '#333',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: formData.imageUrl ? `url(${formData.imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                cursor: 'pointer'
              }}>
                {!formData.imageUrl && <Music size={48} color="#b3b3b3" />}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '50%',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Upload size={16} />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                {/* Name Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#ffffff'
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="My Playlist #1"
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#3e3e3e',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#ffffff'
                  }}>
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Add an optional description"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#3e3e3e',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '14px',
                      resize: 'vertical',
                      minHeight: '80px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <p style={{
              fontSize: '11px',
              color: '#b3b3b3',
              marginBottom: '24px',
              lineHeight: '1.4'
            }}>
              By proceeding, you agree to give Spotify access to the image you choose to upload. 
              Please make sure you have the right to upload the image.
            </p>

            {/* Save Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={handleSave}
                disabled={isLoading}
                style={{
                  backgroundColor: '#1db954',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '12px 32px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#1ed760';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = '#1db954';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistEditor;