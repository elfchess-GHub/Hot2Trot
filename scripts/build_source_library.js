const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const hallwayIndexPath = path.join(repoRoot, "data", "hallways", "index.json");
const timelineStopsPath = path.join(repoRoot, "data", "timeline-stops.json");
const previewPath = path.join(repoRoot, "dist-preview", "source-library.html");

const groups = [
  {
    id: "source-foundations",
    title: "Foundations and Liberal Property",
    description: "Locke, Smith, liberal rights, property, consent, and early market language.",
    hallwayIds: ["locke", "smith"],
    stopIds: []
  },
  {
    id: "source-capitalism-ledger",
    title: "Capitalism, Slavery, Empire, Land, and Labor",
    description: "Origins, industrial capitalism, slavery, removal, railroads, settler power, racial capitalism, labor, and capitalist damage accounting.",
    hallwayIds: ["jackson", "rockefeller", "morgan"],
    stopIds: [
      "enclosure-primitive-accumulation",
      "atlantic-slavery-plantation-capitalism",
      "colonial-extraction-empire",
      "industrial-revolution",
      "labor-movement-unions",
      "civil-rights-racial-capitalism-housing"
    ]
  },
  {
    id: "source-socialist-texts",
    title: "Socialist and Marxist Primary Texts",
    description: "Marx, Engels, Debs, Bernstein, Kautsky, Luxemburg, Trotsky, and socialist vocabulary sources.",
    hallwayIds: ["marx", "engels", "bernstein", "kautsky", "debs", "trotsky", "luxemburg"],
    stopIds: ["utopian-socialists", "revolutions-of-1848", "paris-commune"]
  },
  {
    id: "source-state-power",
    title: "Revolution, Soviet State Power, and Authoritarian Danger",
    description: "Lenin, Stalin, Mao, Cold War vocabulary, Soviet collapse, party-state power, planning, and dissent.",
    hallwayIds: ["lenin", "stalin", "mao", "orwell"],
    stopIds: ["cold-war", "fall-of-soviet-union"]
  },
  {
    id: "source-democratic-public",
    title: "Democratic Socialism, Welfare States, and Public Goods",
    description: "Public goods, social democracy, welfare states, Social Security, taxes, health care, and modern U.S. democratic socialism.",
    hallwayIds: ["keynes", "sanders"],
    stopIds: ["new-deal-social-security-labor-law", "social-democracy-welfare-states", "present-day-word-confusion"]
  },
  {
    id: "source-market-liberalism",
    title: "Market Liberalism, Austrian Economics, Libertarianism",
    description: "Hayek, Friedman, Mises, Rand, Nozick, price signals, monetarism, calculation, objectivism, and libertarian rights.",
    hallwayIds: ["mises", "rand", "hayek", "friedman", "nozick"],
    stopIds: ["neoliberal-turn"]
  },
  {
    id: "source-modern-capitalism",
    title: "Modern Capitalism Figures and Institutions",
    description: "Buffett, Gates, Musk, Trump, corporations, antitrust, philanthropy, state contracts, and platform power.",
    hallwayIds: ["buffett", "gates", "musk", "trump"],
    stopIds: []
  },
  {
    id: "source-topic-overviews",
    title: "Topic Overviews and Image Sources",
    description: "General overview pages, portraits, and broad topic shelves used for orientation or images.",
    hallwayIds: [],
    stopIds: ["french-revolution-rights-property"]
  }
];

const auditRank = new Map([
  ["[needs verification]", 0],
  ["[source lead checked]", 1],
  ["[source supports this]", 2],
  ["[passage pinned]", 3]
]);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function sourceTag(source) {
  const title = source.title || "";
  const url = source.url || "";
  if (/gutenberg|wikisource|marxists|orwellfoundation|econlib|hoover|senate\.gov/i.test(url)) return "Primary text";
  if (/justice\.gov|sec\.gov|nasa\.gov|federalreserve|ftc\.gov/i.test(url)) return "Government / institutional";
  if (/britannica|stanford|plato\.stanford|iep\.utm/i.test(url)) return "Reference source";
  if (/forbes/i.test(url)) return "Profile source";
  if (/wikipedia/i.test(url) && /\/wiki\/[A-Z][^/]+/.test(url)) return "Topic / image lead";
  if (/Objectivism|Institute|ARI/i.test(title + " " + url)) return "Advocacy / movement source";
  return "Source lead";
}

