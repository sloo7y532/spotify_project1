// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../store/index.ts";
// import {
//   addPlaylistToFirebase,
//   fetchSongsFromFirebase,
//   uploadPlaylistImage,
// } from "../firebase/playlistService.ts";
// import { Song } from "../store/slices/musicSlice.ts";
// import "../styles/CreatePlaylist.css";

// // Icons (you can replace with your preferred icons)
// const PlusIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
//   </svg>
// );
// const SearchIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
//   </svg>
// );
// const PhotoIcon = () => (
//   <svg
//     width="80"
//     height="80"
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     opacity="0.7"
//   >
//     <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
//   </svg>
// );
// const DotsIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
//   </svg>
// );
// const ListIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
//   </svg>
// );
// const CloseIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//     <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
//   </svg>
// );

// export default function CreatePlaylistPage() {
//   const user = useSelector((state: RootState) => state.auth.user);
//   const dispatch = useDispatch();

//   const [playlistName, setPlaylistName] = useState("My Playlist #1");
//   const [playlistDesc, setPlaylistDesc] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<Song[]>([]);
//   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
//   const [coverFile, setCoverFile] = useState<File | null>(null);
//   const [coverPreview, setCoverPreview] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Search with debounce
//   // try {
//   //   const songs = await fetchSongsFromFirebase(searchQuery.trim());
//   //   setSearchResults(songs);
//   // } catch (error) {
//   //   console.error("Search failed:", error);
//   //   setSearchResults([]);
//   // } finally {
//   //   setIsSearching(false);
//   // }
//   useEffect(() => {
//     const delayDebounce = setTimeout(async () => {
//       if (searchQuery.trim()) {
//         setIsSearching(true);
//       } else {
//         setSearchResults([]);
//         setIsSearching(false);
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [searchQuery]);

//   const handleCoverClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCoverFile(file);
//       const reader = new FileReader();
//       reader.onload = () => {
//         setCoverPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddSong = (song: Song) => {
//     if (!selectedSongs.find((s) => s.id === song.id)) {
//       setSelectedSongs((prev) => [...prev, song]);
//     }
//   };

//   const handleRemoveSong = (songId: string) => {
//     setSelectedSongs((prev) => prev.filter((s) => s.id !== songId));
//   };

//   const handleSavePlaylist = async () => {
//     if (!user || !playlistName.trim()) return;

//     setIsSaving(true);
//     try {
//       let coverUrl: string | undefined;
//       if (coverFile) {
//         coverUrl = await uploadPlaylistImage(coverFile, user.id);
//       }

//       const newPlaylist = {
//         name: playlistName,
//         description: playlistDesc,
//         userId: user.id,
//         songs: selectedSongs,
//         coverUrl,
//       };

//       await addPlaylistToFirebase(newPlaylist);

//       // Reset form
//       setPlaylistName("My Playlist #1");
//       setPlaylistDesc("");
//       setSelectedSongs([]);
//       setCoverFile(null);
//       setCoverPreview(null);
//       setSearchQuery("");
//       setSearchResults([]);

//       alert("Playlist created successfully!");
//     } catch (error) {
//       console.error("Failed to create playlist:", error);
//       alert("Failed to create playlist. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="create-playlist-container">
//       {/* Sidebar */}
//       <div className="create-playlist-sidebar">
//         {/* Header */}
//         <div className="sidebar-header">
//           <h2 className="sidebar-title">Your Library</h2>
//         </div>

//         {/* Playlists Section */}
//         <div className="playlists-section">
//           <h3 className="playlists-section-title">Playlists</h3>
//         </div>

//         {/* Current Playlist */}
//         <div className="current-playlist-item">
//           <div
//             className="playlist-cover-thumb"
//             style={{
//               backgroundImage: coverPreview ? `url(${coverPreview})` : "none",
//             }}
//           >
//             {!coverPreview && (
//               <svg width="24" height="24" viewBox="0 0 24 24">
//                 <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
//               </svg>
//             )}
//           </div>
//           <div className="playlist-info">
//             <div className="playlist-name">{playlistName}</div>
//             <div className="playlist-meta">
//               Playlist • {user?.email || "User"}
//             </div>
//           </div>
//         </div>

