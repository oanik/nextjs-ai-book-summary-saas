import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { extname, join, normalize } from 'path';

export const runtime = 'nodejs';

const MIME_BY_EXTENSION: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const getContentType = (filePath: string) => {
  const extension = extname(filePath).toLowerCase();
  return MIME_BY_EXTENSION[extension] ?? 'application/octet-stream';
};

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;

    if (!path || path.length < 2) {
      return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
    }

    const normalizedPath = normalize(path.join('/'));
    if (normalizedPath.includes('..')) {
      return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
    }

    const absolutePath = join(process.cwd(), 'public', 'uploads', normalizedPath);
    const fileBuffer = await readFile(absolutePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Type': getContentType(absolutePath),
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
