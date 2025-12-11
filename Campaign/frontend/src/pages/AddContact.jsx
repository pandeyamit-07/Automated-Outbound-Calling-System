


// AddContact.jsx
import {
  Paper,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";

import { useState, useEffect } from "react";

import PageHeader from "../components/ui/PageHeader";
import FileUpload from "../components/ui/FileUpload";
import GradientButton from "../components/ui/GradientButton";

import {
  uploadContactsAPI,
  fetchGroups,
   createGroupAPI
} from "../service/api";

import { toastSuccess, toastError } from "../utils/toast";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";

import { motion } from "framer-motion";

export default function AddContact() {
  const theme = useTheme();

  const [excel, setExcel] = useState(null);
  const [groups, setGroups] = useState([]);        // backend groups
  const [selectedGroup, setSelectedGroup] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [newGroup, setNewGroup] = useState("");

  // 🚀 Fetch Groups from Backend
  useEffect(() => {
    const loadGroups = async () => {
      const res = await fetchGroups();

      if (!res.error) {
        setGroups(res.data || []);
      } else {
        toastError("Failed to load groups!");
      }
    };

    loadGroups();
  }, []);

  // ➕ Add new group from UI (frontend only)
const saveGroup = async () => {
  if (!newGroup.trim()) return toastError("Enter a valid group name!");

  // Backend Call
  const res = await createGroupAPI(newGroup);

  if (res.error) {
    return toastError(res.message || "Group creation failed");
  }

  toastSuccess("Group added!");

  // Update UI group list
  setGroups([...groups, newGroup]);
  setSelectedGroup(newGroup);

  setNewGroup("");
  setAddMode(false);
};



  // 📤 Upload Excel Contacts
  const saveContacts = async () => {
    if (!excel || !selectedGroup) {
      return toastError("Select file + group!");
    }

    const res = await uploadContactsAPI(selectedGroup, excel);

    if (res.error) {
      return toastError("Upload failed!");
    }

    toastSuccess(`✔ Saved: ${res.saved} | ❌ Skipped: ${res.skipped}`);
  };

  return (
    <>
      <PageHeader
        title="Add Contacts"
        subtitle="Import contact list and assign to a group."
      />

      <div className="flex justify-center mt-8 px-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ width: "100%", maxWidth: 530 }}
        >
          <Paper
            sx={{
              p: 5,
              borderRadius: 5,
              transition: "0.3s",
              background:
                theme.palette.mode === "dark"
                  ? "rgba(30,33,40,0.85)"
                  : "#ffffff",
              backdropFilter: "blur(20px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 0 18px rgba(255,75,75,0.12)"
                  : "0 10px 26px rgba(255,86,86,0.18)",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255,150,150,0.25)"
                  : "1px solid rgba(255,120,120,0.16)",
            }}
          >
            {/* Title */}
            <Typography
              fontWeight={600}
              fontSize={17}
              mb={3}
              sx={{
                color: theme.palette.mode === "dark" ? "#ff9c9c" : "#ff5e5e",
              }}
            >
              📁 Upload Contact File
            </Typography>

            {/* Select Group */}
            <div className="flex gap-2 items-center mb-3">
              <TextField
                fullWidth
                select
                label="Select Group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "transparent",
                  },
                }}
              >
                {groups.length > 0 ? (
                  groups.map((g, i) => (
                    <MenuItem key={i} value={g}>
                      {g}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No Groups Found</MenuItem>
                )}
              </TextField>

              {!addMode && (
                <IconButton
                  onClick={() => setAddMode(true)}
                  sx={{
                    borderRadius: 2,
                    background:
                      theme.palette.mode === "dark" ? "#2a2f36" : "#ffe7e7",
                  }}
                >
                  <AddIcon sx={{ color: "#ff4e4e" }} />
                </IconButton>
              )}
            </div>

            {/* Add New Group Panel */}
            {addMode && (
              <div className="flex gap-2 mb-3">
                <TextField
                  fullWidth
                  placeholder="New Group Name"
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "transparent",
                    },
                  }}
                />

                <IconButton onClick={saveGroup}>
                  <DoneIcon sx={{ color: "green" }} />
                </IconButton>

                <IconButton onClick={() => setAddMode(false)}>
                  <CloseIcon sx={{ color: "red" }} />
                </IconButton>
              </div>
            )}

            {/* Upload Component */}
            <FileUpload
              label="Upload Excel / CSV"
              subLabel="Supported: .xlsx, .xls, .csv"
              accept=".xlsx,.xls,.csv"
              file={excel}
              onChange={(e) => setExcel(e.target.files[0])}
            />

            {/* Save Button */}
            <GradientButton sx={{ mt: 4 }} onClick={saveContacts}>
              Save Contacts
            </GradientButton>
          </Paper>
        </motion.div>
      </div>
    </>
  );
}
