# ResumePilot Technical Specification

## 1. Project Configuration

### 1.1 Package.json Dependencies

```json
{
  "name": "resumepilot",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@clerk/clerk-react": "^4.28.0",
    "tailwindcss": "^3.3.6",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "lucide-react": "^0.294.0",
    "react-dropzone": "^14.2.3",
    "pdfjs-dist": "^3.11.174",
    "mammoth": "^1.6.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### 1.2 Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          clerk: ['@clerk/clerk-react'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
})
```

### 1.3 Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 2. Type Definitions

### 2.1 Resume Types

```typescript
// src/types/resume.ts
export interface Resume {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: number;
  uploadedAt: Date;
  textContent: string;
  metadata: ResumeMetadata;
}

export interface ResumeMetadata {
  pageCount?: number;
  wordCount: number;
  characterCount: number;
  sections: string[];
  contactInfo: ContactInfo;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedIn?: string;
  location?: string;
}

export interface ResumeSection {
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
}
```

### 2.2 Analysis Types

```typescript
// src/types/analysis.ts
export interface ATSAnalysis {
  id: string;
  resumeId: string;
  score: number;
  breakdown: ATSScoreBreakdown;
  recommendations: Recommendation[];
  keywords: KeywordAnalysis;
  formattingIssues: FormattingIssue[];
  analyzedAt: Date;
}

export interface ATSScoreBreakdown {
  fileFormat: ScoreComponent;
  structure: ScoreComponent;
  keywords: ScoreComponent;
  formatting: ScoreComponent;
  contact: ScoreComponent;
}

export interface ScoreComponent {
  score: number;
  maxScore: number;
  percentage: number;
  details: string[];
}

export interface Recommendation {
  id: string;
  category: 'formatting' | 'keywords' | 'structure' | 'content';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
}

export interface KeywordAnalysis {
  totalKeywords: number;
  relevantKeywords: string[];
  missingKeywords: string[];
  keywordDensity: Record<string, number>;
  industryKeywords: string[];
}

export interface FormattingIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  description: string;
  suggestion: string;
}

export interface JobMatch {
  id: string;
  resumeId: string;
  jobDescription: string;
  matchScore: number;
  breakdown: MatchScoreBreakdown;
  gaps: SkillGap[];
  strengths: string[];
  recommendations: string[];
  analyzedAt: Date;
}

export interface MatchScoreBreakdown {
  requiredSkills: ScoreComponent;
  experienceLevel: ScoreComponent;
  education: ScoreComponent;
  industryKeywords: ScoreComponent;
}

export interface SkillGap {
  skill: string;
  importance: 'critical' | 'important' | 'nice-to-have';
  suggestion: string;
}
```

### 2.3 API Types

