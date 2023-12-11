import { makeConnection, usersCollection } from "./db.js";
import { getHashedPassword, verifyPassword } from "./passwords.js";

export const checkIfUserExists = async (email) => {
  let user;
  await makeConnection(async () => {
    user = await usersCollection.findOne({ email });
  });
  return !!user;
};

export const checkIfUserIsBlocked = async (email) => {
  let user;
  await makeConnection(async () => {
    user = await usersCollection.findOne({ email });
  });
  return user.isBlocked;
};

export const createUser = async (username, email, password) => {
  const hashedPassword = await getHashedPassword(password);
  const newUser = {
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    lastSeen: new Date(),
    isBlocked: false,
  };
  await makeConnection(async () => {
    await usersCollection.insertOne(newUser);
  });
};

export const validateUser = async (email, password) => {
  let user;
  await makeConnection(async () => {
    user = await usersCollection.findOne({ email });
  });
  if (!user) return false;
  return await verifyPassword(password, user.password);
};

export const updateLastSeen = async (email) => {
  await makeConnection(async () => {
    const filter = { email };
    const update = { $set: { lastSeen: new Date() } };
    await usersCollection.updateOne(filter, update);
  });
};
