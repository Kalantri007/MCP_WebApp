import { useState, useEffect } from 'react';

interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: string;
}

export default function FileManager() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/files?path=${encodeURIComponent(currentPath)}`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [currentPath]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(`/api/download-file?path=${encodeURIComponent(filePath)}`);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      const response = await fetch('/api/delete-file', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: filePath }),
      });

      if (response.ok) {
        loadFiles(); // Refresh the file list
        alert('File deleted successfully');
      } else {
        throw new Error('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Generated Resumes
        </h2>
        <button
          onClick={loadFiles}
          disabled={isLoading}
          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <span 
          className="cursor-pointer hover:text-blue-600"
          onClick={() => setCurrentPath('')}
        >
          generated-resumes
        </span>
        {currentPath && (
          <>
            <span className="mx-1">/</span>
            <span className="text-gray-900">{currentPath}</span>
          </>
        )}
      </div>

      {/* File List */}
      <div className="space-y-2">
        {currentPath && (
          <div
            className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
            onClick={() => {
              const parentPath = currentPath.split('/').slice(0, -1).join('/');
              setCurrentPath(parentPath);
            }}
          >
            <span className="text-blue-600 mr-2">📁</span>
            <span className="text-blue-600">.. (Parent Directory)</span>
          </div>
        )}
        
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
          >
            <div className="flex items-center flex-1">
              <span className="mr-2">
                {file.type === 'folder' ? '📁' : '📄'}
              </span>
              <div className="flex-1">
                {file.type === 'folder' ? (
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigateToFolder(file.path)}
                  >
                    {file.name}
                  </span>
                ) : (
                  <span className="text-gray-900">{file.name}</span>
                )}
                {file.size && (
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                    {file.modified && ` • Modified: ${formatDate(file.modified)}`}
                  </div>
                )}
              </div>
            </div>
            
            {file.type === 'file' && (
              <div className="flex gap-2">
                <button
                  onClick={() => downloadFile(file.path, file.name)}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download
                </button>
                <button
                  onClick={() => deleteFile(file.path)}
                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        
        {files.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-8">
            No resumes generated yet. Create your first resume using the job description input above.
          </div>
        )}
      </div>
    </div>
  );
}
