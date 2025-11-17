// youtubeAudioConverter.js
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ffmpegPath from "ffmpeg-static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ytDlpPath = path.join(__dirname, "tools", "yt-dlp_x86.exe");

const outputDir = path.join(__dirname, "downloads");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

export function downloadAudio(url) {
  return new Promise((resolve, reject) => {
    const nameWithoutExt = `audio_${Date.now()}`;
    const outputTemplate = path.join(outputDir, nameWithoutExt + ".%(ext)s");

    const ytdlp = spawn(ytDlpPath, [
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
    ]);

    ytdlp.stdout.on("data", (d) => console.log(d.toString()));
    ytdlp.stderr.on("data", (d) => console.error(d.toString()));

    ytdlp.on("error", reject);

    ytdlp.on("close", (code) => {
      if (code !== 0)
        return reject(new Error(`yt-dlp exited with code ${code}`));

      const mp3Path = path.join(outputDir, `${nameWithoutExt}.mp3`);
      console.log(`Conversion finished: ${mp3Path}`);

      resolve(mp3Path);
    });
  });
}
