


import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import PageHeader from "../components/ui/PageHeader";
import CardWidget from "../components/ui/CardWidget";
import { motion } from "framer-motion";
import { getDashboardStats } from "../service/api";

// Icons
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import GroupsIcon from "@mui/icons-material/Groups";
import CampaignIcon from "@mui/icons-material/Campaign";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Dashboard() {
  const theme = useTheme();

  const [stats, setStats] = useState({
    audios: 0,
    groups: 0,
    campaigns: 0,
    successRate: "0%",
  });

  const [loading, setLoading] = useState(true);

  // Fetch stats from backend

useEffect(() => {
  const load = async () => {
    const res = await getDashboardStats();
    setStats(res);
    setLoading(false);
  };
  load();
}, []);



  return (
    <>
      <PageHeader
        title="Dashboard Overview"
        subtitle="Analytics and real-time activity summary."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.05 }}>
          <CardWidget
            icon={<CloudUploadIcon />}
            label="Uploaded Audios"
            value={loading ? "..." : stats.audios}
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <CardWidget
            icon={<GroupsIcon />}
            label="Contact Groups"
            value={loading ? "..." : stats.groups}
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <CardWidget
            icon={<CampaignIcon />}
            label="Campaigns Created"
            value={loading ? "..." : stats.campaigns}
          />
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          <CardWidget
            icon={<FavoriteIcon />}
            label="Success Rate"
            value={loading ? "..." : stats.successRate}
          />
        </motion.div>
      </div>
    </>
  );
}
