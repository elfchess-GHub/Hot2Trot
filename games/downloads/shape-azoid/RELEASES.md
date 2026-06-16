# Shape-Azoid Releases

## v0.7.10 rebuild - 2026-06-16

Multiplayer recovery package rebuild.

- Rebuilt `Shape-Azoid.exe` from the current source after server-owned multiplayer fixes.
- Included `shape_azoid_core.py` under `Shape-Azoid Support` so the packaged server can import the headless multiplayer rules.
- Fixed the updater so a newer local build is not downgraded by an older public `latest-build.txt`.
- Verified the rebuilt portable package with packaged network-file join, HTTP multiplayer, startup online, online UI, and online AI probes.
- Published build marker `v0.7.10-20260615-2219`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.10.zip`

## v0.7.10 - 2026-06-14

Updater bug-fix build.

- Fixed the updater copy step so it expands package contents correctly when an update is actually needed.
- Avoided overwriting an existing `Play Shape-Azoid.exe` while the launcher may be running.
- Kept the ability to add `Play Shape-Azoid.exe` when updating a folder that does not already have it.
- Verified a temporary stale install updated from the public package and received `BUILD_ID.txt`, `Play Shape-Azoid.cmd`, `Play Shape-Azoid.exe`, `Shape-Azoid.exe`, and `Update Shape-Azoid.ps1`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.10.zip`

## v0.7.9 - 2026-06-14

Update-launcher package build.

- Added `Play Shape-Azoid.exe` as the intended player-facing starter.
- Added `Update Shape-Azoid.ps1`, `Play Shape-Azoid.cmd`, and `BUILD_ID.txt` to the package.
- `Play Shape-Azoid.exe` checks `latest-build.txt`, downloads `latest.zip` when the public build changes, updates the local folder, then starts `Shape-Azoid.exe`.
- Kept `Shape-Azoid.exe` beside the launcher as the underlying game executable; opening it directly bypasses the update check.
- Published `latest-build.txt` to match the package `BUILD_ID.txt`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.9.zip`

## v0.7.8 - 2026-06-14

Keyboard control cleanup build.

- Removed the hidden `R` hotkey that could reset, refresh, or restart while a player was typing.
- Restored the intentional `F11` display toggle and `Esc` back/quit behavior.
- Documented the remaining intentional keys in README and in-game Help.
- Verified no `R` key handler remains in the current source.
- Verified online UI probes, saved server-file join probe, and fresh packaged direct Server Address join.

Published files:

- `latest.zip`
- `shape-azoid-v0.7.8.zip`

## v0.7.7 - 2026-06-14

Online join screen cleanup build.

- Added a visible editable Server Address field to the Online screen.
- Joiners can now type the host server address and the room code directly in the game.
- Kept `Shape_Azoid_Network_Server.txt` as an optional saved shortcut, not the only join path.
- Updated in-game help and README text to match the visible host-address plus room-code flow.
- Verified the direct Server Address join path from source and from a fresh extracted package.
- Verified the packaged host Create path still starts the bundled server and writes `HOST_SERVER_ADDRESS.txt`.

Published files:

- `latest.zip`
- `shape-azoid-v0.7.7.zip`

## v0.7.6 - 2026-06-14

Display and online-server cleanup build.

- Removed Pygame scaled-window mode so portraits, cards, and UI text render sharply instead of being softened by automatic display scaling.
- Silenced the local online server access log spam during lobby polling.
- Kept the bundled online runtime under `Shape-Azoid Support\.venv`.
- Verified from a fresh extracted package that Online Create starts the bundled server, creates a room, writes `Shape_Azoid_Network_Server.txt`, and leaves zero polling log lines.
- Verified the saved server-file join probe still passes.

Published files:

- `latest.zip`
- `shape-azoid-v0.7.6.zip`

## v0.7.5 - 2026-06-14

Complete single-entry online runtime build.

- Bundled the Python server runtime under `Shape-Azoid Support\.venv` so a fresh extracted package can host online without a separate setup step.
- Kept `Shape-Azoid.exe` as the player-facing entry point.
- Verified from a fresh extracted package that Online Create starts the local server, creates a room code, and writes `Shape_Azoid_Network_Server.txt`.
- Verified the saved server-file join probe still passes.

Published files:

- `latest.zip`
- `shape-azoid-v0.7.5.zip`

## v0.7.4 - 2026-06-14

Workspace cleanup and canonical-source build.

- Archived the stale local `C:\cardgameJ\Shape-Azoid` folder and made the current source live at that clean canonical path.
- Moved runtime-generated server files and preview images out of the source root.
- Moved diagnostic launchers into source `support_scripts`; the release package still keeps them under `Shape-Azoid Support`.
- Updated the PyInstaller spec and README commands to use `C:\cardgameJ\Shape-Azoid`.
- Rebuilt `Shape-Azoid.exe` from the canonical source path.
- Verified the saved server-file join probe still passes from the canonical source folder.

Published files:

- `latest.zip`
- `shape-azoid-v0.7.4.zip`

## v0.7.3 - 2026-06-14

Single-entry multiplayer test build.

- Restored `Shape-Azoid.exe` as the intended player-facing entry point for regular play, online hosting, and online joining.
- Moved online host/join launchers out of the package top level and into `Shape-Azoid Support` for diagnostics only.
- Added in-game local server startup: on the Online screen, the host clicks Create and the game starts the server, writes the saved server address files, and creates the room.
- Kept joiners on the saved-server-file pattern: put the host address in `Shape_Azoid_Network_Server.txt`, open `Shape-Azoid.exe`, click Online, type the room code, and Join.
- Rebuilt `Shape-Azoid.exe` from the fixed source.
- Verified the release zip top level contains only `Shape-Azoid.exe`, `README.md`, and `Install_Shape_Azoid_Requirements.cmd`.

Published files:

- `latest.zip`
- `shape-azoid-v0.7.3.zip`

## v0.7.2 - 2026-06-14

Multiplayer test build focused on the saved-server-file join flow.

- Fixed online server-file lookup so the current launch folder's `Shape_Azoid_Network_Server.txt` wins over an older file beside the source/program.
- Added `tools/shape_azoid_network_file_join_probe.py` to verify host create, joiner file-based join, host sees joiner, host start, and joiner playing snapshot.
- Rebuilt `Shape-Azoid.exe` from the fixed source.
- Verified the release zip still extracts into one top-level `Shape-Azoid` folder.

Published files:

- `latest.zip`
- `shape-azoid-v0.7.2.zip`

## v0.7.1 - 2026-06-14

First named public Shape-Azoid release using the current package layout.

- Simplified online joining to match the DubiouSDungeons saved-server pattern.
- Added `Shape_Azoid_Network_Server.txt` support for joiners.
- Added `Show_Shape_Azoid_Home_Network_Info.cmd` for host same-Wi-Fi address display.
- Fixed Online screen typing lag by avoiding network polling before a joined room exists.
- Fixed lobby/start sync so joined players can see room state changes.
- Added offline drawing caches for static background, board grid, panels, buttons, shape fills, and portraits.
- Preserved original character/action/opening art quality in the release package.
- Kept the package extraction layout as one top-level `Shape-Azoid` folder with one player-facing EXE.

Published files:

- `latest.zip`
- `shape-azoid-v0.7.1.zip`
