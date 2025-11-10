import dotenv from "dotenv";
import { seedDatabase } from "./common/helpers/seedDatabase.js";
import fs from "fs";
dotenv.config();


const jsonPath = new URL("./common/data/me.json", import.meta.url);
const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));



seedDatabase( data, "storage");
