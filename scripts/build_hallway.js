const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const inputPath = process.argv[2];
const outputRoot = path.join(repoRoot, "dist-preview");

if (!inputPath) {
  console.error("Usage: node scripts/build_hallway.js data/hallways/locke.json");
  process.exit(1);
}

const packetPath = path.resolve(repoRoot, inputPath);
const packet = JSON.parse(fs.readFileSync(packetPath, "utf8"));
const figureTemplate = fs.readFileSync(path.join(repoRoot, "templates", "figure-room.html"), "utf8");
const ideaTemplate = fs.readFileSync(path.join(repoRoot, "templates", "idea-room.html"), "utf8");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function render(template, values) {
  return template.replace(/\{\{([a-zA-Z0-9]+)\}\}/g, (_, key) => {
    if (!(key in values)) {
      throw new Error(`Missing template value: ${key}`);
    }
    return values[key];
  });
}

function writeFile(relativePath, content) {
  const outPath = path.join(outputRoot, relativePath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, "utf8");
  return outPath;
}

function firstName(fullName) {
  return String(fullName).split(/\s+/).pop();
}

function ideaTitle(id) {
  const idea = packet.ideas.find((item) => item.id === id);
  return idea ? idea.title : id;
}

function renderSources(sources, block = true) {
  if (block) {
    return sources.map((source) => {
      const note = source.note ? ` ${escapeHtml(source.note)}` : "";
      return `<div class="source-item"><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.title)}</a><p><span class="audit-label">${escapeHtml(source.auditStatus)}</span>${note}</p></div>`;
    }).join("\n        ");
  }

  return sources.map((source) => {
    const note = source.note ? ` ${escapeHtml(source.note)}` : "";
    return `<p><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.title)}</a> <span class="audit">${escapeHtml(source.auditStatus)}</span>${note}</p>`;
  }).join("\n      ");
}

function buildFigure() {
  const figure = packet.figure;
  const html = render(figureTemplate, {
    figureName: escapeHtml(figure.name),
    shortName: escapeHtml(firstName(figure.name)),
    dates: escapeHtml(figure.dates),
    topic: escapeHtml(figure.topic),
    era: escapeHtml(figure.era),
    role: escapeHtml(figure.role),
    wikiPage: escapeHtml(figure.wikiPage),
    whyHere: figure.whyHere.map((text) => `<p>${escapeHtml(text)}</p>`).join("\n      "),
    cleanIdea: escapeHtml(figure.cleanIdea),
    badgeLinks: figure.badgePaths.map((badge) => `<a class="badge" href="../ideas/${escapeHtml(badge.ideaId)}.html">${escapeHtml(badge.label)}</a>`).join("\n        "),
    keyTerms: figure.keyTerms.map((term) => `<div class="term">${escapeHtml(term)}</div>`).join(""),
    sources: renderSources(figure.sources, true),
    discussionText: escapeHtml(figure.discussionText)
  });
  return writeFile(path.join("figures", `${figure.id}.html`), html);
}

function buildIdea(idea) {
  const relatedFigureLinks = idea.relatedFigures.map((figure) => {
    return `<a class="pill" href="../figures/${escapeHtml(figure.id)}.html">${escapeHtml(figure.label)}</a>`;
  });
  const relatedIdeaLinks = idea.relatedIdeas.map((id) => {
    return `<a class="pill" href="${escapeHtml(id)}.html">${escapeHtml(ideaTitle(id))}</a>`;
  });
  const html = render(ideaTemplate, {
    ideaTitle: escapeHtml(idea.title),
    shortName: escapeHtml(firstName(packet.figure.name)),
    plainDefinition: escapeHtml(idea.plainDefinition),
    context: escapeHtml(idea.context),
    whyMatters: escapeHtml(idea.whyMatters),
    relatedLinks: [...relatedFigureLinks, ...relatedIdeaLinks].join(""),
    sources: renderSources(idea.sources, false)
  });
  return writeFile(path.join("ideas", `${idea.id}.html`), html);
}

const written = [buildFigure(), ...packet.ideas.map(buildIdea)];

console.log(`Generated ${written.length} file(s) into ${path.relative(repoRoot, outputRoot)}:`);
for (const file of written) {
  console.log(`- ${path.relative(repoRoot, file)}`);
}
