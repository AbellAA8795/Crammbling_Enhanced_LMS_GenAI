import jwt from "jsonwebtoken";

export function googleCallbackController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Google authentication failed.",
      });
    }
    const token = jwt.sign(
      {
        id: req.user.user_id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    //const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    //return res.redirect(`${frontendUrl}/oauth-success?token=${token}`);

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error in Google callback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to complete Google login.",
    });
  }
}
