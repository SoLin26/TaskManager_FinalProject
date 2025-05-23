import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config() 

export default async function connect() {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected 😎");
  });
  mongoose.connection.on("error", (error) => {
    console.log("DB error", error);
  });

  // url
  const url = process.env.MONGODB_URI;
  if (!url) {
    console.log("MONGO_URI for connection is missing!");
    process.exit();
  }
  try {
    await mongoose.connect(url);
  } catch (error) {
    console.log("MongoDB error", error);
    process.exit();
  }
}

