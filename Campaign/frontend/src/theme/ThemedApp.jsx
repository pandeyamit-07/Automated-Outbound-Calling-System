import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useThemeStore } from "./useThemeStore";

export default function ThemedApp({ children }) {
  const { mode } = useThemeStore();

  const theme = createTheme({
    palette: {
      mode: mode, // "dark" or "light"
      primary: { main: "#FF5E5E" }
    },
    shape: { borderRadius: 10 },
    typography: { fontFamily: "Inter, sans-serif" },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
