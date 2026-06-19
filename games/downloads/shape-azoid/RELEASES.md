# Shape-Azoid Releases

## v0.7.22 online UFO visibility - 2026-06-19

Online visual repair after the UFO effect happened on the server but clients only saw the tile disappear.

- Online clients now apply server UFO countdown, flight, beam, and explosion state from live snapshots.
- Server-time UFO events are converted to the local Pygame clock so the client can draw the UFO at the correct point in its flight.
- Added Online UI probe coverage that applies a server-style UFO snapshot and verifies the client keeps active UFO/explosion state before drawing.
- Verified source and packaged Online UI, WebSocket stress, HTTP multiplayer, room-service, and core import probes.
- Published build marker `v0.7.22-20260619-0831`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.22.zip`

## v0.7.21 smoother online ball motion - 2026-06-18

Playability repair after an online run showed very jerky ball movement even though command timing and frame timing were mostly healthy.

- Increased the live WebSocket room stream from 12 FPS to 30 FPS.
- Online clients now ease matching Zoid/Penta-Zoid positions toward server positions instead of hard-snapping every live packet.
- Large server/client position gaps still snap back to authority so the display cannot drift forever.
- Verified source and packaged Online UI, WebSocket movement, WebSocket stress, telemetry, HTTP multiplayer, and core import probes.
- Published build marker `v0.7.21-20260618-1902`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.21.zip`

## v0.7.20 frame phase telemetry - 2026-06-18

Diagnostic build to identify which part of a frame causes slowdown during online or late-game play.

- Slow-frame and periodic play-state logs now include frame phase timing: events, update/network, drawing, AI, display flip, total work, and frame wait.
- Added `tools/shape_azoid_log_report.py` to summarize runtime logs into slow-frame, Line-card, online command, WebSocket, and max-board-state sections.
- The telemetry probe now verifies that phase timing is written to a real run log.
- Verified source and packaged telemetry, Online UI, WebSocket stress, HTTP multiplayer, room-service, and core import probes.
- Published build marker `v0.7.20-20260618-0800`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.20.zip`

## v0.7.19 runtime telemetry and line diagnostics - 2026-06-16

Diagnostic hardening build for finding late-game slowdowns, online stalls, and Line-card placement failures during real play.

- Added JSONL runtime logs under the game `logs` folder.
- Logs now record run start/end, periodic play-state snapshots, slow frames, online command timing, WebSocket health, and shutdown status.
- Line-card attempts now record click position, nearest shared wall, wall distance, open/closed state, tolerance result, and connected piece IDs.
- Online Line-card commands preserve matching server-side line diagnostics in success and failure responses.
- Added a telemetry probe that verifies a real line attempt is written to the run log.
- Verified source and packaged telemetry, stress WebSocket, Online UI, startup online, online AI, network-file join, background tick, HTTP multiplayer, room-service, and core import probes.
- Published build marker `v0.7.19-20260616-2259`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.19.zip`

## v0.7.18 late-game online stability - 2026-06-16

Follow-up to the WebSocket live-state build after a real multiplayer run was faster and mostly stable but still stuck later in the game.

- WebSocket frames now use a lighter live snapshot and trim old action-log entries instead of streaming the full room history every frame.
- Stream rate is now 12 FPS while clients continue animating locally between authoritative frames.
- Online score snapshots now move clients to the Victory Board instead of leaving them in the play screen.
- Next Round is now a server-owned online command, so connected clients do not split into separate local rounds after scoring.
- Added a late-game WebSocket stress probe covering larger room state, score-mode streaming, and server-owned next round.
- Verified source and packaged stress, WebSocket, Online UI, background tick, network-file join, startup online, online AI, HTTP multiplayer, room-service, command seam, and static import probes.
- Published build marker `v0.7.18-20260616-2217`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.18.zip`

## v0.7.17 WebSocket live-state stream - 2026-06-16

First vertical slice replacing online play's fast-changing board state polling with a pushed WebSocket stream.

- Added a room snapshot WebSocket endpoint on the FastAPI server.
- Added a desktop client WebSocket receiver thread so Pygame can consume pushed state without blocking the main loop.
- Kept HTTP create, join, start, and command requests in place, with HTTP snapshot polling as a fallback if the stream drops.
- Added a client WebSocket check to the Online UI probe so the actual Pygame path proves it receives streamed snapshots.
- Verified source and packaged WebSocket, Online UI, background tick, network-file join, startup online, online AI, HTTP multiplayer, room-service, command seam, and static import probes.
- Published build marker `v0.7.17-20260616-2100`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.17.zip`

## v0.7.16 rebuilt executable and background physics - 2026-06-16

Repair after v0.7.15 updated the support/server files but did not rebuild the top-level player executable before packaging.

