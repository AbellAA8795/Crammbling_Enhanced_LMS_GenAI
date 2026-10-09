// server/src/middleware/shared/requireRole.js
// Generic role gate. Requires req.user.role to be set by verifyToken
// from the JWT claim (see the earlier role-architecture discussion —
// only needed if you've added the `role` column/JWT claim already;
// otherwise swap this out for your existing requireAdmin).
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}


// prompt management — super admin (IT) only
