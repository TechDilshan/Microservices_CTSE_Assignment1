const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const extractToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
};

const requireHallOwnerOrAdmin = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ detail: "Invalid token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const role = payload.role || "";
    if (role !== "admin" && role !== "hall_owner") {
      return res
        .status(403)
        .json({ detail: "Hall owner or admin access required" });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ detail: "Invalid token" });
  }
};

module.exports = {
  requireHallOwnerOrAdmin,
};

