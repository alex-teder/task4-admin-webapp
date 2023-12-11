import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { checkIfUserExists, checkIfUserIsBlocked } from "./users.js";

dotenv.config();

export const createTokenFromEmail = (email) => jwt.sign({ email }, process.env.TOKEN_SECRET);

export const verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, async (err) => {
    if (err) return res.sendStatus(403);
    const email = jwt.decode(token).email;
    const exists = await checkIfUserExists(email);
    if (!exists) {
      return res.sendStatus(403);
    }
    const isBlocked = await checkIfUserIsBlocked(email);
    if (isBlocked) {
      return res.sendStatus(403);
    }
    next();
  });
};
