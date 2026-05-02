import React, { useState } from 'react';
import { Send, Code, Loader2 } from 'lucide-react';

interface CodeInputProps {
  onAnalyze: (code: string, language: string) => void;
  isLoading: boolean;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'csharp', label: 'C#', icon: '💜' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'swift', label: 'Swift', icon: '🍎' },
];

const CodeInput: React.FC<CodeInputProps> = ({ onAnalyze, isLoading }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && !isLoading) {
      onAnalyze(code, language);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analyze Your Code
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Programming Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setLanguage(lang.value)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${language === lang.value
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <span className="text-xl">{lang.icon}</span>
                  <span className="text-sm">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Textarea */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Paste Your Code
              </label>
              <button
                type="button"
                onClick={handlePaste}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Paste from clipboard
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your ${LANGUAGES.find(l => l.value === language)?.label || 'code'} here...\n\nfunction example() {\n  return "Hello, FirstStep!";\n}`}
              className="w-full h-64 px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 font-mono text-sm resize-none"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{code.length} characters</span>
              <span>{code.split('\n').length} lines</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!code.trim() || isLoading}
            className={`
              w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-200
              ${!code.trim() || isLoading
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Analyzing Code...</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                <span>Analyze Code</span>
              </>
            )}
          </button>
        </form>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Tips for best results:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Include complete functions or classes for better analysis</li>
            <li>• Select the correct programming language</li>
            <li>• Larger code snippets provide more comprehensive insights</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CodeInput;

// Made with Bob
