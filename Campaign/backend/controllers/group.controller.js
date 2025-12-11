import { Group } from "../models/group.model.js";

export const getGroups = async (req, res) => {
  try {
    const rows = await Group.getAll();
    res.json({ error: false, data: rows });
  } catch (e) {
    res.status(500).json({ error: true, message: "Server error" });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { group_name } = req.body;

    if (!group_name)
      return res.status(400).json({ error: true, message: "group_name required" });

    const exists = await Group.findGroup(group_name);

    if (exists)
      return res.status(400).json({ error: true, message: "Group already exists" });

    await Group.createGroup(group_name);

    res.json({ error: false, message: "Group added", group: group_name });
  } catch (e) {
    res.status(500).json({ error: true, message: "Server error" });
  }
};
