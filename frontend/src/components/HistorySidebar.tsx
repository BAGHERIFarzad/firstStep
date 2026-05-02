import React from 'react';
import { History, X, Trash2, Clock } from 'lucide-react';
import type { HistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      python: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      java: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      csharp: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      go: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      rust: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      php: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      ruby: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
      swift: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[language.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:translate-x-0 lg:relative lg:w-96
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                History
              </h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No analysis history yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  Your analyzed code will appear here
                </p>
              </div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                  className="w-full text-left p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColor(item.language)}`}>
                      {item.language}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 font-mono line-clamp-3 bg-white dark:bg-gray-950 p-2 rounded border border-gray-200 dark:border-gray-800">
                    {item.codeSnippet}
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {item.result.components.length} components • {item.result.tests.length} tests
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClearHistory}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors duration-200 font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Clear History
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default HistorySidebar;

// Made with Bob
