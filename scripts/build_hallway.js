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
const hallwayIndex = JSON.parse(fs.readFileSync(path.join(repoRoot, "data", "hallways", "index.json"), "utf8"));

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

function termId(term) {
  return String(term)
    .toLowerCase()
    .replace(/&amp;/g, " and ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function existingIdeaIds() {
  const ids = new Set();
  const ideasDir = path.join(repoRoot, "ideas");
  if (fs.existsSync(ideasDir)) {
    for (const file of fs.readdirSync(ideasDir)) {
      if (file.endsWith(".html")) ids.add(path.basename(file, ".html"));
    }
  }
  for (const hallwayId of hallwayIndex) {
    const file = path.join(repoRoot, "data", "hallways", `${hallwayId}.json`);
    if (!fs.existsSync(file)) continue;
    const hallway = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const idea of hallway.ideas || []) {
      ids.add(idea.id);
    }
  }
  return ids;
}

function ideaTitle(id) {
  const idea = packet.ideas.find((item) => item.id === id);
  return idea ? idea.title : id;
}

function laneColor() {
  const lane = packet.hallCard?.lane || packet.figure?.lane || "blue";
  return {
    red: "#d33a32",
    blue: "#2f74d0",
    black: "#050608"
  }[lane] || "#2f74d0";
}

function sourceNote(source) {
  const note = String(source.note || "").trim();
  if (/^Topic summary and image pathway\.?$/i.test(note)) {
    return "Image and basic biography source lead; core claims use the primary and reference sources listed beside it.";
  }
  return note;
}

function renderSources(sources, block = true) {
  if (block) {
    return sources.map((source) => {
      const noteText = sourceNote(source);
      const note = noteText ? ` ${escapeHtml(noteText)}` : "";
      return `<div class="source-item"><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.title)}</a><p><span class="audit-label">${escapeHtml(source.auditStatus)}</span>${note}</p></div>`;
    }).join("\n        ");
  }

  return sources.map((source) => {
    const noteText = sourceNote(source);
    const note = noteText ? ` ${escapeHtml(noteText)}` : "";
    return `<p><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.title)}</a> <span class="audit">${escapeHtml(source.auditStatus)}</span>${note}</p>`;
  }).join("\n      ");
}

function renderExtraSections(idea) {
  const sections = [];

  if (idea.carefulVersion) {
    sections.push(`<section class="panel">
      <h2>Where It Gets Tricky</h2>
      <p class="plain">${escapeHtml(idea.carefulVersion)}</p>
    </section>`);
  }

  if (Array.isArray(idea.keyTerms) && idea.keyTerms.length) {
    const terms = idea.keyTerms.map((term) => `<span class="pill">${escapeHtml(term)}</span>`).join("");
    sections.push(`<section class="panel">
      <h2>Key Terms</h2>
      ${terms}
    </section>`);
  }

  return sections.join("\n    ");
}

const knownIdeaIds = existingIdeaIds();
const packetIdeaIds = new Set((packet.ideas || []).map((idea) => idea.id));
const previewIdeaDependencies = new Set();

