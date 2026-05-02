export interface AnalysisResult {
  summary: string;
  components: ComponentAnalysis[];
  tests: TestSuggestion[];
  documentation: string;
  timestamp: string;
  language: string;
  code: string;
}

export interface ComponentAnalysis {
  name: string;
  type: string;
  description: string;
  dependencies: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface TestSuggestion {
  testName: string;
  description: string;
  code: string;
  priority: 'high' | 'medium' | 'low';
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  language: string;
  codeSnippet: string;
  result: AnalysisResult;
}

export type Theme = 'light' | 'dark';

export type TabType = 'summary' | 'components' | 'tests' | 'documentation';

// Made with Bob
