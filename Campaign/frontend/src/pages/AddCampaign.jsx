


import {
  Paper,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  useTheme,
} from "@mui/material";

import { useState, useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import GradientButton from "../components/ui/GradientButton";
import { motion } from "framer-motion";

import { startCampaignAPI, fetchGroups } from "../service/api";
import { toastSuccess, toastError } from "../utils/toast";

export default function AddCampaign() {
  const theme = useTheme();

  const [campaignName, setCampaignName] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch groups only
  useEffect(() => {
    const init = async () => {
      const g = await fetchGroups();
      setGroups(g.data || []);
      setFetching(false);
    };
    init();
  }, []);

  // Start Campaign
  const handleCreateCampaign = async () => {
    if (!campaignName) return toastError("Enter campaign name!");
    if (!selectedGroup) return toastError("Select contact group!");

    setLoading(true);

    const res = await startCampaignAPI(campaignName, selectedGroup);

    if (res.error) {
      toastError(res.message || "Failed to start campaign!");
    } else {
      toastSuccess(`📞 Campaign started for group: ${selectedGroup}`);
    }

    setLoading(false);
  };

  return (
    <>
      <PageHeader
        title="Create Campaign"
        subtitle="Start automated voice calling campaign."
      />

      <div className="flex justify-center mt-8 px-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ width: "100%", maxWidth: 530 }}
        >
          <Paper
            sx={{
              p: 5,
              borderRadius: 5,
              background:
                theme.palette.mode === "dark"
                  ? "rgba(30,33,40,0.85)"
                  : "#ffffff",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 0 18px rgba(255,75,75,0.12)"
                  : "0px 10px 26px rgba(255,86,86,0.18)",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255,150,150,0.25)"
                  : "1px solid rgba(255,120,120,0.16)",
            }}
          >
            <Typography
              fontWeight={600}
              fontSize={17}
              mb={3}
              sx={{
                color: theme.palette.mode === "dark" ? "#ff9c9c" : "#ff5e5e",
              }}
            >
              🎯 Campaign Details
            </Typography>

            {/* Campaign Name */}
            <TextField
              label="Campaign Name"
              fullWidth
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              sx={{ mb: 3 }}
            />

            {/* Group Dropdown */}
            <TextField
              select
              fullWidth
              label="Select Contact Group"
              value={selectedGroup}
              disabled={fetching}
              onChange={(e) => setSelectedGroup(e.target.value)}
              sx={{ mb: 4 }}
            >
              {groups.length > 0 ? (
                groups.map((g, i) => (
                  <MenuItem key={i} value={g}>
                    {g}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No groups available</MenuItem>
              )}
            </TextField>

            {/* Start Button */}
            <GradientButton fullWidth onClick={handleCreateCampaign}>
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Start Call Campaign"
              )}
            </GradientButton>
          </Paper>
        </motion.div>
      </div>
    </>
  );
}
