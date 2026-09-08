import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  // Root directory of the project, going up from frontend/src/app/api/test-cases
  const rootDir = path.join(process.cwd(), '..');

  if (file) {
    // Read specific file
    try {
      // Basic security to prevent directory traversal
      const safeFile = path.basename(file);
      const filePath = path.join(rootDir, safeFile);
      const content = fs.readFileSync(filePath, 'utf-8');
      return NextResponse.json({ content });
    } catch (error) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  }

  // List all text files in root directory
  try {
    const files = fs.readdirSync(rootDir);
    const txtFiles = files.filter(f => f.startsWith('case') && f.endsWith('.txt'));
    return NextResponse.json({ files: txtFiles });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
  }
}
