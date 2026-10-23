import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const requiredFiles = [
  "index.html",
  "work.html",
  "about.html",
  "skills.html",
  "services.html",
  "contact.html",
  "assets/scheduly-preview.svg",
  "assets/result-generator-preview.svg",
  "resume.pdf",
  "robots.txt",
  "sitemap.xml",
];

let failed = false;
for (const relativePath of requiredFiles) {
  const fullPath = path.join(root, relativePath);
  try {
    await access(fullPath);
    const info = await stat(fullPath);
    if (!info.isFile() || info.size === 0) throw new Error("file is empty or is not a file");
    console.log(`OK ${relativePath} (${info.size} bytes)`);
  } catch (error) {
    failed = true;
    console.error(`MISSING ${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const urls = [
  "https://portfolio-pi-lyart-61.vercel.app/",
  "https://portfolio-pi-lyart-61.vercel.app/work.html",
  "https://portfolio-pi-lyart-61.vercel.app/about.html",
  "https://portfolio-pi-lyart-61.vercel.app/skills.html",
  "https://portfolio-pi-lyart-61.vercel.app/services.html",
  "https://portfolio-pi-lyart-61.vercel.app/contact.html",
];
try {
  const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
  for (const url of urls) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) {
      failed = true;
      console.error(`SITEMAP missing ${url}`);
    }
  }
} catch (error) {
  failed = true;
  console.error(`Could not read sitemap: ${error instanceof Error ? error.message : String(error)}`);
}

for (const page of ["index.html", "work.html", "about.html", "skills.html", "services.html", "contact.html"]) {
  try {
    const html = await readFile(path.join(root, page), "utf8");
    if (!html.includes('property="og:image"')) {
      failed = true;
      console.error(`SEO metadata missing og:image: ${page}`);
    }
    if (!html.includes('name="twitter:card" content="summary_large_image"')) {
      failed = true;
      console.error(`SEO metadata missing large Twitter card: ${page}`);
    }
    if (!html.includes("<title>")) {
      failed = true;
      console.error(`SEO metadata missing title: ${page}`);
    }
  } catch (error) {
    failed = true;
    console.error(`Could not verify ${page}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) {
  console.error("\nPortfolio output verification failed.");
  process.exitCode = 1;
} else {
  console.log("\nPortfolio output verification passed: all six page entries, local assets, résumé, and sitemap are present.");
}
