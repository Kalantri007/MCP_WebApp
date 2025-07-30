import { ChangeEvent } from 'react';

interface LaTeXEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCompile: (latex: string) => void;
  isCompiling: boolean;
}

export default function LaTeXEditor({
  value,
  onChange,
  onCompile,
  isCompiling,
}: LaTeXEditorProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleCompile = () => {
    onCompile(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          LaTeX Editor
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCompile}
            disabled={isCompiling || !value.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCompiling ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Compiling...
              </>
            ) : (
              'Compile PDF'
            )}
          </button>
        </div>
      </div>
      
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Generated LaTeX code will appear here..."
        className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
      />
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-2">
          <strong>Tips for editing:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Modify bullet points directly in the LaTeX code</li>
          <li>Adjust spacing by changing <code>\\vspace</code> values</li>
          <li>Keep content within one page for best results</li>
          <li>Bold important keywords with <code>\\textbf{'{}'}</code></li>
        </ul>
      </div>
    </div>
  );
}
