import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, parse } from "node:path";

const targets = [
  "src/assets/image.png",
  "src/assets/image02.png",
  "src/assets/img.jpg",
  "public/cover.png",
];

const logosDir = "src/assets/logos";

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function toWebp(input, opts = {}) {
  if (!(await exists(input))) {
    console.log(`skip (missing): ${input}`);
    return;
  }
  const { dir, name } = parse(input);
  const out = join(dir, `${name}.webp`);
  await sharp(input)
    .resize(opts.maxWidth ? { width: opts.maxWidth, withoutEnlargement: true } : undefined)
    .webp({ quality: opts.quality ?? 78, effort: 5 })
    .toFile(out);
  const before = (await stat(input)).size;
  const after = (await stat(out)).size;
  console.log(`${input} -> ${out}  ${(before / 1024).toFixed(1)}KB -> ${(after / 1024).toFixed(1)}KB`);
}

for (const file of targets) {
  await toWebp(file, { maxWidth: 1600 });
}

if (await exists(logosDir)) {
  const logos = await readdir(logosDir);
  for (const f of logos) {
    if (/\.(png|jpe?g)$/i.test(f)) {
      await toWebp(join(logosDir, f), { quality: 85 });
    }
  }
}
