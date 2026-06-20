import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const assetsDir = path.join(
  process.env.USERPROFILE ?? process.env.HOME ?? "",
  ".cursor",
  "projects",
  "c-Users-Sesmt-OneDrive-Desktop-MentorUp",
  "assets"
);
const brandDir = path.join(root, "public/brand");
const publicDir = path.join(root, "public");

const SOURCES = {
  wordmark: fs.existsSync(path.join(assetsDir, "wordmark.png"))
    ? path.join(assetsDir, "wordmark.png")
    : path.join(brandDir, "logo-source.png"),
  icon: fs.existsSync(path.join(assetsDir, "icon.png"))
    ? path.join(assetsDir, "icon.png")
    : path.join(brandDir, "favicon-source.png"),
};

// Prefer original Gemini exports when present
const geminiWordmark = path.join(
  assetsDir,
  "c__Users_Sesmt_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Gemini_Generated_Image_8sq5l48sq5l48sq5-820ae217-2911-48e0-a606-7aade3ae46b8.png"
);
const geminiIcon = path.join(
  assetsDir,
  "c__Users_Sesmt_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_Gemini_Generated_Image_c4e2t6c4e2t6c4e2-50701929-17e0-4d6d-bb7f-8f7d8082372f.png"
);
if (fs.existsSync(geminiWordmark)) SOURCES.wordmark = geminiWordmark;
if (fs.existsSync(geminiIcon)) SOURCES.icon = geminiIcon;

const WORDMARK_WIDTH = 2400;
const ICON_SIZE = 1200;

async function removeLightBackground(inputBuffer, threshold = 228) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const avg = (r + g + b) / 3;
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    if (avg >= threshold && spread <= 20) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .png();
}

async function removeCheckerboard(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const avg = (r + g + b) / 3;
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    if (avg >= 175 && spread <= 24) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .png();
}

async function toWhite(input) {
  const { data, info } = await input
    .clone()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function exportPng(pipeline, filePath, width) {
  await pipeline
    .clone()
    .resize(width, null, {
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .sharpen({ sigma: 0.35, m1: 0.5, m2: 0.25 })
    .png({ compressionLevel: 6, quality: 100, effort: 10 })
    .toFile(filePath);
}

function gradientSvg(size) {
  const rx = Math.round(size * 0.22);
  return Buffer.from(`<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#10b981"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#g)"/>
</svg>`);
}

async function composeFavicon(iconPipeline, size) {
  const bg = await sharp(gradientSvg(size)).png().toBuffer();
  const iconSize = Math.round(size * 0.66);
  const icon = await iconPipeline
    .clone()
    .resize(iconSize, iconSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.3 })
    .png()
    .toBuffer();

  return sharp(bg)
    .composite([{ input: icon, gravity: "center" }])
    .png({ compressionLevel: 6, quality: 100 })
    .toBuffer();
}

async function main() {
  await fs.promises.mkdir(brandDir, { recursive: true });

  const wordmarkSrc = await sharp(SOURCES.wordmark).png().toBuffer();
  const wordmark = await removeLightBackground(wordmarkSrc);
  const wordmarkMeta = await wordmark.metadata();

  await exportPng(wordmark, path.join(brandDir, "logo-full.png"), WORDMARK_WIDTH);
  await exportPng(
    await toWhite(wordmark),
    path.join(brandDir, "logo-white.png"),
    WORDMARK_WIDTH
  );

  const iconSrc = await sharp(SOURCES.icon).png().toBuffer();
  const icon = await removeCheckerboard(iconSrc);
  await exportPng(icon, path.join(brandDir, "logo-icon.png"), ICON_SIZE);

  const faviconSizes = [16, 32, 48, 180, 512];
  for (const size of faviconSizes) {
    const buf = await composeFavicon(icon, size);
    const name =
      size === 180
        ? "apple-touch-icon.png"
        : size === 512
          ? "icon-512.png"
          : `favicon-${size}.png`;
    await fs.promises.writeFile(path.join(publicDir, name), buf);
    if (size === 32) {
      await fs.promises.writeFile(path.join(publicDir, "favicon.png"), buf);
    }
  }

  const svg32 = await composeFavicon(icon, 32);
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
  <image width="32" height="32" xlink:href="data:image/png;base64,${svg32.toString("base64")}"/>
</svg>`;
  await fs.promises.writeFile(path.join(publicDir, "favicon.svg"), faviconSvg);

  console.log("HQ brand assets ready", {
    wordmark: `${WORDMARK_WIDTH}px wide`,
    icon: `${ICON_SIZE}px`,
    ratio: (wordmarkMeta.width / wordmarkMeta.height).toFixed(2),
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
