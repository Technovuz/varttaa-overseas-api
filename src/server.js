const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const logger = require("./utils/logger");
const upload = multer();
dotenv.config();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadPath = process.env.UPLOADS_PATH || "files";
app.use("/files", express.static(uploadPath));

// Import Routes
const adminRoutes = require("./routes/admin.routes");
const machineRoutes = require("./routes/machine.routes");

// Use Routes
app.use("/api/admin", adminRoutes);
app.use("/api/machine",machineRoutes);

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

const PORT = process.env.PORT || 8087;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));