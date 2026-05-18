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

## 6. Audit Rules

- No fake exact quotes.
- Use `[needs verification]` until exact source passages are pinned.
- Source links must support the nearby claim.
- Dead buttons are not allowed.
- Main page stays a map, not an infinite-scroll book.

If a source is useful but not yet tied to a specific passage, keep the label honest instead of pretending the claim is fully pinned.

## 7. Build Sequence

1. Prepare a hallway packet.
2. Create or update the needed pages.
3. Wire the links from the main hall, figure room, idea rooms, source library, badge hooks, test hooks, and discussion hook.
4. Run a local link check.
5. Run an inline JavaScript syntax check.
6. Report what changed.

The goal is a reusable learning chain: clear doors, honest sources, working navigation, and no unfinished interface pieces pretending to be complete.