//         {/* Recents */}
//         <div className="recents-header">
//           <span className="recents-title">Recents</span>
//           <ListIcon />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="create-playlist-main">
//         {/* Header Section */}
//         <div className="playlist-header">
//           {/* Cover Image */}
//           <div
//             onClick={handleCoverClick}
//             className={`cover-upload-container ${
//               coverPreview ? "has-image" : ""
//             }`}
//             style={{
//               backgroundImage: coverPreview ? `url(${coverPreview})` : "none",
//             }}
//           >
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleCoverChange}
//               className="cover-file-input"
//             />
//             {!coverPreview && (
//               <div className="cover-placeholder">
//                 <PhotoIcon />
//                 <span className="cover-placeholder-text">Choose photo</span>
//               </div>
//             )}
//             {coverPreview && (
//               <div className="cover-overlay">
//                 <PhotoIcon />
//                 <span className="cover-placeholder-text">Choose photo</span>
//               </div>
//             )}
//           </div>

//           {/* Playlist Info */}
//           <div className="playlist-details">
//             <div className="playlist-type">Public Playlist</div>

//             <input
//               type="text"
//               value={playlistName}
//               onChange={(e) => setPlaylistName(e.target.value)}
//               className="playlist-name-input"
//             />

//             <input
//               type="text"
//               value={playlistDesc}
//               onChange={(e) => setPlaylistDesc(e.target.value)}
//               placeholder="Add a description"
//               className="playlist-description-input"
//             />

//             <div className="playlist-owner-info">
//               {user?.email || "User"} • {selectedSongs.length} songs
//             </div>
//           </div>
//         </div>
//         {/* Controls */}
//         <div className="playlist-controls">
//           <button
//             onClick={handleSavePlaylist}
//             disabled={isSaving || !playlistName.trim()}
//             className={`play-button ${
//               isSaving || !playlistName.trim() ? "disabled" : "enabled"
//             }`}
//           >
//             {isSaving ? "..." : "▶"}
//           </button>

//           <button className="more-options-button">
//             <DotsIcon />
//           </button>

//           <div className="controls-right">
//             <span className="list-view-text">List</span>
//             <ListIcon />
//           </div>
//         </div>
//         {/* Search Section */}
//         <div className="search-section">
//           <h3 className="search-title">
//             Let's find something for your playlist
//           </h3>

//           <div className="search-input-container">
//             <div className="search-icon">
//               <SearchIcon />
//             </div>
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search for songs or episodes"
//               className="search-input"
//             />
//           </div>
//         </div>
//         <button>{isSaving ? "..." : "▶"}</button>
//         <button
//           style={{
//             background: "none",
//             border: "none",
//             color: "#b3b3b3",
//             cursor: "pointer",
//             padding: "8px",
//           }}
//         >
//           <DotsIcon />
//         </button>
//         <div
//           style={{
//             marginLeft: "auto",
//             display: "flex",
//             alignItems: "center",
//             gap: "16px",
//           }}
//         >
//           <span style={{ fontSize: "14px", color: "#b3b3b3" }}>List</span>
//           <ListIcon />
//         </div>
//         {/* Search Results */}
//         <div
//           style={{
//             flex: 1,
//             padding: "0 32px 32px",
//             overflowY: "auto",
//           }}
//         >
//           {isSearching && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "40px",
//                 color: "#b3b3b3",
//               }}
//             >
//               Searching...
//             </div>
//           )}

//           {!isSearching && searchQuery && searchResults.length === 0 && (
//             <div
//               style={{
//                 textAlign: "center",
//                 padding: "40px",
//                 color: "#b3b3b3",
//               }}
//             >
//               No results found for "{searchQuery}"
//             </div>
//           )}

//           {searchResults.length > 0 && (
//             <div>
//               {searchResults.map((song, index) => {
//                 const isAdded = selectedSongs.some((s) => s.id === song.id);
//                 return (
//                   <div
//                     key={song.id}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "16px",
//                       padding: "8px",
//                       borderRadius: "4px",
//                       cursor: "pointer",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.backgroundColor = "#1a1a1a";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.backgroundColor = "transparent";
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "16px",
//                         textAlign: "center",
//                         color: "#b3b3b3",
//                         fontSize: "14px",
//                       }}
//                     >
//                       {index + 1}
//                     </div>

//                     <img
//                       src={song.image || "/default-cover.png"}
//                       alt={song.title}
//                       style={{
//                         width: "40px",
//                         height: "40px",
//                         borderRadius: "4px",
//                         objectFit: "cover",
//                       }}
//                     />

