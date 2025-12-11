
// import { useState } from "react";
// import {
//   Paper,
//   TextField,
//   Typography,
//   CircularProgress,
//   InputAdornment,
//   IconButton
// } from "@mui/material";

// import {
//   Visibility,
//   VisibilityOff,
//   PersonOutline,
//   LockOutlined
// } from "@mui/icons-material";
// import { toastSuccess, toastError } from "../utils/toast";

// import { motion } from "framer-motion";
// import GradientButton from "../components/ui/GradientButton";
// import { useNavigate } from "react-router-dom";
// import { useTheme } from "@mui/material";

// export default function Login() {
//   const theme = useTheme();
//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Login submit handler
  
// const handleLogin = async (e) => {
//   e.preventDefault();
//   setError("");

//   if (!username || !password) {
//     toastError("Please enter username & password");
//     return;
//   }

//   try {
//     setLoading(true);

//     const res = await fetch("http://localhost:7000/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       toastError(data.message || "Invalid credentials ❌");
//       setLoading(false);
//       return;
//     }

//     // Save token & username
//     localStorage.setItem("token", data.token);
//     localStorage.setItem("username", data.user?.username || "");

//     // 🎉 SUCCESS TOAST
//     toastSuccess("Login successful 🎉");

//     // Redirect
//     navigate("/dashboard", { replace: true });

//   } catch (err) {
//     console.error(err);
//     toastError("Server error, try again later ❌");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center relative overflow-hidden"
//     >
//       {/* Animated Background */}
//       <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ff7a7a] via-[#ffb3b3] to-[#fff0f0] dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] animate-gradient-move"></div>

//       <div className="absolute inset-0 backdrop-blur-[35px] -z-0"></div>

//       <motion.div
//         initial={{ opacity: 0, scale: 0.92 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.45, ease: "easeOut" }}
//         style={{ width: "100%", maxWidth: 430 }}
//       >
//         <Paper
//           sx={{
//             p: 5,
//             borderRadius: 6,
//             background:
//               theme.palette.mode === "dark"
//                 ? "rgba(255,255,255,0.07)"
//                 : "rgba(255,255,255,0.65)",
//             boxShadow:
//               theme.palette.mode === "dark"
//                 ? "0px 25px 80px rgba(0,0,0,0.65)"
//                 : "0px 35px 80px rgba(255,120,120,0.40)",
//             backdropFilter: "blur(25px)",
//             border:
//               theme.palette.mode === "dark"
//                 ? "1px solid rgba(255,255,255,0.10)"
//                 : "1px solid rgba(255,120,120,0.25)",
//           }}
//         >
//           <Typography
//             textAlign="center"
//             fontWeight={800}
//             fontSize={28}
//             mb={1}
//             sx={{
//               background: "linear-gradient(90deg,#ff5e5e,#ff8585)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             Welcome Back 👋
//           </Typography>

//           <Typography
//             sx={{
//               mb: 4,
//               textAlign: "center",
//               fontSize: 14,
//               opacity: 0.75,
//               color: theme.palette.mode === "dark" ? "#f58d8dff" : "#444",
//             }}
//           >
//           </Typography>

