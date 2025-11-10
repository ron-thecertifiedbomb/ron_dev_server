import mongoose from "mongoose";
import Me from "../models/me.schema.js";


export const seedDatabase = async ( data, database ) => {
  const URI = process.env.MONGO_URI;

  try {
    await mongoose.connect(URI, {
      dbName: database,
      serverApi: { version: "1", strict: true, deprecationErrors: true },
      serverSelectionTimeoutMS: 5000,
    });
   console.log("databse", database);
    console.log("✅ Connected to MongoDB");
   
if (!data) return
    // Insert products
    await Me.insertMany(data);
    console.log(`🌱 Inserted  profiles data successfully`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};
