import React, { useEffect, useState } from "react";
import { fetchPlaylistsByUser } from "../firebase/playlistService.ts";
import "../styles/UserPlaylist.css";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
}

interface Props {
  userId: string;
}

const UserPlaylists: React.FC<Props> = ({ userId }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const data = await fetchPlaylistsByUser(userId);
        setPlaylists(
          data.map((playlist: any) => ({
            id: playlist.id,
            name: playlist.name || "",
            description: playlist.description || "",
            coverUrl: playlist.coverUrl || "",
          }))
        );
      } catch (err) {
        console.error("Failed to load playlists:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPlaylists();
  }, [userId]);

  if (loading) return <p>Loading playlists...</p>;

  return (
    <div className="user-playlists">
      {playlists.map((playlist) => (
        <div key={playlist.id} className="playlist-card">
          <img
            src={playlist.coverUrl || "/default-cover.png"}
            alt={playlist.name}
            className="playlist-cover"
          />
          <h3>{playlist.name}</h3>
          <p>{playlist.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UserPlaylists;
