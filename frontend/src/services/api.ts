import axios from 'axios';
import type { AnalysisResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AnalyzeCodeRequest {
  code: string;
  language: string;
}

export interface AnalyzeCodeResponse {
  success: boolean;
  analysis: {
    summary: string;
    components: Array<{
      name: string;
      description: string;
    }>;
    tests: string[];
    documentation: string;
  };
  message?: string;
}

export const analyzeCode = async (
  code: string,
  language: string
): Promise<AnalysisResult> => {
  try {
    const response = await api.post<AnalyzeCodeResponse>('/api/chat/analyze', {
      code,
      language,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Analysis failed');
    }

    const analysis = response.data.analysis;

    return {
      summary: analysis.summary,
      components: analysis.components.map(c => ({
        name: c.name,
        type: 'Function',
        description: c.description,
        dependencies: [],
        complexity: 'medium' as const,
      })),
      tests: analysis.tests.map(t => ({
        testName: typeof t === 'string' ? t : 'Test case',
        description: typeof t === 'string' ? t : 'Test case',
        code: '',
        priority: 'high' as const,
      })),
      documentation: analysis.documentation,
      timestamp: new Date().toISOString(),
      language,
      code,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to analyze code. Please try again.'
      );
    }
    throw error;
  }
};

// Mock function for development/testing
export const mockAnalyzeCode = async (
  code: string,
  language: string
): Promise<AnalysisResult> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    summary: `This ${language} code defines a function that processes data and returns results.`,
    components: [
      {
        name: 'MainFunction',
        type: 'Function',
        description: 'Primary function that orchestrates the data processing workflow',
        dependencies: [],
        complexity: 'medium',
      },
    ],
    tests: [
      {
        testName: 'test_main_function_success',
        description: 'Verify that the main function returns expected results with valid input',
        code: `test('should process data correctly', () => {\n  expect(mainFunction(input)).toBeDefined();\n});`,
        priority: 'high',
      },
    ],
    documentation: `# Code Documentation\n\n## Overview\nThis module provides functionality for data processing.`,
    timestamp: new Date().toISOString(),
    language,
    code,
  };
};

export default api;

// Made with Bob