//           <form onSubmit={handleLogin} className="space-y-3">
//             {/* Username */}
//             <TextField
//               label="Admin Username"
//               fullWidth
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonOutline style={{ opacity: 0.8 }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "14px",
//                   background:
//                     theme.palette.mode === "dark"
//                       ? "rgba(255,255,255,0.08)"
//                       : "rgba(255,255,255,0.20)",
//                   backdropFilter: "blur(10px)",
//                   transition: "0.3s",
//                   border: "1.6px solid rgba(255,255,255,0.25)",
//                   "&:hover": {
//                     border: "1.6px solid #ff8c8c",
//                   },
//                   "&.Mui-focused": {
//                     border: "1.9px solid #ff6b6b",
//                     boxShadow: "0 0 15px rgba(255,120,120,0.35)",
//                   },
//                 },
//               }}
//             />

//             {/* Password */}
//             <TextField
//               label="Password"
//               type={showPass ? "text" : "password"}
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockOutlined style={{ opacity: 0.8 }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <IconButton onClick={() => setShowPass(!showPass)}>
//                     {showPass ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 ),
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: "14px",
//                   background:
//                     theme.palette.mode === "dark"
//                       ? "rgba(255,255,255,0.08)"
//                       : "rgba(255,255,255,0.20)",
//                   border: "1.6px solid rgba(255,255,255,0.25)",
//                   transition: "0.3s",
//                   "&:hover": {
//                     border: "1.6px solid #ff8c8c",
//                   },
//                   "&.Mui-focused": {
//                     border: "1.9px solid #ff6b6b",
//                     boxShadow: "0 0 15px rgba(255,120,120,0.35)",
//                   },
//                 },
//               }}
//             />

//             {error && (
//               <Typography sx={{ fontSize: 13, color: "#ff4d4d", mt: 1 }}>
//                 {error}
//               </Typography>
//             )}

//             <GradientButton type="submit" loading={loading} sx={{ mt: 3 }}>
//               {loading ? (
//                 <CircularProgress size={22} sx={{ color: "#fff" }} />
//               ) : (
//                 "Login"
//               )}
//             </GradientButton>
//           </form>
//         </Paper>
//       </motion.div>
//     </div>
//   );
// }







import { useState } from "react";
import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined
} from "@mui/icons-material";
import { toastSuccess, toastError } from "../utils/toast";

import { motion } from "framer-motion";
import GradientButton from "../components/ui/GradientButton";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      toastError("Please enter username & password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:7000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toastError(data.message || "Invalid credentials ❌");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user?.username || "");

      toastSuccess("Login successful 🎉");

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      toastError("Server error, try again later ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Background Layers */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#ff7a7a] via-[#ffb3b3] to-[#fff0f0] dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e] animate-gradient-move"></div>
      <div className="absolute inset-0 backdrop-blur-[35px] -z-0"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 430 }}
      >
        <Paper
          sx={{
            p: 5,
            borderRadius: 6,
            background:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.07)"
                : "rgba(255,255,255,0.65)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0px 25px 80px rgba(0,0,0,0.65)"
                : "0px 35px 80px rgba(255,120,120,0.40)",
            backdropFilter: "blur(25px)",
            border:
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.10)"
                : "1px solid rgba(255,120,120,0.25)",
          }}
        >

          {/* ⭐ Image Instead of Welcome Back Text */}
          <img
            src="/c.jpg"
            alt="login-logo"
            style={{
              width: "120px",
              height: "120px",
              display: "block",
              margin: "0 auto",
              marginBottom: "12px",
              objectFit: "cover",
              borderRadius: "50%",
              boxShadow: "0 0 15px rgba(255,120,120,0.4)"
            }}
          />

          {/* Optional small subtitle (empty now) */}
          <Typography
            sx={{
              mb: 4,
              textAlign: "center",
              fontSize: 14,
              opacity: 0.75,
              color: theme.palette.mode === "dark" ? "#f58d8dff" : "#444",
            }}
          >
          </Typography>

          <form onSubmit={handleLogin} className="space-y-3">
            
            {/* Username Field */}
            <TextField
              label="Admin Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline style={{ opacity: 0.8 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.20)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
                  border: "1.6px solid rgba(255,255,255,0.25)",
                  "&:hover": {
                    border: "1.6px solid #ff8c8c",
                  },
                  "&.Mui-focused": {
                    border: "1.9px solid #ff6b6b",
                    boxShadow: "0 0 15px rgba(255,120,120,0.35)",
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              label="Password"
              type={showPass ? "text" : "password"}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined style={{ opacity: 0.8 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton onClick={() => setShowPass(!showPass)}>
                    {showPass ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.20)",
                  border: "1.6px solid rgba(255,255,255,0.25)",
                  transition: "0.3s",
                  "&:hover": {
                    border: "1.6px solid #ff8c8c",
                  },
                  "&.Mui-focused": {
                    border: "1.9px solid #ff6b6b",
                    boxShadow: "0 0 15px rgba(255,120,120,0.35)",
                  },
                },
              }}
            />

            {error && (
              <Typography sx={{ fontSize: 13, color: "#ff4d4d", mt: 1 }}>
                {error}
              </Typography>
            )}

            <GradientButton type="submit" loading={loading} sx={{ mt: 3 }}>
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Login"
              )}
            </GradientButton>
          </form>
        </Paper>
      </motion.div>
    </div>
  );
}
