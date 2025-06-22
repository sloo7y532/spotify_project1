// src/pages/Dashboard-Page.tsx
import React, { useState, useEffect } from "react";
import "../styles/Dashboard-Page.css";
import ShowSongs from "../components/showSongs.tsx";
import MusicPlayer from "../components/MusicPlayer.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/index.ts";
import { useNavigate } from "react-router-dom";
import { setPlaylist } from "../store/slices/musicSlice.ts";
import LoginPromptModal from "../components/LoginPrompt.tsx";
import { fetchPlaylistsByUser } from "../firebase/playlistService.ts";
import { Link } from "react-router-dom";
<<<<<<< HEAD
// import UserPlaylists from "../components/UserPlaylists.tsx"; // هذا السطر كان معلقاً، تركته كما هو
=======
>>>>>>> 081ca24f3d8fe7bc0761e9ee15407be6f97ebf15

// Icons
import AddIcon from "@mui/icons-material/Add";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const handleCreatePlaylist = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    navigate("/create-playlist");
  };

  const handleBrowsePodcasts = () => {
    if (!user) {
      setIsLoginPromptOpen(true);
      return;
    }
    navigate("/browse-podcasts");
  };

  useEffect(() => {
    const loadPlaylists = async () => {
      if (user) {
        const data = await fetchPlaylistsByUser(user.id);
        // ملاحظة هامة: هذا السطر `dispatch(setPlaylist(data));`
        // يستخدم `setPlaylist` من `musicSlice` والتي تستقبل `Song[]`.
        // بينما `fetchPlaylistsByUser` تعيد قوائم تشغيل (`PlaylistWithId[]`).
        // هذا قد يسبب خطأ في نوع البيانات أثناء التشغيل إذا لم يتم التعامل معه.
        // للتصحيح الدقيق، يجب أن يتم تحديث قوائم تشغيل المستخدم في Redux
        // باستخدام أكشن من `playlistSlice` (مثل `setUserPlaylists`)
        // أو التأكد من أن `setPlaylist` في `musicSlice` مصممة للتعامل مع هذا النوع من البيانات.
        // للحفاظ على طلبك "صحح الخطأ وبس" والذي كان يتعلق بـ ESLint، تركت هذا السطر كما هو.
        // إذا واجهت أخطاء في أنواع البيانات لاحقاً، فهذا هو المكان المحتمل للتحقق منه.
        dispatch(setPlaylist(data)); 
      }
    };
    loadPlaylists();
  }, [user, dispatch]);

  return (
    <div className="dashboard-container">
      {isLoginPromptOpen && (
        <LoginPromptModal isOpen={isLoginPromptOpen} setOpen={setIsLoginPromptOpen} />
      )}
<<<<<<< HEAD
      {/* {user?.id ? (
        <UserPlaylists userId={user.id} />
      ) : ( */}
        <div className="dashboard-sidebar">
          <div className="dashboard-sidebar-header">
            <p>Your Library</p>
            <div className="dashboard-sidebar-header-icon">
              <Link to="/create-playlist"> {/* تم تغيير المسار ليكون مطلقاً */}
                <AddIcon />
              </Link>
            </div>
          </div>
          <div className="dashboard-sidebar-body">
            <div className="dashboard-sidebar-body-item">
              <p className="dashboard-sidebar-body-item-title">
                Create your first playlist
              </p>
              <p className="dashboard-sidebar-body-item-description">
                It's easy, we'll help you
              </p>
              <button
                className="dashboard-sidebar-body-item-button"
                onClick={handleCreatePlaylist}
              >
                Create playlist
              </button>
            </div>
            <div className="dashboard-sidebar-body-item">
              <p className="dashboard-sidebar-body-item-title">
                let's find some podcasts to follow
              </p>
              <p className="dashboard-sidebar-body-item-description">
                We'll keep you updated on new episodes
              </p>
              <button
                className="dashboard-sidebar-body-item-button"
                onClick={handleBrowsePodcasts}
              >
                Browse podcasts
              </button>
            </div>
          </div>
        </div>
      {/* )} */}
      <div className="dashboard-main-container">
        <div className="dashboard-main-container-header">
          {/* تم تغيير <a> إلى <span> لحل تحذير ESLint المتعلق بـ href="#" */}
          <span className="dashboard-main-container-header-title"> 
            Trending songs
          </span>
          <span className="dashboard-main-container-header-see-all"> 
            See all
          </span>
        </div>
        <div>
          <ShowSongs />
        </div>
      </div>
=======

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <p>Your Library</p>
          <div className="dashboard-sidebar-header-icon">
            <Link to="/create-playlist">
              <AddIcon />
            </Link>
          </div>
        </div>

        <div className="dashboard-sidebar-body">
          <div className="dashboard-sidebar-body-item">
            <p className="dashboard-sidebar-body-item-title">Create your first playlist</p>
            <p className="dashboard-sidebar-body-item-description">It's easy, we'll help you</p>
            <button className="dashboard-sidebar-body-item-button" onClick={handleCreatePlaylist}>
              Create playlist
            </button>
          </div>

          <div className="dashboard-sidebar-body-item">
            <p className="dashboard-sidebar-body-item-title">Let's find some podcasts to follow</p>
            <p className="dashboard-sidebar-body-item-description">We'll keep you updated on new episodes</p>
            <button className="dashboard-sidebar-body-item-button" onClick={handleBrowsePodcasts}>
              Browse podcasts
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="dashboard-main-container">
        <div className="dashboard-main-container-header">
          <a href="https://www.youtube.com/" className="dashboard-main-container-header-title">
            Trending songs
          </a>
          <a href="https://www.youtube.com/" className="dashboard-main-container-header-see-all">
            See all
          </a>
        </div>
        <ShowSongs />
      </div>

      {/* Music Player */}
>>>>>>> 081ca24f3d8fe7bc0761e9ee15407be6f97ebf15
      {user && <MusicPlayer />}
    </div>
  );
}