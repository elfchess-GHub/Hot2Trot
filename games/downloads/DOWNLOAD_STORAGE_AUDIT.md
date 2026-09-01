# Download Storage Audit

Created: 2026-08-31

Purpose: keep Elfchess game and book publishing from running GitHub/LFS space over the limit. This ledger is an audit and decision tool. It does not authorize deleting, moving, or rewriting history by itself.

## Current Finding

The pressure is coming from game build archives, not normal web pages or book pages.

Current `games/downloads` footprint:

| Area | Files | Large ZIP/EXE files | Current folder size |
| --- | ---: | ---: | ---: |
| shape-azoid | 36 | 34 | 4,643.6 MB |
| sphinxlite | 21 | 11 | 2,998.9 MB |
| horse-trader | 27 | 13 | 2,401.1 MB |
| dubious-dungeons | 6 | 2 | 67.9 MB |

Approximate current download-folder total: 10,111.5 MB.

Git/LFS history audit:

| Source | Reported size |
| --- | ---: |
| Git LFS objects across history | 23 GB |
| Local loose Git object storage | 3.02 GiB |

Important: `git status --short -- games/downloads` currently shows uncommitted Shape-Azoid download changes:

```text
 M games/downloads/shape-azoid/RELEASES.md
 M games/downloads/shape-azoid/latest-build.txt
 M games/downloads/shape-azoid/latest.zip
?? games/downloads/shape-azoid/shape-azoid-v0.7.33.zip
```

That means the audit should treat Shape-Azoid as actively changing until the responsible Shape-Azoid thread either publishes, backs up, or reverts its current release attempt.

## GitHub Constraints

- GitHub LFS storage counts each pushed version of a changed LFS file as a full new object. Replacing a 150 MB ZIP with another 150 MB ZIP adds another 150 MB of LFS storage.
- GitHub Free/Pro LFS includes 10 GiB storage and 10 GiB monthly bandwidth.
- Removing LFS files from the normal branch does not automatically purge already-uploaded remote LFS objects from GitHub's storage count.
- GitHub release assets are better than committing large binaries into the Pages repository. GitHub's release documentation says each asset must be under 2 GiB, with no listed total release size or bandwidth limit.
- itch.io/butler is a strong candidate for public game delivery because it can push changed build parts instead of re-uploading full ZIPs each time.

Sources:

- GitHub LFS billing: https://docs.github.com/en/billing/concepts/product-billing/git-lfs
- Removing files from Git LFS: https://docs.github.com/en/repositories/working-with-files/managing-large-files/removing-files-from-git-large-file-storage
- GitHub Releases: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- itch.io butler pushing: https://itch.io/docs/butler/pushing.html

## Proposed Storage Policy

### Keep In GitHub Pages Repo

Use `games/downloads/<game>/` for small metadata and the active updater target only.

Keep:

- `latest-build.txt`
- `latest-release-notes.txt`
- `latest-update.json`
- `latest.zip` only when the game's existing launcher/updater depends on that exact URL
- checksums such as `latest.zip.sha256`
- release notes ledgers such as `RELEASES.md`
- small manifest JSON files

Avoid:

- keeping every historical full ZIP in the Pages repo
- adding a new versioned ZIP every time a game gets a minor update
- committing repeated installer EXEs into the Pages repo unless there is a specific current install-page need

### Move Or Archive Elsewhere

Move version archives to one of these destinations:

| Destination | Best use |
| --- | --- |
| GitHub Releases | versioned archives, rollback builds, release notes, one-off public downloads |
| itch.io | player-facing game distribution, patch-style updates, public game pages |
| local/offline archive | old internal builds that do not need public download access |

## Game-by-Game Decision Ledger

| Game | Current state | Space issue | Recommended next action | Owner decision needed |
| --- | --- | --- | --- | --- |
| Shape-Azoid | Actively changing; uncommitted v0.7.33 download files exist | Highest folder footprint: 4.64 GB; many historical ZIPs | Do not add more archives to Pages. First resolve current v0.7.33 state, then keep `latest.zip` plus one rollback only. Move older version ZIPs to Releases or local archive. | Decide whether old public Shape-Azoid archives must remain public. |
| SphinxLite | Latest ZIP plus installer EXEs and many historical ZIPs | 3.00 GB current folder | Keep current `latest.zip` and current installer if still used. Move old ZIPs/installers to Releases or local archive. | Decide whether both installer and portable ZIP need public current links. |
| Horse Trader | Many similar 184.7 MB ZIPs | 2.40 GB current folder | Keep current `latest.zip`; move older versioned ZIPs to Releases/local archive. | Decide whether Horse Trader should move to itch.io first because it is multiplayer-facing. |
| Dubious Dungeons | Small current footprint | Not urgent | Leave for now except avoid repeated full archive buildup. | No immediate decision unless it becomes update-heavy. |
| Books | Not currently the pressure point | Audit not yet measured here | Keep book pages and normal web assets on GitHub Pages. Audit audio/video separately before moving anything. | Decide later only if book audio files become large. |

## Audit Work Queue

