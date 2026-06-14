# Shape-Azoid Releases

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
