#!/usr/bin/env bash
# tools/optimize-images.sh
#
# Generate responsive JPEG and WebP images from the uploaded originals in the repo root.
# Usage: ./tools/optimize-images.sh
# Requirements: ImageMagick (convert) and cwebp (from libwebp) OR sharp (npm)
# This script is intended to be run locally on macOS/Linux. It does not move originals.

set -euo pipefail

ORIGINALS=("1.jpeg" "2.jpeg" "3.jpeg" "4.jpeg" "5.jpeg")
OUT_DIR="assets/images"
mkdir -p "$OUT_DIR"

# Width breakpoints
WIDTHS=(480 900 1400 2000)
QUALITY_JPEG=82
QUALITY_WEBP=80

echo "Optimizing images to $OUT_DIR ..."

for idx in "${!ORIGINALS[@]}"; do
  src="${ORIGINALS[$idx]}"
  if [[ ! -f "$src" ]]; then
    echo "Warning: source file $src not found — skipping"
    continue
  fi

  # map index to descriptive name (default mapping)
  case "$src" in
    "1.jpeg") name_base="hero" ;;
    "2.jpeg") name_base="coffee-1" ;;
    "3.jpeg") name_base="interior-1" ;;
    "4.jpeg") name_base="pastry-1" ;;
    "5.jpeg") name_base="detail-1" ;;
    *) name_base="image-$idx" ;;
  esac

  for w in "${WIDTHS[@]}"; do
    out_jpg="$OUT_DIR/${name_base}-$w.jpg"
    out_webp="$OUT_DIR/${name_base}-$w.webp"

    echo "Creating $out_jpg and $out_webp from $src (width $w)"

    if command -v convert >/dev/null 2>&1; then
      # ImageMagick convert to resize and save jpeg
      convert "$src" -resize "${w}x" -quality $QUALITY_JPEG "$out_jpg"
    elif command -v magick >/dev/null 2>&1; then
      magick "$src" -resize "${w}x" -quality $QUALITY_JPEG "$out_jpg"
    else
      echo "ImageMagick 'convert' not found. Install ImageMagick or use the sharp alternative." >&2
      exit 1
    fi

    if command -v cwebp >/dev/null 2>&1; then
      cwebp -q $QUALITY_WEBP "$out_jpg" -o "$out_webp" >/dev/null
    else
      echo "cwebp not found. Attempting fallback: convert directly to webp (if supported)"
      if command -v convert >/dev/null 2>&1 || command -v magick >/dev/null 2>&1; then
        convert "$src" -resize "${w}x" -quality $QUALITY_WEBP "$out_webp"
      else
        echo "No WebP encoder found. Install libwebp (cwebp) or ImageMagick with webp support." >&2
      fi
    fi
  done

  # create a medium fallback jpeg (1400) as the base for older clients
  cp -n "$OUT_DIR/${name_base}-1400.jpg" "$OUT_DIR/${name_base}.jpg" 2>/dev/null || true
done

echo "Optimization complete. Generated files live in $OUT_DIR"

echo "Next steps: commit the assets/images/ files and push to the site/images branch. Then preview index.html locally or open the branch on GitHub Pages." 
