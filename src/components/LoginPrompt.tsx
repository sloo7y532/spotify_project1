import React, { useEffect } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const LoginPromptModal = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    });

    return () => unsubscribe();
  }, [auth, setOpen]);

  const handleClose = () => setOpen(false);

  const handleLogin = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          bgcolor: "#191414", // لون Spotify الداكن
          color: "#fff",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "#fff" }}
        >
          <CloseIcon />
        </IconButton>

        <MusicNoteIcon
          sx={{
            fontSize: 40,
            color: "#1DB954",
            bgcolor: "#1DB95422",
            borderRadius: "50%",
            p: 1,
          }}
        />

        <Typography variant="h6" fontWeight="bold">
          Join to keep listening
        </Typography>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#ccc", mt: 1 }}
        >
          Log in to enjoy unlimited music, playlists, and your favorite artists
          — all in one place.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              bgcolor: "#1DB954",
              color: "#000",
              fontWeight: "bold",
              borderRadius: 20,
              px: 4,
              "&:hover": { bgcolor: "#1ed760" },
            }}
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderColor: "#1DB954",
              color: "#1DB954",
              borderRadius: 20,
              px: 4,
              "&:hover": { borderColor: "#1ed760", color: "#1ed760" },
            }}
          >
            Not Now
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginPromptModal;
