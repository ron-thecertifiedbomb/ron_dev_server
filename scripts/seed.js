import fs from "fs";
import Product from "../server/model/products.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const uri = process.env.MONGO_URI;

// Load products.json
const jsonPath = new URL("./server/data/products.json", import.meta.url);
const products = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
// Ensure every variant has size and price
const sanitizedProducts = products.map((product) => {
  const variants = product.variants.map((v, i) => ({
    size: v.size || `Variant ${i + 1}`,
    price: v.price ?? 0,
  }));
  return { ...product, variants };
});
const seedDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: "storage",
      serverApi: { version: "1", strict: true, deprecationErrors: true },
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Connected to MongoDB");

    // Clear old data
    await Product.deleteMany();
    console.log("🧹 Cleared old data");

    // Insert products
    await Product.insertMany(sanitizedProducts);
    console.log(
      `🌱 Inserted ${sanitizedProducts.length} product(s) successfully`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seedDatabase();
