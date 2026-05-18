const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const indexPath = path.join(repoRoot, "data", "hallways", "index.json");
const previewPath = path.join(repoRoot, "dist-preview", "hall-cards.html");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ideaLabel(packet, id) {
  const idea = packet.ideas.find((item) => item.id === id);
  return idea ? idea.title : id.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function ideaDataName(id) {
  return id.replace(/-/g, " ");
}

function renderIdeaPills(packet) {
  return packet.hallCard.ideaPills.map((id) => {
    const label = ideaLabel(packet, id);
    return `<a class="pill idea" data-idea="${escapeHtml(ideaDataName(id))}" href="ideas/${escapeHtml(id)}.html">${escapeHtml(label)}</a>`;
  }).join("");
}

function renderTimelineCard(packet) {
  const figure = packet.figure;
  const card = packet.hallCard;
  const ideaPills = renderIdeaPills(packet);
  const auditClass = card.auditStatus === "[needs verification]" ? "audit-label" : "audit-label ok";
  return `<article class="stop ${escapeHtml(card.lane)}"><div class="date-medal">${escapeHtml(card.timelineDate)}</div><a class="photo-link" href="figures/${escapeHtml(figure.id)}.html"><div class="photo" data-wiki="${escapeHtml(figure.wikiPage)}">Loading Wiki image</div></a><div><h3><a href="figures/${escapeHtml(figure.id)}.html">${escapeHtml(card.timelineTitle)}</a></h3><p>${escapeHtml(card.timelineMeaning)}</p><span class="${auditClass}">${escapeHtml(card.auditStatus)}</span><div class="link-cloud">${ideaPills}<button class="pill source">Source Path</button><a class="pill figure" href="figures/${escapeHtml(figure.id)}.html">Open Study Page</a><button class="pill discuss" data-topic="${escapeHtml(figure.name)}">Discuss this</button></div></div></article>`;
}

function renderFigureCard(packet) {
  const figure = packet.figure;
  const card = packet.hallCard;
  const ideaPills = renderIdeaPills(packet);
  const auditClass = card.auditStatus === "[needs verification]" ? "audit-label" : "audit-label ok";
  const source = figure.sources[0];
  const sourceLink = source
    ? `<br><a class="pill source" href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${source.auditStatus === "[needs verification]" ? "Source lead" : "Verified source"}: ${escapeHtml(source.title)}</a>`
    : "";
  return `<article class="card ${escapeHtml(card.lane)}"><a class="photo-link" href="figures/${escapeHtml(figure.id)}.html"><div class="photo" data-wiki="${escapeHtml(figure.wikiPage)}">Loading Wiki image</div></a><div class="card-body"><h3><a href="figures/${escapeHtml(figure.id)}.html">${escapeHtml(figure.name)}</a></h3><div class="meta">${escapeHtml(figure.dates)} | ${escapeHtml(figure.topic)} | ${escapeHtml(figure.era.toLowerCase())}</div><p class="hook">${escapeHtml(figure.hook)}</p><p class="quote-needed">Role: ${escapeHtml(figure.role)}${sourceLink}</p><span class="${auditClass}">${escapeHtml(card.auditStatus)}</span><div class="link-cloud">${ideaPills}<a class="pill figure" href="figures/${escapeHtml(figure.id)}.html">Open Study Page</a><button class="pill discuss" data-topic="${escapeHtml(figure.name)}">Discuss this</button></div></div></article>`;
}

if (!fs.existsSync(indexPath)) {
  console.error(`Missing hallway index: ${path.relative(repoRoot, indexPath)}`);
  process.exit(1);
}

const hallwayIds = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const timelineCards = [];
const figureCards = [];
const warnings = [];

for (const id of hallwayIds) {
  const packetPath = path.join(repoRoot, "data", "hallways", `${id}.json`);
  if (!fs.existsSync(packetPath)) {
    warnings.push(`missing packet: ${id}`);
    continue;
  }

  const packet = JSON.parse(fs.readFileSync(packetPath, "utf8"));
  if (!packet.hallCard) {
    warnings.push(`missing hallCard: ${id}`);
    continue;
  }

  timelineCards.push(renderTimelineCard(packet));
  figureCards.push(renderFigureCard(packet));
}

const output = [
  "<!-- Generated main hall card preview. Do not paste blindly; inspect first. -->",
  "",
  "<!-- Timeline Cards -->",
  ...timelineCards,
  "",
  "<!-- Figure Cards -->",
  ...figureCards,
  ""
].join("\n");

fs.mkdirSync(path.dirname(previewPath), { recursive: true });
fs.writeFileSync(previewPath, output, "utf8");

const cardCount = timelineCards.length + figureCards.length;
console.log(`${cardCount} hallway cards generated`);
if (warnings.length) {
  console.log("missing hallCard warnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
} else {
  console.log("missing hallCard warnings: none");
}
console.log(`preview file: ${path.relative(repoRoot, previewPath)}`);
