// src/components/ui/GradientButton.jsx
import React from "react";
import { Button, CircularProgress } from "@mui/material";

export default function GradientButton({
  children,
  loading = false,
  fullWidth = true,
  ...props
}) {
  return (
    <Button
      {...props}
      fullWidth={fullWidth}
      disabled={loading || props.disabled}
      sx={{
        textTransform: "none",
        py: 1.4,
        borderRadius: 3,
        background: "linear-gradient(135deg,#FF5E5E,#FF9E9E)",
        color: "#fff",
        fontWeight: 700,
        fontSize: "16px",
        boxShadow: "0px 4px 14px rgba(255,94,94,0.35)",
        "&:hover": {
          background: "linear-gradient(135deg,#ff4b4b,#ff8e8e)",
          boxShadow: "0px 6px 18px rgba(255,94,94,0.45)",
        },
        "&.Mui-disabled": {
          opacity: 0.7,
          background: "linear-gradient(135deg,#FF5E5E,#FF9E9E)",
          color: "#fff",
        },
        ...(props.sx || {}),
      }}
    >
      {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : children}
    </Button>
  );
}
