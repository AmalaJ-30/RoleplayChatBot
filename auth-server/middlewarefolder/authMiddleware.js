import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

/*export const authMiddleware = (req, res, next) => {
  console.log("[authmiddle ware ] User from token:", req.user);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};*/
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Save user ID for queries
    req.user = { id: decoded.userId };

    // ✅ Log decoded payload for debugging
    console.log("[authMiddleware] Decoded token:", decoded);
    console.log("[authMiddleware] req.user:", req.user);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};
