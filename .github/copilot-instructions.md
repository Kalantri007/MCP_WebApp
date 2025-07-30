# Resume Generator Application - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a Next.js TypeScript application for automated resume generation with MCP (Model Context Protocol) server integration.

## Project Context
- **Purpose**: Automated resume generation from job descriptions using LaTeX templates
- **Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, MCP Server integration
- **Key Features**: Job description analysis, LaTeX template processing, PDF generation, interactive editing

## Code Style & Patterns
- Use TypeScript with strict type checking
- Follow Next.js App Router patterns
- Implement responsive design with Tailwind CSS
- Use React Server Components where appropriate
- Handle file operations securely on the server side

## Key Components
- Job description input interface
- LaTeX template editor with syntax highlighting
- Resume prompt configuration
- PDF generation and download functionality
- File management for generated resumes
- MCP server integration for AI-powered content generation

## File Naming Conventions
- Generated resumes: `Resume_V_Kalantri_2025.pdf` (main) and `Resume_<timestamp>.pdf` (tracking)
- Components: PascalCase with descriptive names
- Utilities: camelCase with clear functionality indicators
- API routes: kebab-case following REST conventions

## Integration Notes
- MCP server handles resume content generation
- LaTeX compilation should be handled server-side
- Implement proper error handling for PDF generation
- Support manual LaTeX editing with live preview
- Enable regeneration with customization parameters
