import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { latex, filename = 'resume' } = await request.json();
    
    if (!latex) {
      return NextResponse.json(
        { error: 'LaTeX code is required' },
        { status: 400 }
      );
    }

    // Create temporary directory for compilation
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const timestamp = Date.now();
    const baseFilename = `${filename}_${timestamp}`;
    const texFile = path.join(tempDir, `${baseFilename}.tex`);
    const pdfFile = path.join(tempDir, `${baseFilename}.pdf`);
    
    // Write LaTeX to file
    await fs.writeFile(texFile, latex, 'utf-8');
    
    try {
      // Compile LaTeX to PDF
      await execAsync(`pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFile}"`);
      
      // Check if PDF was created
      await fs.access(pdfFile);
      
      // Move PDF to generated-resumes directory
      const outputDir = path.join(process.cwd(), 'generated-resumes');
      await fs.mkdir(outputDir, { recursive: true });
      
      const finalPdfPath = path.join(outputDir, `${filename}.pdf`);
      await fs.copyFile(pdfFile, finalPdfPath);
      
      // Also create timestamped copy in All_Resume folder
      const allResumeDir = path.join(outputDir, 'All_Resume');
      await fs.mkdir(allResumeDir, { recursive: true });
      const timestampedPath = path.join(allResumeDir, `Resume_${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
      await fs.copyFile(pdfFile, timestampedPath);
      
      // Clean up temp files
      await cleanupTempFiles(tempDir, baseFilename);
      
      // Get PDF page count (simple estimation)
      const pageCount = await estimatePageCount(latex);
      
      return NextResponse.json({
        success: true,
        pdfUrl: `/generated-resumes/${filename}.pdf`,
        pageCount,
        timestamp,
      });
      
    } catch (compileError) {
      console.error('LaTeX compilation error:', compileError);
      
      // Clean up temp files
      await cleanupTempFiles(tempDir, baseFilename);
      
      return NextResponse.json(
        { 
          error: 'LaTeX compilation failed',
          details: compileError instanceof Error ? compileError.message : 'Unknown error'
        },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Error in local LaTeX compilation:', error);
    return NextResponse.json(
      { error: 'Failed to compile LaTeX locally' },
      { status: 500 }
    );
  }
}

async function cleanupTempFiles(tempDir: string, baseFilename: string) {
  const extensions = ['.tex', '.pdf', '.log', '.aux', '.out'];
  for (const ext of extensions) {
    try {
      await fs.unlink(path.join(tempDir, `${baseFilename}${ext}`));
    } catch {
      // Ignore cleanup errors
    }
  }
}

function estimatePageCount(latex: string): number {
  // Simple estimation based on content length and structure
  const lines = latex.split('\n').length;
  const sections = (latex.match(/\\section/g) || []).length;
  const items = (latex.match(/\\item/g) || []).length;
  
  // Rough estimation formula
  const estimatedLines = lines + (sections * 3) + (items * 2);
  return Math.max(1, Math.ceil(estimatedLines / 45)); // Assuming ~45 lines per page
}
