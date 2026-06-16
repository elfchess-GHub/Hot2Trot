# Hot2Trotski Hallway Workflow

Locke is the first completed hallway template. Future work should reuse this pattern instead of building one-off pages by hand.

Pattern:

`Main Hall Card -> Figure Study Room -> Idea Rooms -> Source Library Entries -> Badge/Test Hooks -> Discussion Hook -> Audit Labels`

## 1. What a Hallway Is

A hallway is a complete learning chain for one figure, idea, or event.

It starts in the main Hot2Trotski hall, opens into a focused study room, connects to related idea rooms, points back to sources, and leaves working hooks for badges, tests, discussion, and audit status.

## 2. Required Files for a Figure Hallway

Use Locke as the model:

- `figures/locke.html`
- `ideas/property.html`
- `ideas/liberalism.html`
- `ideas/consent.html`
- `ideas/natural-rights.html`

A future figure hallway should have one figure study room plus the idea rooms needed to make that figure's learning chain usable.

Timeline stops that are not people should get event rooms under `events/`.

Example:

- `events/industrial-revolution.html`
- `events/paris-commune.html`
- `events/cold-war.html`

These are not full chapters yet. They are real doors: date, meaning, why it matters, idea doors, source leads, discussion hook, and return links.

## 3. Main Hall Card Requirements

Each main hall card should include:

- date or era
- title
- short meaning
- audit label
- idea pills
- `Open Study Page` link
- `Source Path` link
- `Discuss this` button

Main hall cards should work like doors. If a button or pill appears clickable, it must lead somewhere meaningful or trigger a meaningful placeholder action.

## 4. Figure Room Requirements

Each figure study room should include:

- hero
- why this person is here
- one clean idea
- badge paths
- key terms
- sources
- discussion placeholder
- top return link to `Hot2Trotski.html`
- bottom return link to `Hot2Trotski.html`

Figure rooms should be deep enough to teach the figure's role, but not become the whole book.

## 5. Idea Room Requirements

Each idea room should include:

- plain definition
- why it matters
- related figures
- related ideas
- source/audit status
- top return link to `Hot2Trotski.html`
- bottom return link to `Hot2Trotski.html`

Idea rooms should connect back to the figure hallway and across to sibling ideas.

## 6. Badges and Learning Paths

Badges are learning receipts, not decoration.

The main hall should track these categories separately:

- Idea Badges: earned by opening or studying idea pills.
- Figure Badges: earned by opening figure study rooms or figure cards.
- Path Badges: earned by starting a named learning path.
- Test Badges: earned by answering subject tests correctly.
- Truth Badges: earned by studying truth-check cards.

Each learning path should name:

- the road label
- the political lane color
- the short learning promise
- related ideas
- related figures
- related subject test

Do not add a badge label unless the click does something meaningful.

## 7. Audit Rules

- No fake exact quotes.
- Use `[needs verification]` until exact source passages are pinned.
- Source links must support the nearby claim.
- Dead buttons are not allowed.
- Main page stays a map, not an infinite-scroll book.

If a source is useful but not yet tied to a specific passage, keep the label honest instead of pretending the claim is fully pinned.

## 8. Build Sequence

1. Prepare a hallway packet.
2. Create or update the needed pages.
3. Wire the links from the main hall, figure room, idea rooms, source library, badge hooks, test hooks, and discussion hook.
4. Run a local link check.
5. Run an inline JavaScript syntax check.
6. Report what changed.

The goal is a reusable learning chain: clear doors, honest sources, working navigation, and no unfinished interface pieces pretending to be complete.

## Automation

Use the hallway generator to preview a hallway before touching live pages.

Command:

`node scripts/build_hallway.js data/hallways/locke.json`

Promote command, only after approval:

`node scripts/promote_hallway.js locke`

Process:

1. Write hallway packet JSON.
2. Build preview.
3. Inspect generated preview.
4. Promote only when approved.
5. Run link check.
6. Commit.

The first pass writes generated files to `dist-preview/` so the live site stays untouched until the preview is reviewed.

Promotion is separate on purpose. `build_hallway.js` must not overwrite live pages. `promote_hallway.js` should refuse to run when the expected preview files are missing.

Checker command:

`node scripts/check_hallways.js`

The checker verifies hallway packet fields, expected preview/live files, local links, audit status fields, and obvious dead button candidates.

### Main Hall Timeline Automation

Figure hallway packets can also generate main-hall cards.

Each `data/hallways/*.json` packet should include a `hallCard.sortYear` field. The timeline uses `sortYear` for chronological order; the visible `timelineDate` can stay human-readable, such as `1920s-1953` or `2016+`.

Timeline events that do not yet need full figure rooms belong in:

`data/timeline-stops.json`

Use timeline-only stops for broad historical spine items such as slavery, colonialism, labor movements, welfare states, Cold War language, or present-day word confusion. They still need:

- `sortYear`
- `timelineDate`
- `timelineTitle`
- `timelineMeaning`
- `lane`
- `auditStatus`
- idea pills that point to real idea rooms
- source leads where available
- discussion topic

Build event rooms from timeline-only stops with:

`node scripts/build_event_rooms.js`

Build the main-hall preview with:

`node scripts/build_hall_cards.js`

Promote the generated main-hall cards with:

`node scripts/promote_hall_cards.js`

That command rebuilds `dist-preview/hall-cards.html`, verifies that generated timeline and figure card sections exist, then replaces only the Timeline Road and Figure Gallery sections inside `Hot2Trotski.html`.

### Source Library Automation

The Source Library should be generated from hallway packets and timeline stops, not maintained by hand.

Build the source shelf preview with:

`node scripts/build_source_library.js`

Promote the generated source shelf with:

`node scripts/promote_source_library.js`

That command rebuilds `dist-preview/source-library.html`, verifies that the preview has source groups and source items, then replaces only the Source Library list inside `Hot2Trotski.html`.

Use this whenever source notes or audit labels change in `data/hallways/*.json` or `data/timeline-stops.json`.

### Thought Balloon Automation

Thought balloons live in:

`data/balloons.json`

Each balloon entry should use an `id` that matches a figure id or timeline stop id. Use `type: "exact"` only for short pinned source language. Use `type: "caption"` for Hot2Trotski voice, paraphrase, or comic commentary.

Rules:

- Exact quotes or excerpts need a source title, source URL, and an honest audit status such as `[passage pinned]`.
- Commentary captions should use `[commentary]` and must be visibly labeled under the image as `Hot2Trotski caption, not a quote`.
- Do not put citations inside the bubble. The source or caption label belongs under the image.
- Keep bubble text short enough to fit the picture area.
- Sensitive subjects can be deliberately left without a balloon. Example: Atlantic Slavery and Plantation Capitalism should not use a comic bubble.
- After editing balloons, rebuild hall cards and event rooms, then run link checks and a browser spacing check.
