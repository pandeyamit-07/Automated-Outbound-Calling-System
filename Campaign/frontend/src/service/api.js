// -------- BASE URL --------
const BASE = "http://localhost:7000/api";

// -------- AUTH HEADER ------
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// -------- LOGIN ----------
export const login = async (username, password) => {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return res.json();
};

// -------- AUDIO UPLOAD ----------
export const uploadAudioAPI = async (name, file) => {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("file", file);

  const res = await fetch(`${BASE}/audio`, {
    method: "POST",
    headers: authHeader(), // no content-type
    body: fd,
  });

  return res.json();
};

// -------- CONTACT UPLOAD ----------
export const uploadContactsAPI = async (group, file) => {
  const fd = new FormData();
  fd.append("group_name", group);
  fd.append("excel", file);

  const res = await fetch(`${BASE}/contacts/upload-excel`, {
    method: "POST",
    headers: authHeader(),
    body: fd,
  });

  return res.json();
};

// -------- GET GROUPS ----------
export const fetchGroups = async () => {
  const res = await fetch(`${BASE}/groups`, {
    headers: authHeader(),
  });

  return res.json();
};

export const createGroupAPI = async (name) => {
  const res = await fetch(`${BASE}/groups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ group_name: name }),
  });

  return res.json();
};


// -------- GET AUDIOS ----------
export const fetchAudios = async () => {
  const res = await fetch(`${BASE}/audio`, {
    headers: authHeader(),
  });

  return res.json();
};

// -------- START CAMPAIGN ----------
export const startCampaignAPI = async (campaignName, groupName) => {
  const res = await fetch(`${BASE}/call/start-calls`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({
      campaign_name: campaignName,
      group_name: groupName
    }),
  });

  return res.json();
};


// -------- DASHBOARD STATS ----------
export const getDashboardStats = async () => {
  const res = await fetch(`${BASE}/dashboard-stats`, {
    headers: authHeader(),
  });
  return res.json();
};
