import React, { useState } from 'react';
import { FileText, Package, TestTube, BookOpen, Download, FileDown } from 'lucide-react';
import type { AnalysisResult, TabType } from '../types';

interface ResultsProps {
  result: AnalysisResult;
  onExportPDF: () => void;
  onExportMarkdown: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onExportPDF, onExportMarkdown }) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const tabs = [
    { id: 'summary' as TabType, label: 'Summary', icon: FileText },
    { id: 'components' as TabType, label: 'Components', icon: Package },
    { id: 'tests' as TabType, label: 'Tests', icon: TestTube },
    { id: 'documentation' as TabType, label: 'Documentation', icon: BookOpen },
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12" id="results">
      <div className="card p-8 animate-fade-in">
        {/* Header with export buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Analysis Results
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(result.timestamp).toLocaleString()} • {result.language}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onExportMarkdown}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg transition-colors duration-200"
            >
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Markdown</span>
            </button>
            <button
              onClick={onExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-primary-200 dark:border-primary-800">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Code Summary
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Components Tab */}
          {activeTab === 'components' && (
            <div className="space-y-4">
              {result.components.length > 0 ? (
                result.components.map((component, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {component.name}
                        </h3>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {component.type}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getComplexityColor(component.complexity)}`}>
                        {component.complexity} complexity
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {component.description}
                    </p>
                    {component.dependencies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Dependencies:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {component.dependencies.map((dep, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs font-mono"
                            >
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No components identified in the code
                </div>
              )}
            </div>
          )}

          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              {result.tests.length > 0 ? (
                result.tests.map((test, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {test.testName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(test.priority)}`}>
                        {test.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {test.description}
                    </p>
                    <div className="bg-gray-900 dark:bg-black p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm text-gray-100">
                        <code>{test.code}</code>
                      </pre>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No test suggestions available
                </div>
              )}
            </div>
          )}

          {/* Documentation Tab */}
          {activeTab === 'documentation' && (
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                  {result.documentation}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Results;

// Made with Bob
