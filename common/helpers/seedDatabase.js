
export const seedDatabase = async ({uri, data, database}) => {

    if (!uri) return
    
  try {
    await mongoose.connect(uri, {
      dbName: database,
      serverApi: { version: "1", strict: true, deprecationErrors: true },
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Connected to MongoDB");

    // Insert products
    await Product.insertMany(data);
    console.log(`🌱 Inserted ${data.length} product(s) successfully`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};