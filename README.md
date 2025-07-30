# Resume Generator - AI-Powered Resume Creation

An advanced web application for automatically generating customized resumes from job descriptions using AI and LaTeX compilation.

## Features

### Core Functionality
- **AI-Powered Content Generation**: Analyzes job descriptions and generates tailored resume content
- **LaTeX Template System**: Professional resume formatting with customizable templates
- **Real-time PDF Generation**: Instant compilation and preview of generated resumes
- **Interactive Editing**: Manual LaTeX editing with live preview capabilities
- **File Management**: Organized storage with automatic naming conventions

### Key Components
- **Job Description Input**: Paste job descriptions for analysis
- **Prompt Configuration**: Customize AI generation parameters
- **LaTeX Editor**: Direct code editing with syntax highlighting
- **Resume Preview**: Real-time PDF preview with download options
- **File Manager**: Browse and manage generated resumes

### File Naming Convention
- Main resume: `Resume_V_Kalantri_2025.pdf`
- Timestamped copies: `Resume_<DateTime>.pdf` (stored in `All_Resume` folder)

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **AI Integration**: MCP (Model Context Protocol) Server
- **PDF Generation**: LaTeX compilation with custom templates
- **File Storage**: Local file system with organized directory structure

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── generate-resume/
│   │   │   ├── compile-latex/
│   │   │   ├── get-prompt/
│   │   │   └── files/
│   │   └── page.tsx          # Main application page
│   ├── components/           # React components
│   │   ├── JobDescriptionInput.tsx
│   │   ├── PromptEditor.tsx
│   │   ├── LaTeXEditor.tsx
│   │   ├── ResumePreview.tsx
│   │   └── FileManager.tsx
│   └── lib/
│       └── mcp-client.ts     # MCP server integration
├── templates/
│   ├── resume-template.tex   # LaTeX resume template
│   └── resume-prompt.txt     # AI generation prompt
├── generated-resumes/        # Output directory
│   └── All_Resume/          # Timestamped copies
└── .github/
    └── copilot-instructions.md
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Open [http://localhost:3000](http://localhost:3000)

## Usage Workflow

### 1. Generate Resume
1. Paste job description in the input field
2. Customize the generation prompt if needed
3. Click "Generate Resume" to create tailored content
4. Review the generated LaTeX code and PDF preview

### 2. Manual Editing
1. Modify the LaTeX code directly in the editor
2. Use "Compile PDF" to see changes instantly
3. System alerts if resume exceeds one page

### 3. Regeneration Options
1. Use "Regenerate" with custom instructions
2. Examples: "Shorten bullet points", "Focus on Python skills"
3. Iterative refinement for optimal results

### 4. Download and Storage
1. Download generates both required file versions
2. Main file: `Resume_V_Kalantri_2025.pdf`
3. Archive copy with timestamp in `All_Resume/` folder

## Integration with MCP Server

The application integrates with a Model Context Protocol (MCP) server for:
- AI-powered content generation from job descriptions
- Resume data analysis and optimization
- LaTeX compilation and PDF generation

### MCP Client Configuration
- Default server: `http://localhost:3001`
- Configurable endpoints for different environments
- Fallback mechanisms for offline operation

## Customization Options

### Resume Template (XYZ)
- Located in `templates/resume-template.tex`
- Professional formatting with consistent styling
- Customizable sections and layouts

### Generation Prompt (ABC)
- Located in `templates/resume-prompt.txt`
- Controls AI content generation behavior
- Editable through the web interface

### Bullet Point Requirements
- **Experience**: 5 bullets per job (first 2 jobs)
  - 2 bullets: 180+ characters (3-line bullets)
  - 3 bullets: 110+ characters
- **Projects**: 2 projects, 3 bullets each (90+ characters)
- **Skills**: Grouped into 5 categories

## Development Features

### Error Handling
- Page overflow detection and alerts
- LaTeX compilation error reporting
- Network failure fallbacks

### File Management
- Automatic directory creation
- Secure file path validation
- Organized folder structure

### Performance Optimization
- Efficient LaTeX compilation
- Optimized file operations
- Responsive UI design

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Maintain component modularity
4. Add proper error handling
5. Update documentation for new features

## License

This project is for personal use in resume generation and job applications.
