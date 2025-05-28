const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  console.log("🔹 Headers:", req.headers);

  const authHeader = req.headers.authorization;
  console.log("🔹 Authorization Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - No Token Provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔹 Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Token Missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};


module.exports = authenticateJWT;
