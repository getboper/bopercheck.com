#!/bin/bash

# This script generates PNG icons of various sizes from an SVG file
# Requirements: Install Inkscape and ImageMagick

# First, create the SVG icon
cat > icon.svg << 'EOL'
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="128" fill="#10b981"/>
  <text x="256" y="280" font-family="Arial, sans-serif" font-weight="bold" font-size="180" text-anchor="middle" fill="white">B</text>
  <path d="M256 350 L320 250 L380 320 L400 300" stroke="white" stroke-width="15" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="380" cy="220" r="30" fill="white"/>
</svg>
EOL

# Convert SVG to PNG for different sizes
for size in 72 96 128 144 152 192 384 512; do
  convert -background none -size ${size}x${size} icon.svg icon-${size}x${size}.png
done

echo "Icons generated successfully!"