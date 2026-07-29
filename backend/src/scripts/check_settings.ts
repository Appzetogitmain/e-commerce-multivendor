import mongoose from "mongoose";
import AppSettings from "../models/AppSettings";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

async function run() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/e-commerce-multivendor";
  console.log("Connecting to:", mongoUri);
  await mongoose.connect(mongoUri);
  
  const allSettings = await AppSettings.find().lean();
  console.log("Number of settings documents:", allSettings.length);
  console.log("Documents details:");
  console.log(JSON.stringify(allSettings, null, 2));
  
  await mongoose.connection.close();
}

run().catch(console.error);
