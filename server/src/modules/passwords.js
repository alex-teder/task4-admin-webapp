import bcrypt from "bcrypt";

const SALT_ROUNDS = 5;

export async function getHashedPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(enteredPassword, hash) {
  return await bcrypt.compare(enteredPassword, hash);
}