const keyTermAliases = {
  "accountability": "democracy",
  "anti-collectivism": "objectivism",
  "anti-war-prosecution": "labor-politics",
  "atlas-shrugged": "objectivism",
  "berkshire-hathaway": "investment-capital",
  "bolshevism": "vanguard-party",
  "bourgeoisie": "class-struggle",
  "brand-licensing": "brand-politics",
  "capital": "capitalism",
  "central-banking": "monetarism",
  "chinese-revolution": "maoism",
  "class-antagonism": "class-struggle",
  "class-solidarity": "class-struggle",
  "collectivization": "central-planning",
  "commercial-society": "market",
  "compounding": "investment-capital",
  "corporate-ownership": "shareholder-power",
  "credit": "finance-capital",
  "debt": "finance-capital",
  "demand": "fiscal-policy",
  "democratic-centralism": "vanguard-party",
  "dictatorship-of-the-proletariat": "dictatorship-debate",
  "dissent": "democratic-dissent",
  "elections": "democracy",
  "entitlement-theory": "private-property",
  "euphemism": "political-language",
  "exchange": "market",
  "factory-system": "industrial-capitalism",
  "federal-reserve": "finance-capital",
  "global-health": "philanthropy-capital",
  "gold-standard": "monetarism",
  "gradualism": "democratic-reform",
  "health-care": "public-goods",
  "historical-materialism": "class-struggle",
  "imperialism": "colonialism",
  "indian-removal-act": "removal-policy",
  "individual-rights": "liberalism",
  "industrial-consolidation": "monopoly-power",
  "industrialization": "industrial-capitalism",
  "inequality": "capitalism",
  "information": "knowledge-problem",
  "inheritance": "private-property",
  "insurance-float": "investment-capital",
  "intellectual-property": "private-property",
  "internationalism": "permanent-revolution",
  "j-p-morgan-and-co": "finance-capital",
  "jacksonian-democracy": "democracy",
  "labor-rights": "labor",
  "laissez-faire-capitalism": "laissez-faire",
  "land-reform": "land-dispossession",
  "lenin-debate": "dictatorship-debate",
  "limited-dissent": "democratic-dissent",
  "limited-government": "liberalism",
  "long-run": "fiscal-policy",
  "market-prices": "price-signals",
  "marxism-leninism": "vanguard-party",
  "marxist-collaboration": "scientific-socialism",
  "media-spectacle": "brand-politics",
  "microsoft": "software-monopoly",
  "money-supply": "monetarism",
  "moral-philosophy": "natural-liberty",
  "movement": "reform",
  "network-effects": "monopoly-power",
  "oil-refining": "oil-capital",
  "panic-of-1907": "panic-management",
  "parliament": "democracy",
  "participation": "democracy",
  "party": "party-state",
  "party-organization": "vanguard-party",
  "party-power": "party-state",
  "party-rule": "party-state",
  "philanthropy": "philanthropy-capital",
  "plain-speech": "political-language",
  "planning": "planned-economy",
  "political-economy": "market",
  "political-office": "political-capitalism",
  "private-philanthropy": "philanthropy-capital",
  "proletariat": "working-class",
  "property-rights": "property",
  "public-accountability": "democracy",
  "public-truth": "political-language",
  "railroad-rebates": "railroad-capitalism",
  "railroad-reorganization": "finance-capital",
  "railroads": "railroad-capitalism",
  "real-estate": "real-estate-capital",
  "redistribution": "public-spending",
  "reform-or-revolution": "revolution",
  "second-international": "social-democracy",
  "securities-regulation": "state-contracts",
  "security-institutions": "state-violence",
  "self-interest": "natural-liberty",
  "settler-expansion": "settler-state",
  "slavery": "plantation-capitalism",
  "social-contract": "consent",
  "socialism-critique": "economic-calculation",
  "sovereignty": "state-power",
  "soviet-state": "state-power",
  "soviet-union": "party-state",
  "spacex": "state-contracts",
  "specialization": "division-of-labor",
  "speech": "political-language",
  "spontaneous-order": "market-coordination",
  "stabilization": "fiscal-policy",
  "standard-oil": "oil-capital",
  "stock-wealth": "investment-capital",
  "taxation": "public-spending",
  "tesla": "state-contracts",
  "the-fountainhead": "objectivism",
  "trail-of-tears": "removal-policy",
  "trade-unions": "unionism",
  "trust": "trust-power",
  "unemployment": "fiscal-policy",
  "utopian-socialism": "socialism",
  "value-investing": "investment-capital",
  "working-class-action": "labor-politics",
  "x-twitter": "attention-platform"
};

function renderKeyTerm(term) {
  const id = termId(term);
  const targetId = knownIdeaIds.has(id) ? id : keyTermAliases[id];
  if (targetId && knownIdeaIds.has(targetId)) {
    if (!packetIdeaIds.has(targetId)) {
      const liveIdeaPath = path.join(repoRoot, "ideas", `${targetId}.html`);
      if (fs.existsSync(liveIdeaPath)) previewIdeaDependencies.add(targetId);
    }
    return `<a class="term" href="../ideas/${escapeHtml(targetId)}.html">${escapeHtml(term)}</a>`;
  }
  return `<a class="term" href="../Hot2Trotski.html#ideas" title="Open the idea atlas for this term">${escapeHtml(term)}</a>`;
}

function copyPreviewIdeaDependency(id) {
  const sourcePath = path.join(repoRoot, "ideas", `${id}.html`);
  const outPath = path.join(outputRoot, "ideas", `${id}.html`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.copyFileSync(sourcePath, outPath);
  return outPath;
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
    laneColor: laneColor(),
    whyHere: figure.whyHere.map((text) => `<p>${escapeHtml(text)}</p>`).join("\n      "),
    cleanIdea: escapeHtml(figure.cleanIdea),
    badgeLinks: figure.badgePaths.map((badge) => `<a class="badge" href="../ideas/${escapeHtml(badge.ideaId)}.html">${escapeHtml(badge.label)}</a>`).join("\n        "),
    keyTerms: figure.keyTerms.map(renderKeyTerm).join(""),
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
    laneColor: laneColor(),
    plainDefinition: escapeHtml(idea.plainDefinition),
    context: escapeHtml(idea.context),
    whyMatters: escapeHtml(idea.whyMatters),
    extraSections: renderExtraSections(idea),
    relatedLinks: [...relatedFigureLinks, ...relatedIdeaLinks].join(""),
    sources: renderSources(idea.sources, false)
  });
  return writeFile(path.join("ideas", `${idea.id}.html`), html);
}

const written = [
  buildFigure(),
  ...packet.ideas.map(buildIdea),
  ...[...previewIdeaDependencies].map(copyPreviewIdeaDependency)
];

console.log(`Generated ${written.length} file(s) into ${path.relative(repoRoot, outputRoot)}:`);
for (const file of written) {
  console.log(`- ${path.relative(repoRoot, file)}`);
}
