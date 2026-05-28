import { OpenRouterConfig, AnalysisRequest, AnalysisResponse } from '@/types/api'

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export class OpenRouterService {
  private config: OpenRouterConfig

  constructor(config: OpenRouterConfig) {
    this.config = config
  }

  async analyzeResume(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const prompt = this.buildPrompt(request)

      const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
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
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return this.parseResponse(data, request.analysisType)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
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
      }`
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
      }`
    }
  }

  private buildPrompt(request: AnalysisRequest): string {
    if (request.analysisType === 'ats') {
      return `Please analyze this resume for ATS compatibility:

RESUME:
${request.resumeText}

Provide a detailed analysis including score, breakdown, recommendations, and keyword analysis.`
    } else {
      return `Please compare this resume against the job description and calculate a match score:

RESUME:
${request.resumeText}

JOB DESCRIPTION:
${request.jobDescription}

Provide a detailed match analysis including score, breakdown, gaps, and strengths.`
    }
  }

  private parseResponse(data: unknown, _analysisType: 'ats' | 'match'): AnalysisResponse {
    try {
      const responseData = data as {
        choices?: Array<{ message: { content: string } }>
        usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
      }

      if (!responseData.choices || responseData.choices.length === 0) {
        return { success: false, error: 'API returned no response choices' }
      }

      let content = responseData.choices[0].message.content

      // Strip markdown code fences that LLMs sometimes wrap JSON in
      const fenceMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (fenceMatch) {
        content = fenceMatch[1].trim()
      }

      const parsed = JSON.parse(content)

      const usageData = responseData.usage
      return {
        success: true,
        data: parsed,
        usage: usageData
          ? {
              promptTokens: usageData.prompt_tokens,
              completionTokens: usageData.completion_tokens,
              totalTokens: usageData.total_tokens,
              cost: 0,
            }
          : undefined,
      }
    } catch {
      return {
        success: false,
        error: 'Failed to parse API response',
      }
    }
  }

  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}
