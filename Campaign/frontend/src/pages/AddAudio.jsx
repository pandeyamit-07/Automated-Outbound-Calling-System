

import { useState } from "react";
import { Paper, TextField, Typography, CircularProgress, useTheme } from "@mui/material";
import { motion } from "framer-motion";

import PageHeader from "../components/ui/PageHeader";
import GradientButton from "../components/ui/GradientButton";
import FileUpload from "../components/ui/FileUpload";

import { uploadAudioAPI } from "../service/api";
import { toastSuccess, toastError } from "../utils/toast";

export default function AddAudio() {
  const theme = useTheme();

  const [audioName, setAudioName] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!audioName.trim() || !audioFile) {
      toastError("Please enter name & select an audio file!");
      return;
    }

    setLoading(true);

    const res = await uploadAudioAPI(audioName, audioFile);

    if (!res.error) {
      toastSuccess("Audio uploaded 🎵");
      setAudioName("");
      setAudioFile(null);
    } else {
      toastError(res.message || "Upload failed ❌");
    }

    setLoading(false);
  };

  return (
    <>
      <PageHeader
        title="Add Audio"
        subtitle="Upload and manage audio templates for campaigns."
      />

      <div className="flex justify-center items-center mt-8 px-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: "100%", maxWidth: "530px" }}
        >
          <Paper
            sx={{
              p: 5,
              borderRadius: 5,
              transition: "0.3s",
              background:
                theme.palette.mode === "dark"
                  ? "rgba(25,28,35,0.85)"
                  : "#ffffff",
              backdropFilter: "blur(30px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 0 22px rgba(255,80,80,0.15)"
                  : "0px 18px 40px rgba(255,120,120,0.20)",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255,120,120,0.25)"
                  : "1px solid rgba(255,120,120,0.16)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 0 28px rgba(255,120,120,0.25)"
                    : "0px 20px 45px rgba(255,120,120,0.28)",
              },
            }}
          >
            <Typography
              fontWeight={600}
              fontSize={18}
              mb={2}
              sx={{
                color: theme.palette.mode === "dark" ? "#ffa7a7" : "#ff5e5e",
              }}
            >
              🎵 Upload Audio File
            </Typography>

            {/* Audio Name */}
            <TextField
              label="Audio Name"
              fullWidth
              value={audioName}
              onChange={(e) => setAudioName(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "transparent",
                },
              }}
            />

            {/* Audio File Select */}
            <FileUpload
              label="Select Audio File"
              subLabel="Supported: .mp3, .wav, .ogg"
              accept="audio/*"
              file={audioFile}
              onChange={(e) => setAudioFile(e.target.files[0])}
            />

            {audioFile && (
              <Typography
                sx={{
                  mt: 2,
                  fontSize: "14px",
                  textAlign: "center",
                  color: theme.palette.mode === "dark" ? "#ffa7a7" : "#ff5e5e",
                }}
              >
                Selected: <b>{audioFile.name}</b>
              </Typography>
            )}

            {/* Upload Button */}
            <GradientButton
              sx={{ mt: 4 }}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Upload Audio"
              )}
            </GradientButton>
          </Paper>
        </motion.div>
      </div>
    </>
  );
}
