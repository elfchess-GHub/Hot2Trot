const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const livePath = path.join(repoRoot, "Hot2Trotski.html");
const previewPath = path.join(repoRoot, "dist-preview", "source-library.html");
const buildScript = path.join(repoRoot, "scripts", "build_source_library.js");

function fail(message) {
  console.error(message);
  process.exit(1);
}

const build = spawnSync(process.execPath, [buildScript], {
  cwd: repoRoot,
  encoding: "utf8"
});

if (build.stdout) process.stdout.write(build.stdout);
if (build.stderr) process.stderr.write(build.stderr);
if (build.status !== 0) {
  fail(`Refusing to promote because build_source_library.js failed with exit code ${build.status}.`);
}

if (!fs.existsSync(previewPath)) {
  fail(`Refusing to promote because preview file is missing: ${path.relative(repoRoot, previewPath)}`);
}

if (!fs.existsSync(livePath)) {
  fail(`Refusing to promote because live page is missing: ${path.relative(repoRoot, livePath)}`);
}

const previewHtml = fs.readFileSync(previewPath, "utf8").trim();
const sourceCount = (previewHtml.match(/<article class="source-item">/g) || []).length;
const groupCount = (previewHtml.match(/<article class="source-group"/g) || []).length;

if (sourceCount < 20 || groupCount < 4) {
  fail(`Refusing to promote because preview has only ${sourceCount} source item(s) and ${groupCount} group(s).`);
}

let liveHtml = fs.readFileSync(livePath, "utf8");
const pattern = /(<section id="texts">[\s\S]*?<div class="source-list">)\s*[\s\S]*?\s*(<\/div>\s*<\/section>\s*<section id="discussion">)/;

if (!pattern.test(liveHtml)) {
  fail("Refusing to promote because the live Source Library section was not found.");
}

const indented = previewHtml.replace(/\n/g, "\n          ");
liveHtml = liveHtml.replace(pattern, `$1\n          ${indented}\n        $2`);
liveHtml = liveHtml.split(/\r?\n/).map((line) => line.replace(/[ \t]+$/g, "")).join("\n");

fs.writeFileSync(livePath, liveHtml, "utf8");

console.log(`Promoted source library into Hot2Trotski.html:`);
console.log(`- ${groupCount} source group(s)`);
console.log(`- ${sourceCount} source item(s)`);
