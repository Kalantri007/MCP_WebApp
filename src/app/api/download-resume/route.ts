import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    // This would typically get the latest generated resume
    // For now, we'll create a mock response
    const resumePath = path.join(process.cwd(), 'generated-resumes', 'Resume_V_Kalantri_2025.pdf');
    
    try {
      const pdfBuffer = await fs.readFile(resumePath);
      
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Resume_V_Kalantri_2025.pdf"',
        },
      });
    } catch (error) {
      // If file doesn't exist, return a message
      return NextResponse.json(
        { error: 'No resume found. Please generate a resume first.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error downloading resume:', error);
    return NextResponse.json(
      { error: 'Failed to download resume' },
      { status: 500 }
    );
  }
}
