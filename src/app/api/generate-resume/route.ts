import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp-client';

// AI-powered resume generation using MCP server
export async function POST(request: NextRequest) {
  try {
    const { jobDescription, prompt } = await request.json();

    if (!jobDescription || !prompt) {
      return NextResponse.json(
        { error: 'Job description and prompt are required' },
        { status: 400 }
      );
    }

    // Use MCP client to generate resume
    const result = await mcpClient.generateResume({
      jobDescription,
      prompt,
    });
    
    return NextResponse.json({
      latex: result.latex,
      pdfUrl: result.pdfUrl,
      resumeData: result.resumeData,
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}