//                     <div style={{ flex: 1 }}>
//                       <div
//                         style={{
//                           fontSize: "16px",
//                           color: "#ffffff",
//                           marginBottom: "4px",
//                         }}
//                       >
//                         {song.title}
//                       </div>
//                       <div
//                         style={{
//                           fontSize: "14px",
//                           color: "#b3b3b3",
//                         }}
//                       >
//                         {song.artist}
//                       </div>
//                     </div>

//                     <button
//                       onClick={() =>
//                         isAdded
//                           ? handleRemoveSong(song.id!)
//                           : handleAddSong(song)
//                       }
//                       style={{
//                         background: "none",
//                         border: `1px solid ${isAdded ? "#1db954" : "#535353"}`,
//                         color: isAdded ? "#1db954" : "#ffffff",
//                         padding: "6px 16px",
//                         borderRadius: "20px",
//                         fontSize: "12px",
//                         fontWeight: "700",
//                         cursor: "pointer",
//                         textTransform: "uppercase",
//                         minWidth: "70px",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!isAdded) {
//                           e.currentTarget.style.borderColor = "#ffffff";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (!isAdded) {
//                           e.currentTarget.style.borderColor = "#535353";
//                         }
//                       }}
//                     >
//                       {isAdded ? "Added" : "Add"}
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Selected Songs List */}
//           {selectedSongs.length > 0 && !searchQuery && (
//             <div>
//               <h4
//                 style={{
//                   fontSize: "18px",
//                   color: "#ffffff",
//                   marginBottom: "16px",
//                   fontWeight: "700",
//                 }}
//               >
//                 Added Songs ({selectedSongs.length})
//               </h4>

//               {selectedSongs.map((song, index) => (
//                 <div
//                   key={song.id}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "16px",
//                     padding: "8px",
//                     borderRadius: "4px",
//                     cursor: "pointer",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.backgroundColor = "#1a1a1a";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.backgroundColor = "transparent";
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: "16px",
//                       textAlign: "center",
//                       color: "#b3b3b3",
//                       fontSize: "14px",
//                     }}
//                   >
//                     {index + 1}
//                   </div>

//                   <img
//                     src={song.image || "/default-cover.png"}
//                     alt={song.title}
//                     style={{
//                       width: "40px",
//                       height: "40px",
//                       borderRadius: "4px",
//                       objectFit: "cover",
//                     }}
//                   />

//                   <div style={{ flex: 1 }}>
//                     <div
//                       style={{
//                         fontSize: "16px",
//                         color: "#ffffff",
//                         marginBottom: "4px",
//                       }}
//                     >
//                       {song.title}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: "14px",
//                         color: "#b3b3b3",
//                       }}
//                     >
//                       {song.artist}
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => handleRemoveSong(song.id!)}
//                     style={{
//                       background: "none",
//                       border: "none",
//                       color: "#b3b3b3",
//                       cursor: "pointer",
//                       padding: "8px",
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.color = "#ffffff";
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.color = "#b3b3b3";
//                     }}
//                   >
//                     <CloseIcon />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Close button */}
//       <button
//         onClick={() => window.history.back()}
//         style={{
//           position: "absolute",
//           top: "16px",
//           right: "16px",
//           background: "rgba(0,0,0,0.7)",
//           border: "none",
//           color: "#ffffff",
//           width: "32px",
//           height: "32px",
//           borderRadius: "50%",
//           cursor: "pointer",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <CloseIcon />
//       </button>
//     </div>
//   );
// }

import React, {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import "../styles/CreatePlaylist.css";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylist } from "../store/slices/musicSlice.ts";
import { FaSearch, FaPlay, FaEllipsisH, FaTimes } from "react-icons/fa";
import musicPlaceholder from "../assets/music-player-removebg.png";
import { RootState } from "../store/index.ts";
import {
  addPlaylistToFirebase,
  fetchSongsFromFirebase,
  uploadPlaylistImage,
} from "../firebase/playlistService.ts";
import { Song } from "../store/slices/musicSlice.ts";
import "../styles/CreatePlaylist.css";
import { setCurrentPlaylist } from "../store/slices/playlistSlice.ts";

