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

// Optional cookies file (for age-restricted videos)
const cookiesPath = path.join(__dirname, "tools", "cookies.txt");

export function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    const outputTemplate = path.join(outputDir, "audio_%(title)s.%(ext)s");

    // Build arguments for yt-dlp (Python version)
    const args = [
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
      "--extractor-args",
      "youtube:player_client=default", // suppress JS runtime warning
      "-o",
      outputTemplate,
      url,
    ];

    // Add cookies if available
    if (fs.existsSync(cookiesPath)) {
      args.push("--cookies", cookiesPath);
    }

    // Spawn yt-dlp via Python to ensure it works on Linux/Render
    const ytdlp = spawn("python3", ["-m", "yt_dlp", ...args]);

    let mp3FileName = "";
    let downloadLog = "";

    // Track download progress
    ytdlp.stdout.on("data", (data) => {
      const str = data.toString();
      downloadLog += str;
      const match = str.match(/\[download\]\s+(\d{1,3}\.\d)%/);
      if (match) {
        const percent = parseFloat(match[1]);
        sendProgress(percent, mp3FileName || "audio");
      }
    });

    ytdlp.stderr.on("data", (data) => {
      const str = data.toString();
      downloadLog += str;
      console.error(str);
    });

    ytdlp.on("error", (err) => {
      console.error("yt-dlp spawn error:", err);
      reject(err);
    });

    ytdlp.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`yt-dlp exited with code ${code}\n${downloadLog}`)
        );
      }

      try {
        // Find downloaded MP3
        const files = fs.readdirSync(outputDir);
        const mp3File = files.find(
          (f) => f.endsWith(".mp3") && f.startsWith("audio_")
        );
        if (!mp3File) return reject(new Error("MP3 file not found"));

        mp3FileName = mp3File;
        const fullPath = path.join(outputDir, mp3File);

        const matchTitle = mp3File.match(/^audio_(.+)\.mp3$/);
        const title = matchTitle ? matchTitle[1] : "audio";

        // Ensure progress reaches 100%
        sendProgress(100, title);

        resolve({ filePath: fullPath, title });
      } catch (err) {
        reject(err);
      }
    });
  });
}
