#!/usr/bin/env sh
# Launches chrome-devtools-mcp with settings that work both locally and in the
# Claude Code cloud container (no Google Chrome, runs as root, TLS-intercepting proxy).
CLOUD_CHROME=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | head -n 1)
if [ -n "$CLOUD_CHROME" ]; then
  exec npx -y chrome-devtools-mcp@latest \
    --headless --isolated \
    --executablePath="$CLOUD_CHROME" \
    --chromeArg=--no-sandbox \
    --chromeArg=--disable-setuid-sandbox \
    --chromeArg=--ignore-certificate-errors
fi
exec npx -y chrome-devtools-mcp@latest "$@"
