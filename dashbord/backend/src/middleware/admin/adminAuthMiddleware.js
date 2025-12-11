import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ message: "Unauthorized - No token" });

  const token = header.split(" ")[1]; // Bearer TOKEN

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.adminId = decoded.adminId;
    next();
  });
};
