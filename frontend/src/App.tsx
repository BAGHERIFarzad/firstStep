import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import CodeInput from './components/CodeInput';
import Results from './components/Results';
import HistorySidebar from './components/HistorySidebar';
import { ThemeProvider } from './contexts/ThemeContext';
import { analyzeCode, mockAnalyzeCode } from './services/api';
import { exportToPDF, exportToMarkdown } from './utils/exportUtils';
import type { AnalysisResult, HistoryItem } from './types';

const USE_MOCK_API = false; // Set to true for testing without backend

function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('firstStepHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('firstStepHistory', JSON.stringify(history));
    }
  }, [history]);

  const handleAnalyze = async (code: string, language: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const analysisResult = USE_MOCK_API
        ? await mockAnalyzeCode(code, language)
        : await analyzeCode(code, language);

      setResult(analysisResult);

      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: analysisResult.timestamp,
        language: analysisResult.language,
        codeSnippet: code.substring(0, 100) + (code.length > 100 ? '...' : ''),
        result: analysisResult,
      };

      setHistory(prev => [historyItem, ...prev].slice(0, 20)); // Keep last 20 items

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setResult(item.result);
    setError(null);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      localStorage.removeItem('firstStepHistory');
    }
  };

  const handleExportPDF = () => {
    if (result) {
      try {
        exportToPDF(result);
      } catch (err) {
        console.error('PDF export error:', err);
        alert('Failed to export PDF. Please try again.');
      }
    }
  };

  const handleExportMarkdown = () => {
    if (result) {
      try {
        exportToMarkdown(result);
      } catch (err) {
        console.error('Markdown export error:', err);
        alert('Failed to export Markdown. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)} />
      
      <div className="flex flex-1">
        <main className="flex-1 overflow-x-hidden">
          <Hero />
          
          <CodeInput onAnalyze={handleAnalyze} isLoading={isLoading} />

          {/* Error Display */}
          {error && (
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                    Analysis Error
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <Results
              result={result}
              onExportPDF={handleExportPDF}
              onExportMarkdown={handleExportMarkdown}
            />
          )}

          {/* Footer */}
          <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Built with ❤️ for developers by developers
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                FirstStep • AI-Powered Code Analysis • {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </main>

        {/* History Sidebar */}
        <HistorySidebar
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

// Made with Bob
