# Hot2Trotski Completion Audit

Date: 2026-06-03

## What This Pass Finished

- Timeline event rooms now use real lesson fields from `data/timeline-stops.json`; no event room is using the starter-door fallback language.
- Timeline event source cards now display each source item's own audit status.
- Timeline source leads with broad supporting sources are marked `[source lead checked]`.
- Thin idea rooms from the audit pass were cleaned up so broad source leads no longer sit as fake uncertainty when the link supports the basic room purpose.
- Mojibake quote characters found in idea rooms were cleaned.
- A repeatable local link checker was added at `scripts/check_local_links.js`.

## Current Check Results

- `node scripts/check_hallways.js`
  - Hallway check passed for 27 hallway packet(s).
  - Key Terms links checked: 403.
- `node scripts/check_local_links.js`
  - Local link check passed: 1925 local link(s) checked.
- Main page inline JavaScript parses.
- `git diff --check` passes, aside from normal Windows LF/CRLF warnings.

## What Still Must Stay Honest

- `[needs verification]` labels remain where exact passages are not pinned.
- Source leads are not the same thing as exact quotes.
- The browser-saved profile, badges, comments, and discussion sections are still front-end study-hall behavior, not a real account/database/backend.