```typescript
// src/types/api.ts
export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

export interface AnalysisRequest {
  resumeText: string;
  jobDescription?: string;
  analysisType: 'ats' | 'match';
  options?: AnalysisOptions;
}

export interface AnalysisOptions {
  includeKeywords: boolean;
  includeFormatting: boolean;
  includeRecommendations: boolean;
  language: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: ATSAnalysis | JobMatch;
  error?: string;
  usage?: TokenUsage;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

## 3. Core Services

### 3.1 OpenRouter Service

```typescript
// src/services/openRouterService.ts
import { OpenRouterConfig, AnalysisRequest, AnalysisResponse } from '@/types/api';

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export class OpenRouterService {
  private config: OpenRouterConfig;

  constructor(config: OpenRouterConfig) {
    this.config = config;
  }

  async analyzeResume(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const prompt = this.buildPrompt(request);
      
      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ResumePilot',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(request.analysisType),
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseResponse(data, request.analysisType);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private getSystemPrompt(analysisType: 'ats' | 'match'): string {
    if (analysisType === 'ats') {
      return `You are an expert ATS (Applicant Tracking System) analyzer. 
      Analyze the provided resume for ATS compatibility. 
      Evaluate formatting, keywords, structure, and provide a score from 0-100.
      Return your analysis in JSON format with the following structure:
      {
        "score": number,
        "breakdown": {
          "fileFormat": { "score": number, "details": string[] },
          "structure": { "score": number, "details": string[] },
          "keywords": { "score": number, "details": string[] },
          "formatting": { "score": number, "details": string[] },
          "contact": { "score": number, "details": string[] }
        },
        "recommendations": string[],
        "keywords": {
          "relevant": string[],
          "missing": string[],
          "density": Record<string, number>
        },
        "formattingIssues": string[]
      }`;
    } else {
      return `You are an expert resume matcher. 
      Compare the provided resume against the job description.
      Calculate a match score from 0-100 and identify gaps and strengths.
      Return your analysis in JSON format with the following structure:
      {
        "matchScore": number,
        "breakdown": {
          "requiredSkills": { "score": number, "details": string[] },
          "experienceLevel": { "score": number, "details": string[] },
          "education": { "score": number, "details": string[] },
          "industryKeywords": { "score": number, "details": string[] }
        },
        "gaps": Array<{ "skill": string, "importance": string, "suggestion": string }>,
        "strengths": string[],
        "recommendations": string[]
      }`;
    }
  }

  private buildPrompt(request: AnalysisRequest): string {
    if (request.analysisType === 'ats') {
      return `Please analyze this resume for ATS compatibility:

RESUME:
${request.resumeText}

Provide a detailed analysis including score, breakdown, recommendations, and keyword analysis.`;
    } else {
      return `Please compare this resume against the job description and calculate a match score:

RESUME:
${request.resumeText}

JOB DESCRIPTION:
${request.jobDescription}

Provide a detailed match analysis including score, breakdown, gaps, and strengths.`;
    }
  }

  private parseResponse(data: unknown, analysisType: 'ats' | 'match'): AnalysisResponse {
    try {
      const content = (data as { choices: Array<{ message: { content: string } }> })
        .choices[0].message.content;
      const parsed = JSON.parse(content);
      
      return {
        success: true,
        data: parsed,
        usage: (data as { usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } })
          .usage,
      };
    } catch {
      return {
        success: false,
        error: 'Failed to parse API response',
      };
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

### 3.2 File Parser Service

```typescript
// src/services/fileParserService.ts
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParseResult {
  success: boolean;
  text?: string;
  error?: string;
  metadata?: {
    pageCount?: number;
    wordCount: number;
    characterCount: number;
  };
}

export class FileParserService {
  static async parseFile(file: File): Promise<ParseResult> {
    const fileType = this.getFileType(file.name);
    
    switch (fileType) {
      case 'pdf':
        return this.parsePDF(file);
      case 'docx':
        return this.parseDOCX(file);
      case 'txt':
        return this.parseTXT(file);
      default:
        return {
          success: false,
          error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.',
        };
    }
  }

  private static getFileType(fileName: string): 'pdf' | 'docx' | 'txt' | null {
    const extension = fileName.toLowerCase().split('.').pop();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'docx':
        return 'docx';
      case 'txt':
        return 'txt';
      default:
        return null;
    }
  }

  private static async parsePDF(file: File): Promise<ParseResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      const pageCount = pdf.numPages;
      
      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => (item as { str: string }).str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      const wordCount = fullText.split(/\s+/).filter(word => word.length > 0).length;
      const characterCount = fullText.length;
      
      return {
        success: true,
        text: fullText.trim(),
        metadata: {
          pageCount,
          wordCount,
          characterCount,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private static async parseDOCX(file: File): Promise<ParseResult> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      const text = result.value;
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      const characterCount = text.length;
      
      return {
        success: true,
        text: text.trim(),
        metadata: {
          wordCount,
          characterCount,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  private static async parseTXT(file: File): Promise<ParseResult> {
    try {
      const text = await file.text();
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      const characterCount = text.length;
      
      return {
        success: true,
        text: text.trim(),
        metadata: {
          wordCount,
          characterCount,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse TXT: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit',
      };
    }
    
    if (!allowedTypes.includes(file.type) && !this.getFileType(file.name)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload PDF, DOCX, or TXT files.',
      };
    }
    
    return { valid: true };
  }
}
```

### 3.3 ATS Analyzer Service

```typescript
// src/services/atsAnalyzerService.ts
import { ATSAnalysis, ATSScoreBreakdown, KeywordAnalysis, FormattingIssue } from '@/types/analysis';

export class ATSAnalyzerService {
  static analyzeResume(text: string): Partial<ATSAnalysis> {
    const breakdown = this.calculateBreakdown(text);
    const keywords = this.extractKeywords(text);
    const formattingIssues = this.detectFormattingIssues(text);
    const recommendations = this.generateRecommendations(breakdown, keywords, formattingIssues);
    
    const score = this.calculateOverallScore(breakdown);
    
    return {
      score,
      breakdown,
      keywords,
      formattingIssues,
      recommendations,
    };
  }

  private static calculateBreakdown(text: string): ATSScoreBreakdown {
    return {
      fileFormat: this.scoreFileFormat(text),
      structure: this.scoreStructure(text),
      keywords: this.scoreKeywords(text),
      formatting: this.scoreFormatting(text),
      contact: this.scoreContact(text),
    };
  }

  private static scoreFileFormat(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    // File format scoring logic
    const details: string[] = [];
    let score = 20; // Base score for successful text extraction
    
    if (text.length > 0) {
      details.push('Text successfully extracted from file');
    }
    
    return {
      score,
      maxScore: 20,
      percentage: (score / 20) * 100,
      details,
    };
  }

  private static scoreStructure(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = [];
    let score = 0;
    
    const sections = ['experience', 'education', 'skills', 'summary', 'objective'];
    const foundSections = sections.filter(section => 
      text.toLowerCase().includes(section)
    );
    
    score = (foundSections.length / sections.length) * 20;
    
    if (foundSections.length > 0) {
      details.push(`Found ${foundSections.length} standard sections`);
    }
    
    return {
      score: Math.round(score),
      maxScore: 20,
      percentage: (score / 20) * 100,
      details,
    };
  }

  private static scoreKeywords(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = [];
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    
    // Score based on keyword diversity and relevance
    const keywordScore = Math.min((uniqueWords.size / 100) * 25, 25);
    
    details.push(`Identified ${uniqueWords.size} unique keywords`);
    
    return {
      score: Math.round(keywordScore),
      maxScore: 25,
      percentage: (keywordScore / 25) * 100,
      details,
    };
  }

  private static scoreFormatting(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = [];
    let score = 20;
    
    // Check for common formatting issues
    const lines = text.split('\n');
    const hasConsistentSpacing = lines.every(line => 
      line.length === 0 || !line.startsWith(' ')
    );
    
    if (hasConsistentSpacing) {
      details.push('Consistent spacing detected');
    } else {
      score -= 5;
      details.push('Inconsistent spacing found');
    }
    
    return {
      score: Math.max(score, 0),
      maxScore: 20,
      percentage: (Math.max(score, 0) / 20) * 100,
      details,
    };
  }

  private static scoreContact(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = [];
    let score = 0;
    
    // Check for email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    if (emailRegex.test(text)) {
      score += 5;
      details.push('Email address found');
    }
    
    // Check for phone
    const phoneRegex = /(\+?[\d\s-]{10,})/;
    if (phoneRegex.test(text)) {
      score += 5;
      details.push('Phone number found');
    }
    
    // Check for LinkedIn
    const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/;
    if (linkedinRegex.test(text.toLowerCase())) {
      score += 5;
      details.push('LinkedIn profile found');
    }
    
    return {
      score,
      maxScore: 15,
      percentage: (score / 15) * 100,
      details,
    };
  }

  private static extractKeywords(text: string): KeywordAnalysis {
    const words = text.toLowerCase().split(/\s+/);
    const wordFrequency: Record<string, number> = {};
    
    words.forEach(word => {
      const cleaned = word.replace(/[^a-z0-9]/g, '');
      if (cleaned.length > 2) {
        wordFrequency[cleaned] = (wordFrequency[cleaned] || 0) + 1;
      }
    });
    
    const sortedKeywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    
    return {
      totalKeywords: Object.keys(wordFrequency).length,
      relevantKeywords: sortedKeywords.map(([word]) => word),
      missingKeywords: [],
      keywordDensity: Object.fromEntries(sortedKeywords),
      industryKeywords: [],
    };
  }

  private static detectFormattingIssues(text: string): FormattingIssue[] {
    const issues: FormattingIssue[] = [];
    
    // Check for tables (ATS unfriendly)
    if (text.includes('|') && text.includes('---')) {
      issues.push({
        type: 'warning',
        category: 'formatting',
        description: 'Table-like structure detected',
        suggestion: 'Convert tables to simple text lists for better ATS compatibility',
      });
    }
    
    // Check for special characters
    const specialChars = text.match(/[^\w\s.,;:!?@#%&*()\-+=\[\]{}|\\:;"'<>?/~`]/g);
    if (specialChars && specialChars.length > 5) {
      issues.push({
        type: 'info',
        category: 'formatting',
        description: 'Multiple special characters detected',
        suggestion: 'Ensure special characters are necessary and ATS-compatible',
      });
    }
    
    return issues;
  }

  private static generateRecommendations(
    breakdown: ATSScoreBreakdown,
    keywords: KeywordAnalysis,
    issues: FormattingIssue[]
  ): Array<{ id: string; category: string; priority: string; title: string; description: string; impact: string }> {
    const recommendations: Array<{ id: string; category: string; priority: string; title: string; description: string; impact: string }> = [];
    
    if (breakdown.keywords.percentage < 70) {
      recommendations.push({
        id: '1',
        category: 'keywords',
        priority: 'high',
        title: 'Add More Industry Keywords',
        description: 'Include more relevant keywords from the job description',
        impact: 'High - Improves ATS matching by 20-30%',
      });
    }
    
    if (breakdown.structure.percentage < 80) {
      recommendations.push({
        id: '2',
        category: 'structure',
        priority: 'medium',
        title: 'Improve Section Structure',
        description: 'Add standard sections like Summary, Experience, Education, Skills',
        impact: 'Medium - Helps ATS parse your resume correctly',
      });
    }
    
    if (issues.length > 0) {
      recommendations.push({
        id: '3',
        category: 'formatting',
        priority: 'medium',
        title: 'Fix Formatting Issues',
        description: 'Address detected formatting problems',
        impact: 'Medium - Ensures proper ATS parsing',
      });
    }
    
    return recommendations;
  }

  private static calculateOverallScore(breakdown: ATSScoreBreakdown): number {
    const weights = {
      fileFormat: 0.20,
      structure: 0.20,
      keywords: 0.25,
      formatting: 0.20,
      contact: 0.15,
    };
    
    const weightedScore = 
      breakdown.fileFormat.percentage * weights.fileFormat +
      breakdown.structure.percentage * weights.structure +
      breakdown.keywords.percentage * weights.keywords +
      breakdown.formatting.percentage * weights.formatting +
      breakdown.contact.percentage * weights.contact;
    
    return Math.round(weightedScore);
  }
}
```

## 4. React Components

### 4.1 Main App Component

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ThemeProvider } from '@/components/theme-provider';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import ATSAnalyzer from '@/pages/ATSAnalyzer';
import JobMatcher from '@/pages/JobMatcher';
import Settings from '@/pages/Settings';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ThemeProvider defaultTheme="light" storageKey="resumepilot-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in/*" element={<SignIn />} />
            <Route path="/sign-up/*" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <>
                  <SignedIn>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/ats-analyzer"
              element={
                <>
                  <SignedIn>
                    <Layout>
                      <ATSAnalyzer />
                    </Layout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/job-matcher"
              element={
                <>
                  <SignedIn>
                    <Layout>
                      <JobMatcher />
                    </Layout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
            <Route
              path="/settings"
              element={
                <>
                  <SignedIn>
                    <Layout>
                      <Settings />
                    </Layout>
                  </SignedIn>
                  <SignedOut>
                    <RedirectToSignIn />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
```

