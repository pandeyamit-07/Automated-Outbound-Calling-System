
import xlsx from "xlsx";
import { Contact } from "../models/contact.model.js";
import { Group } from "../models/group.model.js";

export const uploadContacts = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "Excel file is required" });
    }

    const groupName = req.body.group_name;
    if (!groupName) {
      return res
        .status(400)
        .json({ error: true, message: "group_name is required" });
    }

    // Group check/create
    const exists = await Group.findGroup(groupName);
    if (!exists) {
      await Group.createGroup(groupName);
      console.log("New group added:", groupName);
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let saved = 0;
    let skipped = 0;

    for (const row of rows) {
      const name =
        row.name ||
        row.Name ||
        row.cust_name ||
        row["Customer Name"] ||
        row["Full Name"];

      const phone =
        row.number ||
        row.Number ||
        row.mobile ||
        row.Mobile ||
        row.phone ||
        row.phone_number ||
        row.Phone ||
        row["Phone Number"];

      if (!name || !phone) continue;

      const duplicate = await Contact.checkDuplicate(phone, groupName);
      if (duplicate) {
        skipped++;
        continue;
      }

      await Contact.insertContact(name, phone, groupName);
      saved++;
    }

    res.json({
      error: false,
      message: "Contacts uploaded successfully",
      saved,
      skipped,
      group: groupName,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: true, message: "Server error", detail: err.message });
  }
};
