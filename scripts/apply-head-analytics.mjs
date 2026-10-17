import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(".");
const partialPath = path.join(root, "templates/partials/head-analytics.html");
const startMarker = "<!-- head-analytics:start -->";
const endMarker = "<!-- head-analytics:end -->";
const managedBlockPattern = new RegExp(
  `\\n?\\s*${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}\\s*\\n?`,
  "g"
);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    if (entry.name.startsWith("金沢市の税理士")) continue;

    files.push(fullPath);
  }

  return files;
}

export function prepareDevelopmentHtml(html, block) {
  const cleaned = html
    .replace(managedBlockPattern, "\n")
    .replace(/\s*<!-- Google tag \(gtag\.js\) -->/g, "")
    .replace(/\s*<script\b[^>]*>[\s\S]*?<\/script>/gi, (script) => {
      return /googletagmanager\.com|google-analytics\.com|clarity\.ms|\bgtag\s*\(/i.test(script) ? "" : script;
    })
    .replace(/\s*<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, "")
    .replace(/https?:\/\/(?:www\.)?ashitaharesora\.jp(?=[/"'\s<]|$)/g, "https://ashitaharesora.github.io/ashitaharesora-dev")
    .replace(/(\b(?:href|src|action)=["'])\/(?!\/|ashitaharesora-dev(?:\/|["']))/g, "$1/ashitaharesora-dev/");
  const headClose = cleaned.search(/<\/head>/i);

  if (headClose === -1) return null;

  return `${cleaned.slice(0, headClose)}${block}\n${cleaned.slice(headClose)}`;
}

async function main() {
  const partial = await fs.readFile(partialPath, "utf-8");
  const block = `\n  ${startMarker}\n${partial.trimEnd().split("\n").map((line) => `  ${line}`).join("\n")}\n  ${endMarker}`;
  const htmlFiles = (await walk(root)).filter((file) => file !== partialPath);
  const checkOnly = process.argv.includes("--check");
  let updated = 0;

  for (const file of htmlFiles) {
    const html = await fs.readFile(file, "utf-8");
    const nextHtml = prepareDevelopmentHtml(html, block);

    if (nextHtml === null || nextHtml === html) continue;

    if (!checkOnly) await fs.writeFile(file, nextHtml, "utf-8");
    updated += 1;
    console.log(path.relative(root, file));
  }

  console.log(`[development-head] ${checkOnly ? "pending" : "updated"} ${updated} files`);
  if (checkOnly && updated > 0) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
