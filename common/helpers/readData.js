import fs from "fs";

export const readData = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error(`Error reading JSON from ${filePath}:`, err.message);
    return null;
  }
};
