#!/bin/sh
# Downloads fonts required for Hekaya PDF generation.
# Noto Naskh Arabic (Google Fonts) + Courier Prime (public domain)

set -e

FONTS_DIR="$(dirname "$0")/../fonts"
mkdir -p "$FONTS_DIR"

echo "Downloading Noto Naskh Arabic..."
curl -sL -o "$FONTS_DIR/NotoNaskhArabic-Regular.ttf" \
  "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoNaskhArabic/NotoNaskhArabic-Regular.ttf"
curl -sL -o "$FONTS_DIR/NotoNaskhArabic-Bold.ttf" \
  "https://github.com/googlefonts/noto-fonts/raw/main/hinted/ttf/NotoNaskhArabic/NotoNaskhArabic-Bold.ttf"

echo "Downloading Courier Prime..."
curl -sL -o "$FONTS_DIR/Courier-Regular.ttf" \
  "https://github.com/quoteunquoteapps/CourierPrime/raw/master/fonts/ttf/CourierPrime-Regular.ttf"
curl -sL -o "$FONTS_DIR/Courier-Bold.ttf" \
  "https://github.com/quoteunquoteapps/CourierPrime/raw/master/fonts/ttf/CourierPrime-Bold.ttf"

echo "Fonts downloaded to $FONTS_DIR"
ls -la "$FONTS_DIR"/*.ttf
