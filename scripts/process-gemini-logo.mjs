import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public/brand");
const src = path.join(outDir, "logo-source.png");

async function removeLightBackground(inputBuffer, threshold = 232) {
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
    if (avg >= threshold && spread <= 18) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function toWhiteLogo(inputBuffer) {
  const { data, info } = await sharp(inputBuffer)
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
  })
    .png()
    .toBuffer();
}

async function main() {
  const source = await sharp(src).png().toBuffer();
  const transparent = await removeLightBackground(source);
  const trimmed = await sharp(transparent).trim().png().toBuffer();

  await sharp(trimmed).resize({ width: 920 }).png().toFile(path.join(outDir, "logo-full.png"));

  const meta = await sharp(trimmed).metadata();
  const iconWidth = Math.round(meta.height * 0.95);
  const iconBuf = await sharp(trimmed)
    .extract({ left: 0, top: 0, width: iconWidth, height: meta.height })
    .trim()
    .resize({ width: 256, height: 256, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const whiteBuf = await toWhiteLogo(trimmed);

  await sharp(trimmed).resize({ width: 920 }).png().toFile(path.join(outDir, "logo-transparent-sm.png"));
  await sharp(whiteBuf).resize({ width: 920 }).png().toFile(path.join(outDir, "logo-white.png"));
  await sharp(iconBuf).png().toFile(path.join(outDir, "logo-icon.png"));

  console.log("Gemini logo processed:", {
    width: meta.width,
    height: meta.height,
    iconWidth,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
