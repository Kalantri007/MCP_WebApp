import { ChangeEvent, useEffect, useState } from 'react';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PromptEditor({ value, onChange }: PromptEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load the default prompt from the server
    if (!value) {
      fetch('/api/get-prompt')
        .then(res => res.json())
        .then(data => onChange(data.prompt))
        .catch(err => console.error('Failed to load prompt:', err));
    }
  }, [value, onChange]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const savePrompt = async () => {
    try {
      await fetch('/api/save-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: value }),
      });
      setIsEditing(false);
      alert('Prompt saved successfully!');
    } catch (error) {
      console.error('Error saving prompt:', error);
      alert('Failed to save prompt. Please try again.');
    }
  };

  const resetToDefault = async () => {
    try {
      const response = await fetch('/api/get-default-prompt');
      const data = await response.json();
      onChange(data.prompt);
      alert('Prompt reset to default!');
    } catch (error) {
      console.error('Error resetting prompt:', error);
      alert('Failed to reset prompt. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Resume Generation Prompt
        </h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={savePrompt}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={resetToDefault}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>
      
      <textarea
        value={value}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="Your resume generation prompt will appear here..."
        className={`w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          !isEditing ? 'bg-gray-50 text-gray-700' : 'bg-white'
        }`}
      />
      
      {!isEditing && (
        <p className="text-sm text-gray-500 mt-2">
          This prompt controls how your resume content is generated. Click &quot;Edit&quot; to modify it.
        </p>
      )}
    </div>
  );
}
