export interface ATSAnalysis {
  id: string
  resumeId: string
  score: number
  breakdown: ATSScoreBreakdown
  recommendations: Recommendation[]
  keywords: KeywordAnalysis
  formattingIssues: FormattingIssue[]
  analyzedAt: Date
}

export interface ATSScoreBreakdown {
  fileFormat: ScoreComponent
  structure: ScoreComponent
  keywords: ScoreComponent
  formatting: ScoreComponent
  contact: ScoreComponent
}

export interface ScoreComponent {
  score: number
  maxScore: number
  percentage: number
  details: string[]
}

export interface Recommendation {
  id: string
  category: 'formatting' | 'keywords' | 'structure' | 'content'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
}

export interface KeywordAnalysis {
  totalKeywords: number
  relevantKeywords: string[]
  missingKeywords: string[]
  keywordDensity: Record<string, number>
  industryKeywords: string[]
}

export interface FormattingIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  description: string
  suggestion: string
}

export interface JobMatch {
  id: string
  resumeId: string
  jobDescription: string
  matchScore: number
  breakdown: MatchScoreBreakdown
  gaps: SkillGap[]
  strengths: string[]
  recommendations: string[]
  analyzedAt: Date
}

export interface MatchScoreBreakdown {
  requiredSkills: ScoreComponent
  experienceLevel: ScoreComponent
  education: ScoreComponent
  industryKeywords: ScoreComponent
}

export interface SkillGap {
  skill: string
  importance: 'critical' | 'important' | 'nice-to-have'
  suggestion: string
}
