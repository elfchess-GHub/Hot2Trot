const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const stopsPath = path.join(repoRoot, "data", "timeline-stops.json");
const templatePath = path.join(repoRoot, "templates", "event-room.html");
const outputDir = path.join(repoRoot, "events");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function titleCase(id) {
  return String(id ?? "").replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function laneColor(lane) {
  if (lane === "red") return "var(--red)";
  if (lane === "blue") return "var(--blue)";
  return "#111";
}

function whyMatters(stop) {
  if (stop.lesson?.whyMatters) return stop.lesson.whyMatters;
  return `${stop.timelineTitle} belongs on the road because it connects the big vocabulary to a historical pressure point: what happened, who gained power, who lost power, and which ideas explain the conflict.`;
}

function whatHappened(stop) {
  return stop.lesson?.whatHappened || "Use the source leads below to check the event, vocabulary, and consequences tied to this timeline stop.";
}

function carefulNote(stop) {
  return stop.lesson?.careful || "Keep the claim modest until the source path is checked. Use the source lead to separate what happened, what it means, and what still needs verification.";
}

function renderKeyTerms(terms = []) {
  if (!terms.length) return `<span class="term">Source Check</span><span class="term">Timeline Context</span>`;
  return terms.map((term) => `<span class="term">${escapeHtml(term)}</span>`).join("");
}

function miniCheck(stop) {
  return {
    question: stop.lesson?.miniCheck?.question || `What is the basic reason ${stop.timelineTitle} is on this timeline?`,
    answer: stop.lesson?.miniCheck?.answer || "It connects a historical event to the larger argument of the road: power, ownership, labor, rights, markets, and democracy.",
  };
}

function renderIdeaLinks(ids = []) {
  return ids.map((id) => `<a class="pill" href="../ideas/${escapeHtml(id)}.html">${escapeHtml(titleCase(id))}</a>`).join("");
}

function renderSourceLinks(sources = []) {
  if (!sources.length) return `<div class="source-item"><span class="audit">[needs verification]</span><p class="plain">No source lead is listed yet.</p></div>`;
  return sources.map((source) => {
    return `<div class="source-item"><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.title)}</a><p class="plain">${escapeHtml(source.note || "Source lead for this event room.")}</p><span class="audit">${escapeHtml(source.auditStatus || "[needs verification]")}</span></div>`;
  }).join("");
}

function renderStop(template, stop) {
  const check = miniCheck(stop);
  const replacements = {
    eventTitle: escapeHtml(stop.timelineTitle),
    eventDate: escapeHtml(stop.timelineDate),
    eventLane: escapeHtml(titleCase(stop.lane || "black")),
    eventMeaning: escapeHtml(stop.timelineMeaning),
    laneColor: laneColor(stop.lane),
    auditStatus: escapeHtml(stop.auditStatus || "[needs verification]"),
    whyMatters: escapeHtml(whyMatters(stop)),
    whatHappened: escapeHtml(whatHappened(stop)),
    keyTerms: renderKeyTerms(stop.lesson?.keyTerms),
    careful: escapeHtml(carefulNote(stop)),
    miniQuestion: escapeHtml(check.question),
    miniAnswer: escapeHtml(check.answer),
    ideaLinks: renderIdeaLinks(stop.ideaPills),
    sourceLinks: renderSourceLinks(stop.sources),
    discussionTopic: escapeHtml(stop.discussionTopic || stop.timelineTitle),
  };

  return Object.entries(replacements).reduce((html, [key, value]) => {
    return html.replaceAll(`{{${key}}}`, value);
  }, template);
}

if (!fs.existsSync(stopsPath)) {
  console.error(`Missing timeline stops: ${path.relative(repoRoot, stopsPath)}`);
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  console.error(`Missing template: ${path.relative(repoRoot, templatePath)}`);
  process.exit(1);
}

const stops = JSON.parse(fs.readFileSync(stopsPath, "utf8"));
const template = fs.readFileSync(templatePath, "utf8");
fs.mkdirSync(outputDir, { recursive: true });

const written = [];
for (const stop of stops) {
  if (!stop.id) {
    console.warn(`skipping timeline stop without id: ${stop.timelineTitle || "untitled"}`);
    continue;
  }
  const outputPath = path.join(outputDir, `${stop.id}.html`);
  fs.writeFileSync(outputPath, renderStop(template, stop));
  written.push(path.relative(repoRoot, outputPath));
}

console.log(`${written.length} event room(s) generated`);
for (const file of written) console.log(`- ${file}`);
