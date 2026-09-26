export function validateCreateUser(req, res, next) {

    const {
        username,
        email,
        password,
        phonenumber
    } = req.body;

    if (!username || !email || !password || !phonenumber) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters."
        });
    }

    next();
}