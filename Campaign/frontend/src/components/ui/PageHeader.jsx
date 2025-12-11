

import { Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function PageHeader({ title = "", subtitle = "", rightSlot }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ marginBottom: "28px" }}
    >
      <Box className="flex justify-between items-center flex-wrap gap-2">

        <Box>
          {/* TITLE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(90deg,#FF5E5E,#FF8D95,#FFD5D8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.6px",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {title}
            </Typography>
          </motion.div>

          {/* SUBTITLE */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Typography
                sx={{
                  marginTop: "4px",
                  fontSize: "14px",
                  color: "#707070",
                  opacity: 0.85,
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </Typography>
            </motion.div>
          )}
        </Box>

        {rightSlot && <Box>{rightSlot}</Box>}
      </Box>
    </motion.div>
  );
}
