# Open questions

Notes for a human to resolve, or for a future session to revisit. Nothing here blocked Phase 0; each item was worked around so the next independent task could proceed.

## Phase 0

- **chrome-devtools MCP does not honour `scripts/chrome-devtools-mcp.sh` in this cloud session.** The tool errors with "Could not find Google Chrome executable for channel 'stable' at /opt/google/chrome/chrome", which means it launched with default settings rather than the project's `.mcp.json` config that points at the pre-installed Chromium (`/opt/pw-browsers/chromium-*/chrome-linux/chrome`) with `--headless --no-sandbox`. Screenshots for this session were taken with `npm run shots` (Appendix E, which uses the correct executable path) instead, per the task's stated fallback. Worth checking in a future session whether the MCP server picks up the project config, or whether it needs to be reconnected after `.mcp.json` changes.
- **One pre-existing, non-blocking console entry remains in every `npm run shots` run:** a single `404` for `/favicon.ico` (no favicon exists yet). Not a regression; will be addressed when a favicon/manifest is added, likely alongside the PWA work in Phase 5.
  - (Resolved in UI-1.3: the `net::ERR_CERT_AUTHORITY_INVALID` entry from the Google Fonts `<link>` tags no longer appears, since fonts are now self-hosted and index.html makes no external requests.)
