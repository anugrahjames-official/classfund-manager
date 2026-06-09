import { getAuth } from "firebase-admin/auth";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    req.user = decoded; // uid, email, etc. now available in route handlers
    req.roll_no=Number(decoded.email.split('@')[0]);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(403).json({ error: "Unauthorized" });
  }
};