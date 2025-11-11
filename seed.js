import dotenv from "dotenv";
import { seedDatabase } from "./common/helpers/seedDatabase.js";
import { readData } from "./common/helpers/readData.js";

dotenv.config();

const jsonPath = "./common/data/services.json";

// Read JSON data safely
const data = readData(jsonPath);

if (data) {
  console.log("Services data:", data);

  // If seedDatabase is async
  const runSeed = async () => {
    try {
      await seedDatabase(data, "storage");
      console.log("✅ Database seeding completed!");
    } catch (err) {
      console.error("❌ Failed to seed database:", err.message);
    }
  };

  runSeed();
} else {
  console.error("❌ No data to seed.");
}
