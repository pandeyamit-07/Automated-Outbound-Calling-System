// src/components/ui/FileUpload.jsx
import React from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Typography } from "@mui/material";

export default function FileUpload({
  label = "Upload file",
  subLabel,
  accept,
  file,
  onChange,
  multiple = false,
}) {
  return (
    <label
      className="cursor-pointer block"
      style={{ display: "block" }}
    >
      <Box
        sx={{
          border: "2px dashed #ffb3b3",
          borderRadius: 3,
          py: 3,
          px: 2,
          textAlign: "center",
          color: "#666",
          background: "rgba(255,255,255,0.7)",
          "&:hover": {
            background: "rgba(255,245,245,0.9)",
          },
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 36, color: "#FF5E5E" }} />
        <Typography sx={{ mt: 1, fontWeight: 500 }}>
          {file ? file.name : label}
        </Typography>
        {subLabel && (
          <Typography sx={{ fontSize: 12, mt: 0.5, opacity: 0.7 }}>
            {subLabel}
          </Typography>
        )}
      </Box>

      <input
        hidden
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
      />
    </label>
  );
}