### 4.2 Layout Component

```typescript
// src/components/layout/Layout.tsx
import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 4.3 Header Component

```typescript
// src/components/layout/Header.tsx
import { UserButton } from '@clerk/clerk-react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">ResumePilot</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
            Dashboard
          </Link>
          <Link to="/ats-analyzer" className="text-sm font-medium hover:text-primary">
            ATS Analyzer
          </Link>
          <Link to="/job-matcher" className="text-sm font-medium hover:text-primary">
            Job Matcher
          </Link>
          <Link to="/settings" className="text-sm font-medium hover:text-primary">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-background p-4">
          <div className="flex flex-col space-y-3">
            <Link
              to="/dashboard"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/ats-analyzer"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              ATS Analyzer
            </Link>
            <Link
              to="/job-matcher"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Job Matcher
            </Link>
            <Link
              to="/settings"
              className="text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Settings
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
```

### 4.4 ATS Analyzer Page

```typescript
// src/pages/ATSAnalyzer.tsx
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { FileParserService } from '@/services/fileParserService';
import { ATSAnalyzerService } from '@/services/atsAnalyzerService';
import { ATSAnalysis } from '@/types/analysis';
import ScoreDisplay from '@/components/resume/ScoreDisplay';
import Recommendations from '@/components/resume/Recommendations';
import KeywordAnalysis from '@/components/resume/KeywordAnalysis';

