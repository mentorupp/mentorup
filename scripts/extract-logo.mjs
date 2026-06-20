import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public/brand/logo-sheet.png");
const outDir = path.join(root, "public/brand");

async function removeNearBlack(input, output, threshold = 28) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= threshold && g <= threshold && b <= threshold) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);
}

async function main() {
  const meta = await sharp(src).metadata();
  const w = meta.width;
  const h = meta.height;

  const topCrop = { left: 40, top: 20, width: w - 80, height: Math.round(h * 0.46) };
  const whiteCrop = {
    left: 40,
    top: Math.round(h * 0.54),
    width: Math.round(w / 2) - 60,
    height: Math.round(h * 0.42),
  };
  const iconCrop = { left: 48, top: 28, width: 175, height: 175 };

  const topBuf = await sharp(src).extract(topCrop).png().toBuffer();
  const whiteBuf = await sharp(src).extract(whiteCrop).png().toBuffer();
  const iconBuf = await sharp(src).extract(iconCrop).png().toBuffer();

  await sharp(topBuf).resize({ width: 640 }).png().toFile(path.join(outDir, "logo-gradient.png"));
  await removeNearBlack(topBuf, path.join(outDir, "logo-transparent.png"));
  await sharp(path.join(outDir, "logo-transparent.png"))
    .resize({ width: 640 })
    .png()
    .toFile(path.join(outDir, "logo-transparent-sm.png"));

  await sharp(whiteBuf).resize({ width: 480 }).png().toFile(path.join(outDir, "logo-white.png"));
  await removeNearBlack(whiteBuf, path.join(outDir, "logo-white-transparent.png"), 20);

  await sharp(iconBuf)
    .resize({ width: 256, height: 256, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, "logo-icon-raw.png"));

  await removeNearBlack(iconBuf, path.join(outDir, "logo-icon.png"));
  await sharp(path.join(outDir, "logo-icon.png"))
    .resize({ width: 128, height: 128, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, "favicon-512.png"));

  console.log("Logo assets generated in public/brand/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
