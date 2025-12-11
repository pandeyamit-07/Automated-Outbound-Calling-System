import { Paper, Typography, useTheme } from "@mui/material";

export default function CardWidget({ icon, label, value }) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        padding: 3,
        borderRadius: "28px",
        textAlign: "center",
        transition: "0.3s",
        cursor: "pointer",
        background:
          theme.palette.mode === "dark"
            ? "rgba(30,33,40,0.85)"
            : "#ffffff",
        backdropFilter: "blur(10px)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 0 18px rgba(255,80,80,0.18)"
            : "0 10px 20px rgba(255,120,120,0.18)",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255,120,120,0.22)"
            : "1px solid rgba(255,120,120,0.15)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 0 25px rgba(255,120,120,0.28)"
              : "0 14px 35px rgba(255,86,86,0.25)",
        },
      }}
    >
      <div className="flex justify-center mb-3">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white`}
          style={{
            background: "linear-gradient(135deg,#ff6b6b,#ff96a2)",
            boxShadow: "0px 6px 12px rgba(255,100,100,0.35)",
          }}
        >
          {icon}
        </div>
      </div>

      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>

      <Typography variant="body2" sx={{ opacity: 0.6 }}>
        {label}
      </Typography>
    </Paper>
  );
}
