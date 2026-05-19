const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const livePath = path.join(repoRoot, "Hot2Trotski.html");
const previewPath = path.join(repoRoot, "dist-preview", "hall-cards.html");
const buildScript = path.join(repoRoot, "scripts", "build_hall_cards.js");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function extractPreviewSections(previewHtml) {
  const timeline = previewHtml.match(/<!-- Timeline Cards -->\s*([\s\S]*?)\s*<!-- Figure Cards -->/)?.[1]?.trim();
  const figures = previewHtml.match(/<!-- Figure Cards -->\s*([\s\S]*)$/)?.[1]?.trim();
  return { timeline, figures };
}

function countCards(html, className) {
  const pattern = new RegExp(`<article class="${className} `, "g");
  return (html.match(pattern) || []).length;
}

const build = spawnSync(process.execPath, [buildScript], {
  cwd: repoRoot,
  encoding: "utf8"
});

if (build.stdout) process.stdout.write(build.stdout);
if (build.stderr) process.stderr.write(build.stderr);
if (build.status !== 0) {
  fail(`Refusing to promote because build_hall_cards.js failed with exit code ${build.status}.`);
}

if (!fs.existsSync(previewPath)) {
  fail(`Refusing to promote because preview file is missing: ${path.relative(repoRoot, previewPath)}`);
}

if (!fs.existsSync(livePath)) {
  fail(`Refusing to promote because live page is missing: ${path.relative(repoRoot, livePath)}`);
}

const previewHtml = fs.readFileSync(previewPath, "utf8");
const { timeline, figures } = extractPreviewSections(previewHtml);

if (!timeline || !figures) {
  fail(`Refusing to promote because preview file is missing Timeline Cards or Figure Cards sections.`);
}

const timelineCount = countCards(timeline, "stop");
const figureCount = countCards(figures, "card");

if (timelineCount === 0 || figureCount === 0) {
  fail(`Refusing to promote because preview has ${timelineCount} timeline card(s) and ${figureCount} figure card(s).`);
}

let liveHtml = fs.readFileSync(livePath, "utf8");

const timelinePattern = /(<section id="timeline">[\s\S]*?<div class="timeline-road">)\s*[\s\S]*?\s*(<\/div>\s*<\/section>\s*<section id="figures">)/;
const figuresPattern = /(<section id="figures">[\s\S]*?<div class="grid">)\s*[\s\S]*?\s*(<\/div>\s*<\/section>\s*<section id="ideas">)/;

if (!timelinePattern.test(liveHtml)) {
  fail(`Refusing to promote because the live Timeline Road section was not found.`);
}

if (!figuresPattern.test(liveHtml)) {
  fail(`Refusing to promote because the live Figure Gallery section was not found.`);
}

const indent = (html, spaces) => html.replace(/\n/g, `\n${" ".repeat(spaces)}`);

liveHtml = liveHtml.replace(timelinePattern, `$1\n          ${indent(timeline, 10)}\n        $2`);
liveHtml = liveHtml.replace(figuresPattern, `$1\n          ${indent(figures, 10)}\n        $2`);
liveHtml = liveHtml.split(/\r?\n/).map((line) => line.replace(/[ \t]+$/g, "")).join("\n");

fs.writeFileSync(livePath, liveHtml, "utf8");

console.log(`Promoted main hall cards into Hot2Trotski.html:`);
console.log(`- ${timelineCount} timeline card(s)`);
console.log(`- ${figureCount} figure card(s)`);