- The portable build script now rebuilds `Shape-Azoid.exe` with PyInstaller before making the portable folder and ZIP.
- The hosted online server now runs a 60 FPS background room physics loop instead of only advancing Zoids when clients poll snapshots.
- Room HTTP endpoints share a lock with the background physics loop to prevent request/tick races.
- The background tick probe verifies that a hosted Zoid moves between snapshots without repeated manual refresh requests.
- Verified source and packaged background tick, HTTP multiplayer, Online UI, network-file join, startup online, online AI, command seam, and static import probes.
- Published build marker `v0.7.16-20260616-1909`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.16.zip`

## v0.7.15 online playability and line-card repair - 2026-06-16

Multiplayer playability repair after a live two-computer test connected but showed line cards failing during real play and heavy stutter during online turns.

- Line cards now accept a wider near-click on closed shared walls while normal shape attachment keeps its tighter side-click tolerance.
- Empty online card selections now fail as a normal "Select a card first" command instead of risking a server exception.
- Online play/discard/end-turn commands now return the updated board in the same response, removing the extra immediate refresh request after a move.
- Online polling now waits longer while the active player has a card selected, so refreshes are less likely to fight placement.
- Server-side room ticks are throttled and reduced so two connected clients do not multiply simulation bursts just by refreshing snapshots.
- Online clients animate Zoids locally between authoritative server snapshots to reduce visible freeze-and-jump movement.
- Verified source and packaged Online UI, network-file join, HTTP multiplayer, startup online, online AI, room-service, command seam, and static import probes.
- Published build marker `v0.7.15-20260616-1713`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.15.zip`

## v0.7.14 online selection and join-address repair - 2026-06-16

Multiplayer playability repair after live two-computer testing showed the host screen still displayed the private loopback address and online polling cleared card selection during play.

- Host Create now switches the visible Server Address field to the LAN address when that address answers locally, so the host screen shows the address joiners need instead of `127.0.0.1`.
- Online board refresh now preserves the selected card while it is still the same player's turn and the same card is still in hand.
- The Online UI probe now verifies that a server refresh does not immediately deselect a selected card.
- The Online UI probe now starts rooms through the real in-game host path and shuts down its temporary server afterward.
- Verified source and packaged Online UI, network-file join, HTTP multiplayer, startup online, online AI, room-service, and static import probes.
- Published build marker `v0.7.14-20260616-1608`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.14.zip`

## v0.7.13 host-port repair - 2026-06-16

Multiplayer host repair for the repeated "target machine actively refused" port confusion.

- Fixed the port availability test to match the actual server bind address. The game now checks `0.0.0.0`, not only `127.0.0.1`, before deciding whether port `8765` is free.
- Host Create no longer silently attaches to another leftover Shape-Azoid server. If this game window does not own the existing server, it starts its own server on an available port and writes/shows that actual address.
- Removed the Online screen's Local button so joiners are not nudged toward their own `127.0.0.1` address when they need the host computer's LAN address.
- Improved refused-connection text for local/localhost mistakes and dead host addresses.
- Verified source and packaged startup-online, network-file join, HTTP multiplayer, Online UI, online AI, room-service, and static import probes.
- Published build marker `v0.7.13-20260616-1532`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.13.zip`

## v0.7.12 lobby join/color repair - 2026-06-16

Multiplayer lobby repair focused on duplicate joins, color assignment, and stale host-address files.

- Join requests now reclaim an existing seat token instead of adding another seat for the same player.
- Online colors are chosen in the lobby after joining. A joined player can click their own color dot to cycle to an unused color before Host Start.
- The server owns lobby seat color data and starts the game from that lobby assignment.
- The host now writes the actual current server address for joiners. Port `8765` is preferred, but a busy port no longer blocks the host path if another available port can be used.
- Saved server-address files are ignored on startup unless the saved server is reachable, preventing stale addresses from steering the Online screen.
- The updater now removes runtime server-address/log files after future updates.
- Verified source and packaged room-service, network-file join, HTTP multiplayer, online UI, startup online, online AI, and static import probes.
- Published build marker `v0.7.12-20260616-1500`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.12.zip`

## v0.7.11 online-room flow rebuild - 2026-06-16

Multiplayer connection-flow repair after comparing Shape-Azoid with the DubiouSDungeons host-address plus room-code model.

- Added a visible Player Name field to the Online screen so joiners do not silently inherit the host/default machine name.
- Server joins now force unique seat names, preventing ambiguous lobbies where two seats both appear as the same player.
- Online room/game polling now uses short timeouts and avoids automatic empty-room polling while players are typing, reducing lag when a server address is wrong or unreachable.
- Host creation now keeps port `8765` stable and reports a busy port instead of silently switching to a random port.
- Rebuilt `Shape-Azoid.exe` and the portable package from the current source.
- Verified source and packaged network-file join, HTTP multiplayer, online UI, online AI, startup online, and packaged LAN-address health probes.
- Published build marker `v0.7.11-20260616-1305`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.11.zip`

## v0.7.10 connection-timeout rebuild - 2026-06-16

Connection message and package refresh.

- Increased the online HTTP client timeout from 2 seconds to 5 seconds.
- Replaced raw `urlopen` timeout text with clearer connection timeout/reachability messages.
- Rebuilt `Shape-Azoid.exe` and the portable package from the current source.
- Verified packaged network-file join, HTTP multiplayer, and online AI probes.
- Published build marker `v0.7.10-20260616-1233`.

Published files:

- `latest.zip`
- `latest-build.txt`
- `shape-azoid-v0.7.10.zip`

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
