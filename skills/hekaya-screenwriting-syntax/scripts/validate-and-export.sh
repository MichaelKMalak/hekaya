#!/bin/bash
# Validate a .hekaya file and export to PDF
# Usage: ./validate-and-export.sh <input.hekaya> [--include-notes]

if [ -z "$1" ]; then
    echo "Usage: $0 <input.hekaya> [--include-notes]"
    exit 1
fi

INPUT="$1"
BASENAME="${INPUT%.hekaya}"
INCLUDE_NOTES="${2:-}"

if [ ! -f "$INPUT" ]; then
    echo "Error: File not found: $INPUT"
    exit 1
fi

echo "Validating $INPUT..."
npx @hekaya/cli validate "$INPUT"

if [ $? -ne 0 ]; then
    echo "Validation failed. Fix errors before exporting."
    exit 1
fi

echo ""
echo "Exporting to PDF..."
if [ "$INCLUDE_NOTES" = "--include-notes" ]; then
    npx @hekaya/cli export "$INPUT" --include-notes -o "${BASENAME}.pdf"
else
    npx @hekaya/cli export "$INPUT" -o "${BASENAME}.pdf"
fi

if [ $? -eq 0 ]; then
    echo "Success: ${BASENAME}.pdf"
else
    echo "Export failed."
    exit 1
fi
