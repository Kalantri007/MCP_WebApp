import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp-client';

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, prompt, customInstructions, currentLatex } = await request.json();

    if (!jobDescription || !prompt) {
      return NextResponse.json(
        { error: 'Job description and prompt are required' },
        { status: 400 }
      );
    }

    // Combine original prompt with custom instructions
    const enhancedPrompt = customInstructions 
      ? `${prompt}\n\nAdditional Instructions: ${customInstructions}`
      : prompt;

    // Use MCP client to regenerate resume
    const result = await mcpClient.generateResume({
      jobDescription,
      prompt: enhancedPrompt,
      customInstructions,
    });
    
    return NextResponse.json({
      latex: result.latex,
      pdfUrl: result.pdfUrl,
      resumeData: result.resumeData,
    });
  } catch (error) {
    console.error('Error regenerating resume:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate resume' },
      { status: 500 }
    );
  }
}
