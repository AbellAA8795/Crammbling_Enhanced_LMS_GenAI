import fs from "fs";
import multer from "multer";
import path from "path";

// uploads/ is git-ignored, so a fresh clone (or Docker container) doesn't have it.
fs.mkdirSync("uploads", { recursive: true });

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file
const ALLOWED_MIME_TYPES = [
    "text/plain",
    "application/pdf",
    "image/png",
    "image/jpeg",
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // created above if missing
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new Error("FILE_TYPE_NOT_ALLOWED"), false);
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1, // one file per request
    },
    fileFilter,
});