// youtubeAudioConverter.js
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static"; // your static ffmpeg

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ytDlpPath = path.join(__dirname, "tools", "yt-dlp_x86.exe");

const outputDir = path.join(__dirname, "downloads");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

export function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    const filename = `audio_${Date.now()}.mp3`;
    const outputPath = path.join(outputDir, filename);

    const ytdlp = spawn(ytDlpPath, [
      "-x", // extract audio only
      "--audio-format",
      "mp3", // convert to mp3
      "--audio-quality",
      "0", // best quality
      "--no-playlist", // single video only
      "--ffmpeg-location",
      ffmpegPath, // use ffmpeg-static
      "-o",
      outputPath,
      url,
    ]);

    ytdlp.stdout.on("data", (data) => console.log(data.toString()));
    ytdlp.stderr.on("data", (data) => console.error(data.toString()));

    ytdlp.on("error", reject);

    ytdlp.on("close", (code) => {
      if (code !== 0)
        return reject(new Error(`yt-dlp exited with code ${code}`));
      console.log(`Conversion finished: ${filename}`);
      resolve(outputPath);
    });
  });
}
