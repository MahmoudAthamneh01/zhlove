import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { dimensions: string[] } }
) {
  const { dimensions } = params;
  
  // Parse dimensions (e.g., ['400', '200'] for /api/placeholder/400/200)
  const width = parseInt(dimensions[0]) || 400;
  const height = parseInt(dimensions[1]) || 300;
  
  // Limit dimensions for security
  const maxWidth = 2000;
  const maxHeight = 2000;
  const finalWidth = Math.min(width, maxWidth);
  const finalHeight = Math.min(height, maxHeight);
  
  // Generate SVG placeholder
  const svg = `<svg width="${finalWidth}" height="${finalHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#1D1834"/>
    <rect x="20" y="20" width="${finalWidth - 40}" height="${finalHeight - 40}" fill="#281B39" stroke="#505360" stroke-width="2"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle" dy=".3em">
      ${finalWidth} × ${finalHeight}
    </text>
    <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="#505360" text-anchor="middle" dy=".3em">
      ZH-Love Placeholder
    </text>
  </svg>`;
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
} 