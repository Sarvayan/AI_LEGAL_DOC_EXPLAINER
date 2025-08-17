import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer") ? header.slice(7) : null;
    if (!token)
      return res.status(401).json({ error: "Missing authorization token" });
    const decoded = jwt.verify(token, "mySuperSecretKey123");
    const user = await User.findById(decoded.id).select("_id email");
    if (!user) return res.status(401).json({ error: "Invalid token" });
    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (e) {
    console.error(e);
    res.status(401).json({ error: "Unauthorized" });
  }
};
