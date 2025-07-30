import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp-client';

export async function POST(request: NextRequest) {
  try {
    const { latex } = await request.json();
    
    if (!latex) {
      return NextResponse.json(
        { error: 'LaTeX code is required' },
        { status: 400 }
      );
    }

    // Use MCP client to compile LaTeX
    const result = await mcpClient.compileLatex(latex);
    
    return NextResponse.json({
      pdfUrl: result.pdfUrl,
      pageCount: result.pageCount,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error compiling LaTeX:', error);
    return NextResponse.json(
      { error: 'Failed to compile LaTeX' },
      { status: 500 }
    );
  }
}
