#!/bin/bash

echo "🧪 Testing Resume Generator Application"
echo "========================================"

# Test 1: Check if server is running
echo "1. Testing server health..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$response" = "200" ]; then
    echo "✅ Server is running on localhost:3001"
else
    echo "❌ Server is not responding"
    exit 1
fi

# Test 2: Test prompt loading
echo "2. Testing prompt API..."
prompt_response=$(curl -s http://localhost:3001/api/get-prompt)
if [[ $prompt_response == *"prompt"* ]]; then
    echo "✅ Prompt API working"
else
    echo "❌ Prompt API failed"
fi

# Test 3: Test file listing
echo "3. Testing file management..."
files_response=$(curl -s "http://localhost:3001/api/files?path=")
if [[ $files_response == *"files"* ]]; then
    echo "✅ File management API working"
else
    echo "❌ File management API failed"
fi

# Test 4: Test LaTeX compilation
echo "4. Testing LaTeX compilation..."
latex_test='\documentclass[letterpaper,10pt]{article}
\usepackage{fontawesome}
\begin{document}
{\huge \textbf{Test Resume}} \\
\vspace{0.2cm}
Test content for resume generation.
\end{document}'

compile_response=$(curl -s -X POST http://localhost:3001/api/compile-latex-local \
  -H "Content-Type: application/json" \
  -d "{\"latex\": \"$latex_test\", \"filename\": \"test_resume\"}")

if [[ $compile_response == *"success"* ]]; then
    echo "✅ LaTeX compilation working"
else
    echo "❌ LaTeX compilation failed"
    echo "Response: $compile_response"
fi

# Test 5: Check generated files
echo "5. Checking generated files..."
if [ -f "generated-resumes/test_resume.pdf" ]; then
    echo "✅ PDF generation working"
    file_size=$(stat -f%z "generated-resumes/test_resume.pdf" 2>/dev/null || stat -c%s "generated-resumes/test_resume.pdf" 2>/dev/null)
    echo "   Generated PDF size: $file_size bytes"
else
    echo "❌ PDF generation failed"
fi

# Test 6: Test resume generation API
echo "6. Testing resume generation..."
job_desc="Software Engineer position requiring React.js, Node.js, and TypeScript experience"
prompt_text="Generate ATS-optimized resume content"

generate_response=$(curl -s -X POST http://localhost:3001/api/generate-resume \
  -H "Content-Type: application/json" \
  -d "{\"jobDescription\": \"$job_desc\", \"prompt\": \"$prompt_text\"}")

if [[ $generate_response == *"latex"* ]]; then
    echo "✅ Resume generation API working"
else
    echo "❌ Resume generation API failed"
    echo "Response: $generate_response"
fi

echo ""
echo "🎉 Testing completed!"
echo "You can now:"
echo "1. Open http://localhost:3001 in your browser"
echo "2. Paste a job description"
echo "3. Generate and download your resume"
