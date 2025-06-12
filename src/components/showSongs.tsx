import React, { useEffect, useState, useRef } from "react";
import "../styles/showSongs.css";
import { useDispatch } from "react-redux";
import { setCurrentSong } from "../store/slices/musicSlice.ts";

interface Song {
  title?: string;
  artist?: string;
  image?: string;
  audioUrl?: string;
}

export default function ShowSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://spotify-project-123-default-rtdb.firebaseio.com/songs.json")
      .then((response) => response.json())
      .then((data) => setSongs(data));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="songs-wrapper">
      <button className="scroll-button left" onClick={() => scroll("left")}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      <div className="songs-container" ref={scrollContainerRef}>
        {songs.map((song, index) => (
          <div key={index} className="song-card">
            <div className="song-image">
              <img src={song.image} alt={song.title || "Song cover"} />
              <div
                className="play-button-1"
                onClick={() => dispatch(setCurrentSong(song))}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <div className="song-info">
              <h3 className="song-title">{song.title || "Unknown Title"}</h3>
              <p className="song-artist">{song.artist || "Unknown Artist"}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="scroll-button right" onClick={() => scroll("right")}>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
  );
}

// import React, { useEffect, useState, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { setCurrentSong } from "../store/slices/musicSlice.ts";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import "../styles/showSongs.css";

// interface Song {
//   title?: string;
//   artist?: string;
//   image?: string;
//   audioUrl?: string;
// }

// export default function ShowSongs() {
//   const [songs, setSongs] = useState<Song[]>([]);
//   const [isAuthenticated, setIsAuthenticated] = useState(true);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const dispatch = useDispatch();
//   const auth = getAuth();

//   useEffect(() => {
//     fetch("https://spotify-project-123-default-rtdb.firebaseio.com/songs.json")
//       .then((response) => response.json())
//       .then((data) => setSongs(data));

//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setIsAuthenticated(!!user);
//     });

//     return () => unsubscribe();
//   }, []);

//   const scroll = (direction: "left" | "right") => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = 300;
//       scrollContainerRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   return (
//     <div className="songs-wrapper">
//       <button className="scroll-button left" onClick={() => scroll("left")}>
//         <svg viewBox="0 0 24 24" fill="currentColor">
//           <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
//         </svg>
//       </button>

//       <div className="songs-container" ref={scrollContainerRef}>
//         {songs.map((song, index) => (
//           <div key={index} className="song-card">
//             <div
//               className="song-image"
//               onClick={() => {
//                 if (isAuthenticated) {
//                   dispatch(setCurrentSong(song));
//                 } else {
//                   alert("Please login to play the song");
//                 }
//               }}
//             >
//               <img src={song.image} alt={song.title || "Song cover"} />
//               <div className="play-button-1">
//                 <svg viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M8 5v14l11-7z" />
//                 </svg>
//               </div>
//             </div>
//             <div className="song-info">
//               <h3 className="song-title">{song.title || "Unknown Title"}</h3>
//               <p className="song-artist">{song.artist || "Unknown Artist"}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <button className="scroll-button right" onClick={() => scroll("right")}>
//         <svg viewBox="0 0 24 24" fill="currentColor">
//           <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
//         </svg>
//       </button>
//     </div>
//   );
// }
