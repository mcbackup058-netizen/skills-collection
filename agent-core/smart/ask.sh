#!/bin/bash
# Step Flash Smart Agent - Quick Runner
# 
# Usage:
#   ./ask.sh "Your question here"
#   ./ask.sh --setup
#   ./ask.sh (interactive mode)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

if command -v ts-node &> /dev/null; then
    npx ts-node smart/cli.ts "$@"
else
    echo "Installing ts-node..."
    npm install -g ts-node typescript
    npx ts-node smart/cli.ts "$@"
fi
