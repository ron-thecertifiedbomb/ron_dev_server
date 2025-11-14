// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.MONGO_URI ;

const connectDB = async () => {

  if (!URI) {
    console.error("❌ No valid MongoDB URI in environment variables");
    process.exit(1);
  }
  try {
    await mongoose.connect(URI, {
      dbName: "storage", 
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });
    console.log("✅ Successfully connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop the server if connection fails
  }
};

export default connectDB;
