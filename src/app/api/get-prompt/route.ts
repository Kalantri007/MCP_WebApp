import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const promptPath = path.join(process.cwd(), 'templates', 'resume-prompt.txt');
    const prompt = await fs.readFile(promptPath, 'utf-8');
    
    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error reading prompt:', error);
    return NextResponse.json(
      { error: 'Failed to load prompt' },
      { status: 500 }
    );
  }
}
