import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

import { auth } from '../../../../../lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (type === 'payment_proof') {
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (!file) {
        return NextResponse.json({ error: 'File is required' }, { status: 400 });
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Keep the traced path limited to the uploads subtree for Turbopack/NFT.
    const uploadsRoot = join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads');

    let uploadDir: string;
    let urlPath: string;

    if (type === 'cover') {
      uploadDir = join(uploadsRoot, 'covers');
      urlPath = 'covers';
    } else if (type === 'pdf') {
      uploadDir = join(uploadsRoot, 'pdfs');
      urlPath = 'pdfs';
    } else if (type === 'payment_proof') {
      uploadDir = join(uploadsRoot, 'payment_proofs');
      urlPath = 'payment_proofs';
    } else {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const timestamp = `${Date.now()}-${file.name}`;
    const originalFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '-');
    const fileName = `${timestamp}-${originalFileName}`;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${urlPath}/${fileName}`;
    return NextResponse.json({ url: fileUrl, path: filePath }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
