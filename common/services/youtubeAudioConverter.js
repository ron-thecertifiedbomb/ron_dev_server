import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";
import { sendProgress } from "../services/youtubeProgress.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure downloads folder exists
const outputDir = path.join(__dirname, "downloads");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Dynamically pick yt-dlp binary based on platform
const ytDlpPath =
  process.platform === "win32"
    ? path.join(__dirname, "tools", "yt-dlp_x86.exe") // Windows
    : path.join(__dirname, "tools", "yt-dlp"); // Linux / Render

// Optional cookies path for YouTube login
const cookiesPath = path.join(__dirname, "tools", "cookies.txt");

export function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    const outputTemplate = path.join(outputDir, "audio_%(title)s.%(ext)s");

    // Build arguments array
    const spawnArgs = [
      "-f",
      "bestaudio",
      "-x",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "--no-playlist",
      "--ffmpeg-location",
      ffmpegPath,
      "-o",
      outputTemplate,
      url,
    ];

    if (fs.existsSync(cookiesPath)) {
      spawnArgs.push("--cookies", cookiesPath);
      spawnArgs.push("--extractor-args", "youtube:player_client=default");
    }

    const ytdlp = spawn(ytDlpPath, spawnArgs);

    let mp3FileName = "";

    // Capture download progress
    ytdlp.stdout.on("data", (data) => {
      const str = data.toString();
      const match = str.match(/\[download\]\s+(\d{1,3}\.\d)%/);
      if (match) {
        const percent = parseFloat(match[1]);
        sendProgress(percent, mp3FileName || "audio");
      }
    });

    ytdlp.stderr.on("data", (data) =>
      console.error("yt-dlp error:", data.toString())
    );

    ytdlp.on("error", (err) => {
      console.error("yt-dlp spawn error:", err);
      reject(err);
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`yt-dlp exited with code ${code}`));
      }

      try {
        // Find the downloaded MP3
        const files = fs.readdirSync(outputDir);
        const mp3File = files.find(
          (f) => f.endsWith(".mp3") && f.startsWith("audio_")
        );
        if (!mp3File) return reject(new Error("MP3 file not found"));

        mp3FileName = mp3File;
        const fullPath = path.join(outputDir, mp3File);

        // Extract title from filename
        const matchTitle = mp3File.match(/^audio_(.+)\.mp3$/);
        const title = matchTitle ? matchTitle[1] : "audio";

        sendProgress(100, title);

        resolve({ filePath: fullPath, title });
      } catch (err) {
        reject(err);
      }
    });
  });
}
