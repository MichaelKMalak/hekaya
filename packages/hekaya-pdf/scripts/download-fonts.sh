#!/bin/sh
# Downloads fonts required for Hekaya PDF generation.
# Cascadia Mono (Microsoft, SIL license) for Arabic + Courier Prime for English

set -e

FONTS_DIR="$(dirname "$0")/../fonts"
mkdir -p "$FONTS_DIR"

echo "Downloading Cascadia Mono..."
CASCADIA_VERSION="2404.23"
CASCADIA_URL="https://github.com/microsoft/cascadia-code/releases/download/v${CASCADIA_VERSION}/CascadiaCode-${CASCADIA_VERSION}.zip"
TMPZIP="$(mktemp)"
curl -sL -o "$TMPZIP" "$CASCADIA_URL"
# Extract only the static ttf files we need
unzip -jo "$TMPZIP" "*/static/CascadiaMono-Light.ttf" -d "$FONTS_DIR" 2>/dev/null || true
unzip -jo "$TMPZIP" "*/static/CascadiaMono-Regular.ttf" -d "$FONTS_DIR" 2>/dev/null || true
rm -f "$TMPZIP"

echo "Downloading Courier Prime..."
curl -sL -o "$FONTS_DIR/Courier-Regular.ttf" \
  "https://github.com/quoteunquoteapps/CourierPrime/raw/master/fonts/ttf/CourierPrime-Regular.ttf"
curl -sL -o "$FONTS_DIR/Courier-Bold.ttf" \
  "https://github.com/quoteunquoteapps/CourierPrime/raw/master/fonts/ttf/CourierPrime-Bold.ttf"

echo "Fonts downloaded to $FONTS_DIR"
ls -la "$FONTS_DIR"/*.ttf
