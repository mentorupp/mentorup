import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public/brand/favicon-source.png");
const publicDir = path.join(root, "public");
const brandDir = path.join(root, "public/brand");

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
    if (avg >= 180 && spread <= 22) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim()
    .png()
    .toBuffer();
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

async function composeFavicon(iconBuf, size) {
  const bg = await sharp(gradientSvg(size)).png().toBuffer();
  const iconSize = Math.round(size * 0.64);
  const icon = await sharp(iconBuf)
    .resize(iconSize, iconSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp(bg)
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toBuffer();
}

async function main() {
  const source = await sharp(src).png().toBuffer();
  const iconTransparent = await removeCheckerboard(source);

  await sharp(iconTransparent)
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(brandDir, "logo-icon.png"));

  const sizes = [16, 32, 48, 180, 512];
  const outputs = {};

  for (const size of sizes) {
    const buf = await composeFavicon(iconTransparent, size);
    outputs[size] = buf;
  }

  await fs.promises.writeFile(path.join(publicDir, "favicon-16.png"), outputs[16]);
  await fs.promises.writeFile(path.join(publicDir, "favicon-32.png"), outputs[32]);
  await fs.promises.writeFile(path.join(publicDir, "favicon-48.png"), outputs[48]);
  await fs.promises.writeFile(path.join(publicDir, "apple-touch-icon.png"), outputs[180]);
  await fs.promises.writeFile(path.join(publicDir, "icon-512.png"), outputs[512]);
  await fs.promises.writeFile(path.join(publicDir, "favicon.png"), outputs[32]);

  const svg32 = outputs[32].toString("base64");
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
  <image width="32" height="32" xlink:href="data:image/png;base64,${svg32}"/>
</svg>`;
  await fs.promises.writeFile(path.join(publicDir, "favicon.svg"), faviconSvg);

  console.log("Favicons generated:", sizes.join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
