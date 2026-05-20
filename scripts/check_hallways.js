const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const indexPath = path.join(repoRoot, "data", "hallways", "index.json");
const timelineStopsPath = path.join(repoRoot, "data", "timeline-stops.json");
const errors = [];
const warnings = [];

function readJson(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`missing file: ${relativePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    errors.push(`invalid json: ${relativePath}: ${error.message}`);
    return null;
  }
}

function requireField(object, field, label) {
  if (object?.[field] === undefined || object?.[field] === "") {
    errors.push(`missing ${label}.${field}`);
  }
}

function checkSources(sources, label) {
  if (!Array.isArray(sources) || sources.length === 0) {
    warnings.push(`no sources listed: ${label}`);
    return;
  }
  sources.forEach((source, index) => {
    requireField(source, "title", `${label}.sources[${index}]`);
    requireField(source, "url", `${label}.sources[${index}]`);
    requireField(source, "auditStatus", `${label}.sources[${index}]`);
  });
}

function checkLocalLinks(relativePath, options = {}) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`missing generated file: ${relativePath}`);
    return;
  }

  const text = fs.readFileSync(fullPath, "utf8");
  for (const match of text.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|#)/.test(href) || href.includes("${")) continue;
    if (options.ignoreHallBackLink && href.startsWith("../Hot2Trotski.html")) continue;

    const [target] = href.split("#");
    if (!target) continue;
    const linkBase = options.rootRelativeLinks ? repoRoot : path.dirname(fullPath);
    const resolved = path.resolve(linkBase, target);
    const liveIdeaFallback = relativePath.startsWith("dist-preview/ideas/")
      ? path.join(repoRoot, "ideas", target)
      : null;
    if (!fs.existsSync(resolved) && !(liveIdeaFallback && fs.existsSync(liveIdeaFallback))) {
      errors.push(`broken local link: ${relativePath} -> ${href}`);
    }
  }

  for (const match of text.matchAll(/<button\b([^>]*)>/gi)) {
    const attrs = match[1];
    const hasMainHallHook = options.allowMainHallButtons && /class="[^"]*\b(source|discuss|test|figure)\b/.test(attrs);
    const hasAction = /onclick=|disabled|data-/.test(attrs) || hasMainHallHook;
    if (!hasAction) {
      errors.push(`dead button candidate: ${relativePath}: <button${attrs}>`);
    }
  }
}

const hallwayIds = readJson(path.relative(repoRoot, indexPath)) || [];
if (!Array.isArray(hallwayIds) || hallwayIds.length === 0) {
  errors.push("data/hallways/index.json must be a non-empty array");
}

for (const id of hallwayIds) {
  const packetPath = `data/hallways/${id}.json`;
  const packet = readJson(packetPath);
  if (!packet) continue;

  requireField(packet.figure, "id", `${packetPath}.figure`);
  requireField(packet.figure, "name", `${packetPath}.figure`);
  requireField(packet.figure, "dates", `${packetPath}.figure`);
  requireField(packet.figure, "topic", `${packetPath}.figure`);
  requireField(packet.figure, "era", `${packetPath}.figure`);
  requireField(packet.figure, "role", `${packetPath}.figure`);
  requireField(packet.figure, "hook", `${packetPath}.figure`);
  requireField(packet.figure, "cleanIdea", `${packetPath}.figure`);
  checkSources(packet.figure?.sources, `${packetPath}.figure`);

  if (!packet.hallCard) {
    errors.push(`missing hallCard: ${packetPath}`);
  } else {
    requireField(packet.hallCard, "timelineDate", `${packetPath}.hallCard`);
    requireField(packet.hallCard, "timelineTitle", `${packetPath}.hallCard`);
    requireField(packet.hallCard, "timelineMeaning", `${packetPath}.hallCard`);
    requireField(packet.hallCard, "lane", `${packetPath}.hallCard`);
    requireField(packet.hallCard, "auditStatus", `${packetPath}.hallCard`);
    if (!Array.isArray(packet.hallCard.ideaPills) || packet.hallCard.ideaPills.length === 0) {
      errors.push(`missing ${packetPath}.hallCard.ideaPills`);
    }
  }

  const ideas = packet.ideas || [];
  if (!Array.isArray(ideas) || ideas.length === 0) {
    warnings.push(`no idea rooms listed: ${packetPath}`);
  }

  checkLocalLinks(`figures/${packet.figure.id}.html`);
  checkLocalLinks(`dist-preview/figures/${packet.figure.id}.html`, { ignoreHallBackLink: true });

  for (const idea of ideas) {
    requireField(idea, "id", `${packetPath}.ideas[]`);
    requireField(idea, "title", `${packetPath}.ideas.${idea.id}`);
    requireField(idea, "plainDefinition", `${packetPath}.ideas.${idea.id}`);
    requireField(idea, "whyMatters", `${packetPath}.ideas.${idea.id}`);
    checkSources(idea.sources, `${packetPath}.ideas.${idea.id}`);

    checkLocalLinks(`ideas/${idea.id}.html`);
    checkLocalLinks(`dist-preview/ideas/${idea.id}.html`, { ignoreHallBackLink: true });
  }
}

checkLocalLinks("dist-preview/hall-cards.html", { allowMainHallButtons: true, rootRelativeLinks: true });

const timelineStops = readJson(path.relative(repoRoot, timelineStopsPath)) || [];
if (Array.isArray(timelineStops)) {
  for (const stop of timelineStops) {
    requireField(stop, "id", "data/timeline-stops.json[]");
    requireField(stop, "timelineTitle", `data/timeline-stops.json.${stop.id || "unknown"}`);
    requireField(stop, "timelineMeaning", `data/timeline-stops.json.${stop.id || "unknown"}`);
    requireField(stop, "auditStatus", `data/timeline-stops.json.${stop.id || "unknown"}`);
    if (!Array.isArray(stop.ideaPills) || stop.ideaPills.length === 0) {
      errors.push(`missing data/timeline-stops.json.${stop.id || "unknown"}.ideaPills`);
    }
    if (stop.id) checkLocalLinks(`events/${stop.id}.html`);
  }
} else {
  errors.push("data/timeline-stops.json must be an array");
}

if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
  console.error("Hallway check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Hallway check passed for ${hallwayIds.length} hallway packet(s).`);
