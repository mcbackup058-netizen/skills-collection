#!/bin/bash
# 🤖 Step Flash Quick Runner
# 
# Usage:
#   ./ask.sh setup YOUR_API_KEY
#   ./ask.sh "Your question here"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v node &> /dev/null; then
    node "$SCRIPT_DIR/run.js" "$@"
else
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js first: https://nodejs.org"
    exit 1
fi
