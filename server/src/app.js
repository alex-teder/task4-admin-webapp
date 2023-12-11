import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { makeConnection, usersCollection } from "./modules/db.js";
import {
  checkIfUserExists,
  checkIfUserIsBlocked,
  createUser,
  validateUser,
  updateLastSeen,
} from "./modules/users.js";
import { createTokenFromEmail, verifyTokenMiddleware } from "./modules/tokens.js";

dotenv.config();

const ROUTES = {
  AUTH: "/auth",
  USERS: "/users",
};

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

// sign up
router.post(ROUTES.AUTH, async (req, res) => {
  const { username, email, password } = req.body;
  const isExistingUser = await checkIfUserExists(email);
  if (isExistingUser) {
    res.status(400).send("User already exists");
    return;
  }
  await createUser(username, email, password);
  const token = createTokenFromEmail(email);
  res.json({ token });
});

// log in
router.put(ROUTES.AUTH, async (req, res) => {
  const { email, password } = req.body;
  const isValid = await validateUser(email, password);
  if (!isValid) {
    res.status(400).send("Wrong email or password.");
    return;
  }
  const isBlocked = await checkIfUserIsBlocked(email);
  if (isBlocked) {
    res.status(403).send("This user is blocked.");
    return;
  }
  await updateLastSeen(email);
  const token = createTokenFromEmail(email);
  res.json({ token });
});

// get users
router.get(ROUTES.USERS, verifyTokenMiddleware, async (req, res) => {
  let users;
  await makeConnection(async () => {
    users = await usersCollection.find({}).toArray();
  });
  res.json(users);
});

// block/unblock users
router.patch(ROUTES.USERS, verifyTokenMiddleware, async (req, res) => {
  const { ids, isBlocked } = req.body;
  const mongoIds = ids.map((id) => new ObjectId(id));
  let result;
  await makeConnection(async () => {
    result = await usersCollection.updateMany({ _id: { $in: mongoIds } }, { $set: { isBlocked } });
  });
  res.json({ updatedCount: result.modifiedCount });
});

// delete users
router.put(ROUTES.USERS, verifyTokenMiddleware, async (req, res) => {
  const { ids } = req.body;
  const mongoIds = ids.map((id) => new ObjectId(id));
  let result;
  await makeConnection(async () => {
    result = await usersCollection.deleteMany({ _id: { $in: mongoIds } });
  });
  res.json({ deletedCount: result.deletedCount });
});

app.use(router);

const PORT = 3030;
app.listen(PORT, () => console.log("App is listening on port:", PORT));
