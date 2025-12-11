import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#FF5E5E" },
      secondary: { main: "#FF9E9E" },
      background: {
        default: mode === "light" ? "#FFF5F5" : "#0B0F19",
        paper: mode === "light" ? "#ffffff" : "#141A28",
      },
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
    },
    shape: { borderRadius: 14 },
  });
