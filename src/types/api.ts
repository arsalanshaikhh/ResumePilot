export interface OpenRouterConfig {
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
}

export interface AnalysisRequest {
  resumeText: string
  jobDescription?: string
  analysisType: 'ats' | 'match'
  options?: AnalysisOptions
}

export interface AnalysisOptions {
  includeKeywords: boolean
  includeFormatting: boolean
  includeRecommendations: boolean
  language: string
}

export interface AnalysisResponse {
  success: boolean
  data?: unknown
  error?: string
  usage?: TokenUsage
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
}

export interface APIError {
  code: string
  message: string
  details?: Record<string, unknown>
}
