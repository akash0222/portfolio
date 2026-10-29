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


// Validate the résumé file itself, not just its existence.
try {
  const resume = await readFile(path.join(root, "resume.pdf"));
  if (resume.subarray(0, 5).toString("ascii") !== "%PDF-" || resume.length < 5000) {
    throw new Error("résumé asset does not have a valid PDF signature or is unexpectedly small");
  }
  const pdfText = resume.toString("latin1");
  const xrefIndex = pdfText.lastIndexOf("xref\n");
  const declaredXref = Number(pdfText.match(/startxref\s+(\d+)/)?.[1]);
  if (!Number.isFinite(declaredXref) || declaredXref !== xrefIndex) {
    throw new Error("PDF cross-reference offset does not match the xref table");
  }
  const streamMarker = pdfText.indexOf("stream\n");
  const streamStart = streamMarker + "stream\n".length;
  const streamEnd = pdfText.indexOf("\nendstream", streamStart);
  const declaredStreamLength = Number(pdfText.match(/\/Length\s+(\d+)/)?.[1]);
  if (streamMarker < 0 || streamEnd < streamStart
      || !Number.isFinite(declaredStreamLength)
      || declaredStreamLength !== streamEnd - streamStart) {
    throw new Error("PDF content stream length does not match its declared length");
  }
  console.log(`OK resume.pdf signature and size (${resume.length} bytes)`);
} catch (error) {
  failed = true;
  console.error(`INVALID resume.pdf: ${error instanceof Error ? error.message : String(error)}`);
}

// Ensure the compiled portfolio bundle contains the resume download control.
try {
  const { readdir } = await import("node:fs/promises");
  const assetDir = path.join(root, "assets");
  const assetNames = await readdir(assetDir);
  const jsAssets = assetNames.filter((name) => name.endsWith(".js"));
  const bundles = await Promise.all(jsAssets.map((name) => readFile(path.join(assetDir, name), "utf8")));
  const bundleText = bundles.join("\n");
  for (const [label, needle] of [
    ["resume CTA label", "Download Resume"],
    ["resume asset path", "/resume.pdf"],
    ["resume download filename", "Akash-Singh-Resume.pdf"],
  ]) {
    if (!bundleText.includes(needle)) {
      failed = true;
      console.error(`Built client bundle is missing ${label}`);
    }
  }
} catch (error) {
  failed = true;
  console.error(`Could not verify compiled résumé download control: ${error instanceof Error ? error.message : String(error)}`);
}


try {
  const { readdir } = await import("node:fs/promises");
  const assetDir = path.join(root, "assets");
  const assetNames = await readdir(assetDir);
  const cssAssets = assetNames.filter((name) => name.endsWith(".css"));
  const cssBundles = await Promise.all(cssAssets.map((name) => readFile(path.join(assetDir, name), "utf8")));
  const cssText = cssBundles.join("");
  for (const [label, needle] of [
    ["root flex layout", "#root{position:relative;display:flex;flex-direction:column"],
    ["viewport-height floor", "min-height:100svh"],
    ["footer pinning", "#root>.footer{margin-top:auto}"],
    ["overflow clipping for decorative elements", "overflow:clip"],
  ]) {
    if (!cssText.includes(needle)) {
      failed = true;
      console.error("Built CSS is missing " + label + " fix");
    }
  }
} catch (error) {
  failed = true;
  console.error("Could not verify footer layout CSS: " + (error instanceof Error ? error.message : String(error)));
}

for (const page of ["index.html", "work.html", "about.html", "skills.html", "services.html", "contact.html"]) {
  try {
    const html = await readFile(path.join(root, page), "utf8");
    if (!/<\/html>\s*$/i.test(html)) {
      failed = true;
      console.error(`HTML document missing a standards-mode doctype: ${page}`);
    }
    if (!/<html lang="en-IN">/i.test(html)) {
      failed = true;
      console.error(`HTML document missing the expected language declaration: ${page}`);
    }
    if (!/<\/html>\s*$/i.test(html)) {
      failed = true;
      console.error(`HTML document is not closed correctly: ${page}`);
    }
    const checks = [
      ["title", /<title>/g, 1],
      ["meta description", /<meta\s+name="description"/g, 1],
      ["canonical URL", /<link\s+rel="canonical"/g, 1],
      ["Open Graph type", /<meta\s+property="og:type"/g, 1],
      ["Open Graph title", /<meta\s+property="og:title"/g, 1],
      ["Open Graph description", /<meta\s+property="og:description"/g, 1],
      ["Open Graph URL", /<meta\s+property="og:url"/g, 1],
      ["Open Graph image", /<meta\s+property="og:image"/g, 1],
      ["Twitter card", /<meta\s+name="twitter:card"/g, 1],
      ["Twitter title", /<meta\s+name="twitter:title"/g, 1],
      ["Twitter description", /<meta\s+name="twitter:description"/g, 1],
      ["Twitter image", /<meta\s+name="twitter:image"/g, 1],
    ];

    for (const [label, pattern, expectedCount] of checks) {
      const count = [...html.matchAll(pattern)].length;
      if (count !== expectedCount) {
        failed = true;
        console.error(`SEO metadata ${label} on ${page}: expected ${expectedCount}, found ${count}`);
      }
    }

    if (!html.includes('name="twitter:card" content="summary_large_image"')) {
      failed = true;
      console.error(`Twitter card should use summary_large_image: ${page}`);
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
