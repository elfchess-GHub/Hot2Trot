const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const roots = ["Hot2Trotski.html", "events", "figures", "ideas"];
const errors = [];
let checked = 0;

function htmlFiles(root) {
  const fullPath = path.join(repoRoot, root);
  if (!fs.existsSync(fullPath)) return [];
  if (!fs.statSync(fullPath).isDirectory()) return [root];
  return fs.readdirSync(fullPath)
    .filter((file) => file.endsWith(".html"))
    .map((file) => path.join(root, file));
}

for (const relativePath of roots.flatMap(htmlFiles)) {
  const fullPath = path.join(repoRoot, relativePath);
  const html = fs.readFileSync(fullPath, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|data:|#|javascript:)/i.test(href) || href.includes("${")) continue;

    const [target] = href.split("#");
    if (!target || (!target.endsWith(".html") && !target.includes("/"))) continue;

    checked += 1;
    const resolved = path.resolve(path.dirname(fullPath), target);
    if (!fs.existsSync(resolved)) {
      errors.push(`broken local link: ${relativePath} -> ${href}`);
    }
  }
}

if (errors.length) {
  console.error("Local link check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Local link check passed: ${checked} local link(s) checked.`);
