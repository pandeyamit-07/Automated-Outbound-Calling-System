



import { Avatar, IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7, Logout } from "@mui/icons-material";
import { useThemeStore } from "../../theme/useThemeStore";
import { useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toastSuccess } from "../../utils/toast";
export default function Topbar() {
  const theme = useTheme();
  const { toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Admin";

// const handleLogout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("username");

//   // Force clean reload so component unmount ho
//   window.location.href = "/login";
// };


const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");

  toastSuccess("Logged out successfully 👋");

  navigate("/login", { replace: true });
};
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className={`
        flex justify-between items-center px-6 py-3 sticky top-0 z-50 backdrop-blur-lg border-b shadow-sm
        ${
          theme.palette.mode === "dark"
            ? "bg-[#0f172a]/60 border-gray-800 text-white"
            : "bg-white/60 border-gray-200 text-gray-800"
        }
      `}
    >
      {/* Branding */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-[20px] font-semibold tracking-wide"
      >
        AutoDialer Studio
      </motion.h1>

      <div className="flex items-center gap-4">
        
        {/* Theme Switch */}
        <Tooltip title={`Switch to ${theme.palette.mode === "light" ? "Dark" : "Light"} Mode`} arrow>
          <IconButton
            onClick={toggleTheme}
            className="hover:scale-125 transition-all duration-300"
          >
            {theme.palette.mode === "light" ? (
              <Brightness4 style={{ color: "#FF5E5E" }} />
            ) : (
              <Brightness7 style={{ color: "#FFD65C" }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Username */}
        <span className="hidden sm:block text-sm opacity-80">
          {username}
        </span>

        {/* Avatar */}
        <Tooltip title="Logout" arrow>
          <Avatar
            onClick={handleLogout}
            sx={{
              bgcolor: "#ff5e5e",
              cursor: "pointer",
              transition: "0.35s",
              "&:hover": {
                transform: "scale(1.15) rotate(4deg)",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0px 0px 15px rgba(255,120,120,0.6)"
                    : "0px 0px 15px rgba(255,76,76,0.6)",
              },
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
        </Tooltip>
      </div>
    </motion.header>
  );
}
