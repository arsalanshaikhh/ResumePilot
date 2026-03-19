import { ATSAnalysis, ATSScoreBreakdown, KeywordAnalysis, FormattingIssue, Recommendation } from '@/types/analysis'

export class ATSAnalyzerService {
  static analyzeResume(text: string): Partial<ATSAnalysis> {
    const breakdown = this.calculateBreakdown(text)
    const keywords = this.extractKeywords(text)
    const formattingIssues = this.detectFormattingIssues(text)
    const recommendations = this.generateRecommendations(breakdown, keywords, formattingIssues)

    const score = this.calculateOverallScore(breakdown)

    return {
      score,
      breakdown,
      keywords,
      formattingIssues,
      recommendations,
    }
  }

  private static calculateBreakdown(text: string): ATSScoreBreakdown {
    return {
      fileFormat: this.scoreFileFormat(text),
      structure: this.scoreStructure(text),
      keywords: this.scoreKeywords(text),
      formatting: this.scoreFormatting(text),
      contact: this.scoreContact(text),
    }
  }

  private static scoreFileFormat(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = []
    let score = 20 // Base score for successful text extraction

    if (text.length > 0) {
      details.push('Text successfully extracted from file')
    }

    return {
      score,
      maxScore: 20,
      percentage: (score / 20) * 100,
      details,
    }
  }

  private static scoreStructure(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = []
    let score = 0

    const sections = ['experience', 'education', 'skills', 'summary', 'objective']
    const foundSections = sections.filter((section) => text.toLowerCase().includes(section))

    score = (foundSections.length / sections.length) * 20

    if (foundSections.length > 0) {
      details.push(`Found ${foundSections.length} standard sections`)
    }

    return {
      score: Math.round(score),
      maxScore: 20,
      percentage: (score / 20) * 100,
      details,
    }
  }

  private static scoreKeywords(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = []
    const words = text.toLowerCase().split(/\s+/)
    const uniqueWords = new Set(words)

    // Score based on keyword diversity and relevance
    const keywordScore = Math.min((uniqueWords.size / 100) * 25, 25)

    details.push(`Identified ${uniqueWords.size} unique keywords`)

    return {
      score: Math.round(keywordScore),
      maxScore: 25,
      percentage: (keywordScore / 25) * 100,
      details,
    }
  }

  private static scoreFormatting(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = []
    let score = 20

    // Check for common formatting issues
    const lines = text.split('\n')
    const hasConsistentSpacing = lines.every((line) => line.length === 0 || !line.startsWith(' '))

    if (hasConsistentSpacing) {
      details.push('Consistent spacing detected')
    } else {
      score -= 5
      details.push('Inconsistent spacing found')
    }

    return {
      score: Math.max(score, 0),
      maxScore: 20,
      percentage: (Math.max(score, 0) / 20) * 100,
      details,
    }
  }

  private static scoreContact(text: string): { score: number; maxScore: number; percentage: number; details: string[] } {
    const details: string[] = []
    let score = 0

    // Check for email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    if (emailRegex.test(text)) {
      score += 5
      details.push('Email address found')
    }

    // Check for phone
    const phoneRegex = /(\+?[\d\s-]{10,})/
    if (phoneRegex.test(text)) {
      score += 5
      details.push('Phone number found')
    }

    // Check for LinkedIn
    const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-]+/
    if (linkedinRegex.test(text.toLowerCase())) {
      score += 5
      details.push('LinkedIn profile found')
    }

    return {
      score,
      maxScore: 15,
      percentage: (score / 15) * 100,
      details,
    }
  }

  private static extractKeywords(text: string): KeywordAnalysis {
    const words = text.toLowerCase().split(/\s+/)
    const wordFrequency: Record<string, number> = {}

    words.forEach((word) => {
      const cleaned = word.replace(/[^a-z0-9]/g, '')
      if (cleaned.length > 2) {
        wordFrequency[cleaned] = (wordFrequency[cleaned] || 0) + 1
      }
    })

    const sortedKeywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)

    return {
      totalKeywords: Object.keys(wordFrequency).length,
      relevantKeywords: sortedKeywords.map(([word]) => word),
      missingKeywords: [],
      keywordDensity: Object.fromEntries(sortedKeywords),
      industryKeywords: [],
    }
  }

  private static detectFormattingIssues(text: string): FormattingIssue[] {
    const issues: FormattingIssue[] = []

    // Check for tables (ATS unfriendly)
    if (text.includes('|') && text.includes('---')) {
      issues.push({
        type: 'warning',
        category: 'formatting',
        description: 'Table-like structure detected',
        suggestion: 'Convert tables to simple text lists for better ATS compatibility',
      })
    }

    // Check for special characters
    const specialChars = text.match(/[^\w\s.,;:!?@#%&*()\-+=\[\]{}|\\:;"'<>?/~`]/g)
    if (specialChars && specialChars.length > 5) {
      issues.push({
        type: 'info',
        category: 'formatting',
        description: 'Multiple special characters detected',
        suggestion: 'Ensure special characters are necessary and ATS-compatible',
      })
    }

    return issues
  }

  private static generateRecommendations(
    breakdown: ATSScoreBreakdown,
    _keywords: KeywordAnalysis,
    issues: FormattingIssue[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = []

    if (breakdown.keywords.percentage < 70) {
      recommendations.push({
        id: '1',
        category: 'keywords',
        priority: 'high',
        title: 'Add More Industry Keywords',
        description: 'Include more relevant keywords from the job description',
        impact: 'High - Improves ATS matching by 20-30%',
      })
    }

    if (breakdown.structure.percentage < 80) {
      recommendations.push({
        id: '2',
        category: 'structure',
        priority: 'medium',
        title: 'Improve Section Structure',
        description: 'Add standard sections like Summary, Experience, Education, Skills',
        impact: 'Medium - Helps ATS parse your resume correctly',
      })
    }

    if (issues.length > 0) {
      recommendations.push({
        id: '3',
        category: 'formatting',
        priority: 'medium',
        title: 'Fix Formatting Issues',
        description: 'Address detected formatting problems',
        impact: 'Medium - Ensures proper ATS parsing',
      })
    }

    return recommendations
  }

  private static calculateOverallScore(breakdown: ATSScoreBreakdown): number {
    const weights = {
      fileFormat: 0.2,
      structure: 0.2,
      keywords: 0.25,
      formatting: 0.2,
      contact: 0.15,
    }

    const weightedScore =
      breakdown.fileFormat.percentage * weights.fileFormat +
      breakdown.structure.percentage * weights.structure +
      breakdown.keywords.percentage * weights.keywords +
      breakdown.formatting.percentage * weights.formatting +
      breakdown.contact.percentage * weights.contact

    return Math.round(weightedScore)
  }
}