export default function ATSAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        const validation = FileParserService.validateFile(uploadedFile);
        
        if (!validation.valid) {
          setError(validation.error || 'Invalid file');
          return;
        }
        
        setFile(uploadedFile);
        setError(null);
        await analyzeResume(uploadedFile);
      }
    },
  });

  const analyzeResume = async (uploadedFile: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const parseResult = await FileParserService.parseFile(uploadedFile);
      
      if (!parseResult.success || !parseResult.text) {
        throw new Error(parseResult.error || 'Failed to parse file');
      }
      
      const analysisResult = ATSAnalyzerService.analyzeResume(parseResult.text);
      
      setAnalysis({
        id: Date.now().toString(),
        resumeId: uploadedFile.name,
        ...analysisResult,
        analyzedAt: new Date(),
      } as ATSAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ATS Compatibility Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Upload your resume to check its ATS compatibility and get improvement recommendations
        </p>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium">
          {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Supports PDF, DOCX, and TXT files (max 10MB)
        </p>
      </div>

      {/* File Info */}
      {file && (
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          {loading && (
            <div className="ml-auto">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
          {!loading && analysis && (
            <CheckCircle className="ml-auto h-6 w-6 text-green-500" />
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          <ScoreDisplay score={analysis.score} breakdown={analysis.breakdown} />
          <KeywordAnalysis keywords={analysis.keywords} />
          <Recommendations recommendations={analysis.recommendations} />
        </div>
      )}
    </div>
  );
}
```

## 5. Environment Configuration

### 5.1 Environment Variables

```env
# .env.example
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
VITE_APP_NAME=ResumePilot
VITE_APP_VERSION=1.0.0
```

### 5.2 Main Entry Point

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 5.3 Global Styles

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

This technical specification provides a comprehensive foundation for implementing the ResumePilot application with all required features, proper architecture, and best practices.
