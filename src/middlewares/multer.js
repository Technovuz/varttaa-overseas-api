const multer = require("multer");
const path = require("path");
const fs = require("fs");

//  absolute path for storage
const uploadPath = process.env.UPLOADS_PATH || "files";

// Ensure the upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log(` files folder created: ${uploadPath}`);
}


//  Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/x-msvideo": "avi",
    "video/x-matroska": "mkv",
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(" Only image and video files are allowed"));
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB file limit
});

console.log(` Multer is using directory: ${uploadPath}`);

module.exports = upload;