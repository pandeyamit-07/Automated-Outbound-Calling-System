import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findAdminByEmail } from "../../models/admin/adminModel.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await findAdminByEmail(email);

    if (!admin) return res.status(401).json({ message: "Invalid email" });

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({ message: "Login Successful", token });

  } catch (err) {
    return res.status(500).json({ message: "Server Error", err });
  }
};
