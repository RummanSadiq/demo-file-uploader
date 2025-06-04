
import { FilesRepository } from '@/repositories/files.repository';
import { downloadFile } from '@/services/file.service';
import { NextRequest, NextResponse } from 'next/server';

const filesRepository = new FilesRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const file = await filesRepository.findById(params.id);
    if (!file || !file.fullResolutionKey) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Fetch the file from your storage service
    const fileBuffer = await downloadFile(file.fullResolutionKey);

    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name)}"`,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'private, max-age=0',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}