function mergeSource(existing, incoming) {
  if (!existing) return { ...incoming };
  const oldRank = auditRank.get(existing.auditStatus) ?? 0;
  const newRank = auditRank.get(incoming.auditStatus) ?? 0;
  if (newRank > oldRank) existing.auditStatus = incoming.auditStatus;
  if ((incoming.note || "").length > (existing.note || "").length) existing.note = incoming.note;
  if (!existing.title || incoming.title.length < existing.title.length) existing.title = incoming.title;
  return existing;
}

function collectPacketSources(packet, bucket) {
  for (const source of packet.figure?.sources || []) addSource(bucket, source);
  for (const idea of packet.ideas || []) {
    for (const source of idea.sources || []) addSource(bucket, source);
  }
}

function addSource(bucket, source) {
  if (!source?.url) return;
  const key = source.url.trim();
  const clean = {
    title: source.title || key,
    url: key,
    note: source.note || "Source lead for this hallway.",
    auditStatus: source.auditStatus || "[needs verification]"
  };
  bucket.set(key, mergeSource(bucket.get(key), clean));
}

function renderItem(source) {
  const auditClass = source.auditStatus === "[needs verification]" ? "audit-label" : "audit-label ok";
  return `<article class="source-item"><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">${escapeHtml(source.title)}</a><p><span class="source-tag">${escapeHtml(sourceTag(source))}</span> <span class="${auditClass}">${escapeHtml(source.auditStatus)}</span> ${escapeHtml(source.note)}</p></article>`;
}

function renderGroup(group, sources) {
  const items = [...sources.values()].sort((a, b) => a.title.localeCompare(b.title));
  return [
    `<article class="source-group" id="${escapeHtml(group.id)}"><h3>${escapeHtml(group.title)}</h3><p>${escapeHtml(group.description)} ${items.length} source item(s).</p></article>`,
    ...items.map(renderItem)
  ].join("\n          ");
}

if (!fs.existsSync(hallwayIndexPath)) {
  console.error(`Missing hallway index: ${path.relative(repoRoot, hallwayIndexPath)}`);
  process.exit(1);
}

if (!fs.existsSync(timelineStopsPath)) {
  console.error(`Missing timeline stops: ${path.relative(repoRoot, timelineStopsPath)}`);
  process.exit(1);
}

const hallwayIds = readJson(hallwayIndexPath);
const packets = new Map();
for (const id of hallwayIds) {
  const packetPath = path.join(repoRoot, "data", "hallways", `${id}.json`);
  if (fs.existsSync(packetPath)) packets.set(id, readJson(packetPath));
}

const timelineStops = new Map(readJson(timelineStopsPath).map((stop) => [stop.id, stop]));

const indexHtml = `<div class="source-index">${groups.map((group) => `<a class="pill source" href="#${escapeHtml(group.id)}">${escapeHtml(group.title)}</a>`).join("")}</div>`;

const groupHtml = groups.map((group) => {
  const bucket = new Map();
  for (const id of group.hallwayIds) {
    const packet = packets.get(id);
    if (packet) collectPacketSources(packet, bucket);
  }
  for (const id of group.stopIds) {
    const stop = timelineStops.get(id);
    for (const source of stop?.sources || []) addSource(bucket, source);
  }
  return renderGroup(group, bucket);
});

const output = [
  "<!-- Generated source library preview. Promote with scripts/promote_source_library.js after inspection. -->",
  indexHtml,
  ...groupHtml,
  ""
].join("\n          ");

fs.mkdirSync(path.dirname(previewPath), { recursive: true });
fs.writeFileSync(previewPath, output, "utf8");

const sourceCount = (output.match(/<article class="source-item">/g) || []).length;
console.log(`${sourceCount} source item(s) generated`);
console.log(`preview file: ${path.relative(repoRoot, previewPath)}`);
