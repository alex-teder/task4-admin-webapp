import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.URI);

export const usersCollection = client.db("users").collection("users");

const CONNECTION_TIMER = 1000;

export async function makeConnection(callback) {
  try {
    await client.connect();
    await callback();
    setTimeout(() => {
      client.close();
    }, CONNECTION_TIMER);
  } catch (error) {
    console.error("Error from db:", error.message);
  }
}
