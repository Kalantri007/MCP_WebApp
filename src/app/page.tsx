'use client';

import { useState } from 'react';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import PromptEditor from '@/components/PromptEditor';
import LaTeXEditor from '@/components/LaTeXEditor';
import ResumePreview from '@/components/ResumePreview';
import FileManager from '@/components/FileManager';

export default function Home() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumePrompt, setResumePrompt] = useState('');
  const [generatedLatex, setGeneratedLatex] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState('');

  const generateResume = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          prompt: resumePrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const data = await response.json();
      setGeneratedLatex(data.latex);
      setGeneratedPdfUrl(data.pdfUrl);
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateResume = async (customInstructions: string = '') => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/regenerate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          prompt: resumePrompt,
          customInstructions,
          currentLatex: generatedLatex,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate resume');
      }

      const data = await response.json();
      setGeneratedLatex(data.latex);
      setGeneratedPdfUrl(data.pdfUrl);
    } catch (error) {
      console.error('Error regenerating resume:', error);
      alert('Failed to regenerate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const compileLatex = async (latexCode: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/compile-latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latex: latexCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to compile LaTeX');
      }

      const data = await response.json();
      setGeneratedPdfUrl(data.pdfUrl);
      
      if (data.pageCount > 1) {
        alert(`⚠️ Warning: The resume has ${data.pageCount} pages. Consider shortening the content to fit on one page.`);
      }
    } catch (error) {
      console.error('Error compiling LaTeX:', error);
      alert('Failed to compile LaTeX. Please check your code for errors.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Resume Generator
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered resume generation from job descriptions
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              onGenerate={generateResume}
              isGenerating={isGenerating}
            />
            
            <PromptEditor
              value={resumePrompt}
              onChange={setResumePrompt}
            />
            
            {generatedLatex && (
              <LaTeXEditor
                value={generatedLatex}
                onChange={setGeneratedLatex}
                onCompile={compileLatex}
                isCompiling={isGenerating}
              />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {generatedPdfUrl && (
              <ResumePreview
                pdfUrl={generatedPdfUrl}
                onRegenerate={regenerateResume}
                isGenerating={isGenerating}
              />
            )}
            
            <FileManager />
          </div>
        </div>
      </div>
    </div>
  );
}
