import { ChangeEvent } from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function JobDescriptionInput({
  value,
  onChange,
  onGenerate,
  isGenerating,
}: JobDescriptionInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Job Description
      </h2>
      
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Paste the job description here..."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      
      <div className="mt-4 flex gap-3">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !value.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Generating...
            </>
          ) : (
            'Generate Resume'
          )}
        </button>
        
        <button
          onClick={() => onChange('')}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