1. Freeze new large ZIP uploads until there is a storage decision for that game.
2. Resolve the current uncommitted Shape-Azoid v0.7.33 download state.
3. Create a per-file CSV inventory with path, size, last modified time, LFS tracking state, and proposed disposition.
4. For each game, classify files as:
   - `KEEP_LATEST`
   - `KEEP_ROLLBACK`
   - `MOVE_RELEASE`
   - `MOVE_ITCH`
   - `LOCAL_ARCHIVE_ONLY`
   - `DELETE_AFTER_BACKUP`
5. Verify all website pages link to `latest.zip`, release assets, or itch.io links before removing any old path.
6. After migration, decide whether normal branch cleanup is enough or whether a serious LFS rescue is required.

## Cleanup Log

### 2026-08-31 Shape-Azoid current-folder archive reduction

Jeremy authorized removing old Shape-Azoid version ZIPs while keeping the active latest ZIP and one rollback ZIP.

Kept:

- `latest.zip`
- `latest-build.txt`
- `RELEASES.md`
- `shape-azoid-v0.7.33.zip`
- `shape-azoid-v0.7.32.zip`

Removed from the current repo state:

- `shape-azoid-v0.7.1.zip` through `shape-azoid-v0.7.31.zip`

Result:

- Removed 31 old Shape-Azoid archive ZIPs from the working tree/index.
- Shape-Azoid download folder now contains 5 files totaling about 379.2 MB.
- Website links checked for Shape-Azoid downloads point to `shape-azoid/latest.zip`; old archive filenames remain only in `RELEASES.md` history notes.
- This reduces the current branch size after commit/push, but it does not by itself purge already-uploaded GitHub LFS objects from remote storage.

### 2026-08-31 SphinxLite current-folder archive reduction

Jeremy authorized the same cleanup pattern for SphinxLite after the Shape-Azoid reduction.

Kept:

- `latest.zip`
- `latest-update.json`
- `latest-release-notes.txt`
- `SphinxLite2-Windows-Setup-1.4.8.exe`
- `SphinxLite2-v1.4.8-windows-20260829.zip`
- `SphinxLite2-v1.4.7-windows-20260815.zip`
- release-note text files

Removed from the current repo state:

- `SphinxLite2-v1.4.1-windows-20260616.zip`
- `SphinxLite2-v1.4.2-windows-20260618.zip`
- `SphinxLite2-v1.4.3-windows-20260618.zip`
- `SphinxLite2-v1.4.4-windows-20260625.zip`
- `SphinxLite2-v1.4.5-windows-20260701.zip`
- `SphinxLite2-v1.4.6-windows-20260711.zip`
- `SphinxLite2-Windows-Setup-1.4.7.exe`

Result:

- Removed 7 old SphinxLite binary archives/installers from the working tree/index.
- SphinxLite download folder now contains 14 files totaling about 1,076.9 MB.
- Current SphinxLite page/update links still point to `latest.zip` and `SphinxLite2-Windows-Setup-1.4.8.exe`.
- Remaining references to removed ZIP names are release-note history text only.
- This reduces the current branch size after commit/push, but it does not by itself purge already-uploaded GitHub LFS objects from remote storage.

### 2026-09-01 Horse Trader current-folder archive reduction

Jeremy authorized continuing the same cleanup pattern for Horse Trader.

Kept:

- `latest.zip`
- `latest-build.txt`
- `latest-release-notes.txt`
- `HorseTrader-v1.0.0-windows-20260616-1946.zip`
- `HorseTrader-v1.0.0-windows-20260616-1911.zip`
- release-note text files

Removed from the current repo state:

- `HorseTrader-1.0-20260613-2216-Desktop-Multiplayer-Windows-App.zip`
- `HorseTrader-v1.0.0-windows-20260614-1216.zip`
- `HorseTrader-v1.0.0-windows-20260614-1300.zip`
- `HorseTrader-v1.0.0-windows-20260614-1601.zip`
- `HorseTrader-v1.0.0-windows-20260614-2055.zip`
- `HorseTrader-v1.0.0-windows-20260614-2251.zip`
- `HorseTrader-v1.0.0-windows-20260615-2132.zip`
- `HorseTrader-v1.0.0-windows-20260615-2213.zip`
- `HorseTrader-v1.0.0-windows-20260616-1118.zip`
- `HorseTrader-v1.0.0-windows-20260616-1243.zip`

Result:

- Removed 10 old Horse Trader ZIP archives from the working tree/index.
- Horse Trader download folder now contains 17 files totaling about 554.1 MB.
- Current Horse Trader page links still point to `horse-trader/latest.zip`.
- Remaining references to removed ZIP names are release-note history text only.
- This reduces the current branch size after commit/push, but it does not by itself purge already-uploaded GitHub LFS objects from remote storage.

## No-Delete Rule

No file in this folder should be deleted or untracked until all of these are true:

1. The file is listed in this audit or a later audit CSV.
2. The proposed destination/disposition is recorded.
3. Any required replacement link is live and tested.
4. Jeremy approves the specific cleanup operation.
5. A checker confirms the website/updater path still works.
