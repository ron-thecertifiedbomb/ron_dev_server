import fs from "fs";
import Me from "../common/models/me.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedDatabase } from "../helpers/seedDatabase.js";

// Load environment variables
dotenv.config();

const uri = process.env.MONGO_URI;

const jsonPath = new URL("../common/data/me.json", import.meta.url);
const me = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const submitData = async () => {
  try {
    console.log("✅ Connected to MongoDB");
    await seedDatabase(uri, data, me);

    // Insert data
    await Me.insertMany(data);
    console.log(
      `🌱 Inserted data successfully`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

submitData();
