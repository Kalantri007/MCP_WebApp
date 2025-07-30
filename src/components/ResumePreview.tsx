import { useState } from 'react';

interface ResumePreviewProps {
  pdfUrl: string;
  onRegenerate: (customInstructions: string) => void;
  isGenerating: boolean;
}

export default function ResumePreview({
  pdfUrl,
  onRegenerate,
  isGenerating,
}: ResumePreviewProps) {
  const [customInstructions, setCustomInstructions] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleRegenerate = () => {
    onRegenerate(customInstructions);
    setCustomInstructions('');
    setShowInstructions(false);
  };

  const downloadResume = async () => {
    try {
      const response = await fetch('/api/download-resume');
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Resume_V_Kalantri_2025.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Resume Preview
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            Regenerate
          </button>
          <button
            onClick={downloadResume}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Download
          </button>
        </div>
      </div>

      {showInstructions && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instructions (optional)
          </label>
          <input
            type="text"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g., Shorten bullet points, Focus on Python skills..."
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Regenerating...
                </>
              ) : (
                'Regenerate Resume'
              )}
            </button>
            <button
              onClick={() => setShowInstructions(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
            {/* PDF Preview */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <iframe
          src={`/api/serve-pdf?file=${pdfUrl.split('/').pop()}`}
          className="w-full h-96"
          title="Resume Preview"
        >
          <p>
            Your browser does not support PDF preview.{' '}
            <button onClick={downloadResume} className="text-blue-600 hover:underline">
              Download PDF
            </button>
          </p>
        </iframe>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Quick Actions:</strong> Download saves both copies 
          (main file and timestamped version in All_Resume folder)
        </p>
      </div>
    </div>
  );
}
