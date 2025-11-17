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

// Path to optional cookies file (for age-restricted videos)
const cookiesPath = path.join(__dirname, "tools", "cookies.txt");

export function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    const outputTemplate = path.join(outputDir, "audio_%(title)s.%(ext)s");

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

    // If cookies file exists, add it for authentication
    if (fs.existsSync(cookiesPath)) {
      args.splice(6, 0, "--cookies", cookiesPath);
    }

    const ytdlp = spawn(ytDlpPath, args);

    let mp3FileName = "";

    // Track download progress
    ytdlp.stdout.on("data", (data) => {
      const str = data.toString();
      const match = str.match(/\[download\]\s+(\d{1,3}\.\d)%/);
      if (match) {
        const percent = parseFloat(match[1]);
        sendProgress(percent, mp3FileName || "audio");
      }
    });

    ytdlp.stderr.on("data", (data) => console.error(data.toString()));
    ytdlp.on("error", reject);

    ytdlp.on("close", (code) => {
      if (code !== 0)
        return reject(new Error(`yt-dlp exited with code ${code}`));

      try {
        const files = fs.readdirSync(outputDir);
        const mp3File = files.find(
          (f) => f.endsWith(".mp3") && f.startsWith("audio_")
        );
        if (!mp3File) return reject(new Error("MP3 file not found"));

        mp3FileName = mp3File;
        const fullPath = path.join(outputDir, mp3File);

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