const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  </svg>
);
const CreatePlaylistPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const name = useSelector((state: RootState) => state.auth.signupProfile.name);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);

  
  useEffect(() => {
    fetch("https://spotify-project-123-default-rtdb.firebaseio.com/songs.json")
      .then((response) => response.json())
      .then((data) => setSongs(data));
  }, []);

  console.log(songs);
  const handleImageClick = () => {
    inputFileRef.current?.click();
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleSongToggle = (song: Song) => {
    setSelectedSongs((prev) =>
      prev.some((s) => s.id === song.id)
        ? prev.filter((s) => s.id !== song.id)
        : [...prev, song]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !playlistName || selectedSongs.length === 0) return;

    const imageUrl = coverImage
      ? await uploadPlaylistImage(coverImage, user.id)
      : "";

    const playlist = {
      name: playlistName,
      description: playlistDescription,
      coverUrl: imageUrl,
      songs: selectedSongs,
      userId: user.id,
      ownerName: name || "Unknown",
    };

    const newPlaylist = await addPlaylistToFirebase(playlist);
    dispatch(setCurrentPlaylist(newPlaylist));
    dispatch(setPlaylist(newPlaylist.songs));
    setPlaylistDescription("");
    setCoverImage(null);
    setSelectedSongs([]);
  };

  const filteredSongs = songs?.filter(
    (song) =>
      song.title?.toLowerCase().includes(search.toLowerCase()) ||
      song.artist?.toLowerCase().includes(search.toLowerCase())
  );
  const coverPreview = coverImage ? URL.createObjectURL(coverImage) : null;

  return (
    <div className="create-playlist-container">
      <div className="create-playlist-sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <h2 className="sidebar-title">Your Library</h2>
        </div>

        {/* Playlists Section */}
        <div className="playlists-section">
          <h3 className="playlists-section-title">Playlists</h3>
        </div>

        {/* Current Playlist */}
        <div className="current-playlist-item">
          <div
            className="playlist-cover-thumb"
            style={{
              backgroundImage: coverPreview ? `url(${coverPreview})` : "none",
            }}
          >
            {!coverPreview && (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            )}
          </div>
          <div className="playlist-info">
            <div className="playlist-name">{playlistName}</div>
            <div className="playlist-meta">
              Playlist • {user?.email || "User"}
            </div>
          </div>
        </div>

        {/* Recents */}
        <div className="recents-header">
          <span className="recents-title">Recents</span>
          <ListIcon />
        </div>
      </div>
      <div className="main">
        <form onSubmit={handleSubmit} className="create-playlist-main">
          <div className="playlist-header">
            <div
              className={`cover-upload-container ${
                coverImage ? "has-image" : ""
              }`}
              onClick={handleImageClick}
              style={{
                backgroundImage: coverImage
                  ? `url(${URL.createObjectURL(coverImage)})`
                  : undefined,
              }}
            >
              {!coverImage && (
                <div className="cover-placeholder">
                  <img src={musicPlaceholder} alt="placeholder" />
                  <div className="cover-placeholder-text">Choose Photo</div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={inputFileRef}
                onChange={handleImageChange}
                className="cover-file-input"
              />
            </div>
            <div className="playlist-details">
              <div className="playlist-type">Playlist</div>
              <input
                className="playlist-name-input"
                placeholder="Add playlist name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
              />
              <input
                className="playlist-description-input"
                placeholder="Add playlist description"
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
              />
              <div className="playlist-owner-info">By {name || "Unknown"}</div>
            </div>
          </div>

          <div className="playlist-controls">
            <button
              className={`play-button ${
                selectedSongs.length === 0 ? "disabled" : ""
              }`}
              type="submit"
              disabled={selectedSongs.length === 0}
            >
              <FaPlay />
            </button>
            <button type="button" className="more-options-button">
              <FaEllipsisH />
            </button>
            <div className="controls-right">
              <span>{selectedSongs.length} Songs</span>
              <button
                type="button"
                onClick={() => setSelectedSongs([])}
                className="song-remove-button"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="search-section">
            <div className="search-title">
              Let's find something for your playlist
            </div>
            <div className="search-input-container">
              <div className="search-icon">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search for songs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {filteredSongs.map((song, index) => (
            <div
              key={song.id}
              className="song-item"
              onClick={() => handleSongToggle(song)}
            >
              <div className="song-index">{index + 1}</div>
              <img src={song.image} alt={song.title} className="song-cover" />
              <div className="song-info">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist}</div>
              </div>
              <button
                type="button"
                className={`add-button ${
                  selectedSongs.some((s) => s.id === song.id) ? "added" : ""
                }`}
              >
                {selectedSongs.some((s) => s.id === song.id) ? "Added" : "Add"}
              </button>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistPage;
