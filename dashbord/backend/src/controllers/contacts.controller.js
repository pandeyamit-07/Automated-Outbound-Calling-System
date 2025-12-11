// src/controllers/contacts.controller.js
import * as contactsModel from '../models/contacts.model.js';

export async function getStatusCount(req, res) {
  const status = req.query.status;
  if (status) {
    const count = await contactsModel.countByStatus(status);
    return res.json({ status, count });
  } else {
    const counts = await contactsModel.countByStatus();
    return res.json({ counts });
  }
}
