import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get('path') || '';
    
    // Base directory for generated resumes
    const baseDir = path.join(process.cwd(), 'generated-resumes');
    const fullPath = path.join(baseDir, requestedPath);
    
    // Security check: ensure path is within generated-resumes directory
    if (!fullPath.startsWith(baseDir)) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 400 }
      );
    }
    
    try {
      const items = await fs.readdir(fullPath, { withFileTypes: true });
      
      const files = await Promise.all(
        items.map(async (item) => {
          const itemPath = path.join(fullPath, item.name);
          const relativePath = path.relative(baseDir, itemPath);
          
          if (item.isDirectory()) {
            return {
              name: item.name,
              path: relativePath,
              type: 'folder' as const,
            };
          } else {
            const stats = await fs.stat(itemPath);
            return {
              name: item.name,
              path: relativePath,
              type: 'file' as const,
              size: stats.size,
              modified: stats.mtime.toISOString(),
            };
          }
        })
      );
      
      // Sort: folders first, then files
      files.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      
      return NextResponse.json({ files });
    } catch (error) {
      // Directory doesn't exist, return empty array
      return NextResponse.json({ files: [] });
    }
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}
