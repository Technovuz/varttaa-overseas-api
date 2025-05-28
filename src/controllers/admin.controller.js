const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
// const { loginSchema } = require("../validators/auth.validation");
const logger = require("../utils/logger");

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  try {
    const { username , password } = req.body;

    // Find admin user
    const existingAdmin = await prisma.admin.findUnique({ where: { username } });

    if (!existingAdmin) {
      logger.warn(`Failed login attempt for username: ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, existingAdmin.password);
    if (!isValidPassword) {
      logger.warn(`Invalid password attempt for username: ${username}`);
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: existingAdmin.id, username: existingAdmin.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } // Token expires in 2 hours
    );

    logger.info(`Admin logged in: ${username}`);

    // Send token in response
    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Logout function (Handled on client-side by deleting token)
exports.logout = (req, res) => {
  logger.info("Admin logged out");
  res.status(200).json({ message: "Logged out successfully (Token must be removed client-side)" });
};
