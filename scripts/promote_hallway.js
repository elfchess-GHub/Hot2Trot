const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const hallwayId = process.argv[2];

if (!hallwayId) {
  console.error("Usage: node scripts/promote_hallway.js locke");
  process.exit(1);
}

const packetPath = path.join(repoRoot, "data", "hallways", `${hallwayId}.json`);
if (!fs.existsSync(packetPath)) {
  console.error(`Missing hallway packet: ${path.relative(repoRoot, packetPath)}`);
  process.exit(1);
}

const packet = JSON.parse(fs.readFileSync(packetPath, "utf8"));
const figureId = packet.figure?.id;
if (!figureId) {
  console.error(`Hallway packet has no figure.id: ${path.relative(repoRoot, packetPath)}`);
  process.exit(1);
}

if (figureId !== hallwayId) {
  console.error(`Hallway id mismatch: command asked for "${hallwayId}" but packet figure.id is "${figureId}"`);
  process.exit(1);
}

const expected = [
  {
    from: path.join("dist-preview", "figures", `${figureId}.html`),
    to: path.join("figures", `${figureId}.html`)
  },
  ...packet.ideas.map((idea) => ({
    from: path.join("dist-preview", "ideas", `${idea.id}.html`),
    to: path.join("ideas", `${idea.id}.html`)
  }))
];

const missing = expected.filter((file) => !fs.existsSync(path.join(repoRoot, file.from)));
if (missing.length > 0) {
  console.error("Refusing to promote because expected preview files are missing:");
  for (const file of missing) {
    console.error(`- ${file.from}`);
  }
  console.error(`Run: node scripts/build_hallway.js data/hallways/${hallwayId}.json`);
  process.exit(1);
}

for (const file of expected) {
  const fromPath = path.join(repoRoot, file.from);
  const toPath = path.join(repoRoot, file.to);
  fs.mkdirSync(path.dirname(toPath), { recursive: true });
  fs.copyFileSync(fromPath, toPath);
}

console.log(`Promoted ${expected.length} file(s) for hallway "${hallwayId}":`);
for (const file of expected) {
  console.log(`- ${file.from} -> ${file.to}`);
}
