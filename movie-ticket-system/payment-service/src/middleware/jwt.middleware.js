const jwt = require("jsonwebtoken");

const extractToken = (req) => {
  const header = req.headers["authorization"];
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice(7);
};

const requireAuth = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.sendStatus(401);
  }

  // Spring version used a hardcoded secret. We support env override but keep same default.
  const secret =
    process.env.JWT_SECRET || "supersecretkey_movie_ticket_system";

  try {
    const claims = jwt.verify(token, secret);
    // Spring stored user id in claim key "id"
    if (claims && claims.id) {
      req.userId = String(claims.id);
    }
    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
};

module.exports = {
  requireAuth,
};

