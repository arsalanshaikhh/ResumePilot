import { SectionAnalysis, SectionDetails, SectionSuggestion } from '@/types/analysis'

export class SectionAnalyzerService {
  // Regex patterns for section detection
  private static readonly educationPatterns = /education|degree|university|college|bachelor|master|phd|gpa|academic|diploma|certification|coursework/i
  private static readonly experiencePatterns = /experience|work history|employment|job|title|company|worked at|internship|intern|volunteer|professional/i
  private static readonly skillsPatterns = /skills|technical skills|proficient|experienced|technologies|tools|competencies|expertise|proficiencies|technologies/i
  private static readonly projectsPatterns = /projects?|built|developed|created|implemented|designed|launched|led|managed|achieved/i

  // Additional patterns for content quality detection
  private static readonly datePatterns = /\b(19|20)\d{2}\b/
  private static readonly jobTitlePatterns = /\b(senior|junior|lead|manager|engineer|developer|designer|analyst|consultant|coordinator|specialist|director)\b/i

  /**
   * Analyze resume text for section presence and quality
   */
  static analyzeSections(text: string): SectionAnalysis {
    const educationDetails = this.analyzeEducation(text)
    const experienceDetails = this.analyzeExperience(text)
    const skillsDetails = this.analyzeSkills(text)
    const projectsDetails = this.analyzeProjects(text)

    // Determine missing sections
    const missingSections: string[] = []
    if (!educationDetails.present) missingSections.push('Education')
    if (!experienceDetails.present) missingSections.push('Experience')
    if (!skillsDetails.present) missingSections.push('Skills')
    if (!projectsDetails.present) missingSections.push('Projects')

    // Determine weak sections
    const weakSections: string[] = []
    if (educationDetails.present && educationDetails.quality === 'weak') weakSections.push('Education')
    if (experienceDetails.present && experienceDetails.quality === 'weak') weakSections.push('Experience')
    if (skillsDetails.present && skillsDetails.quality === 'weak') weakSections.push('Skills')
    if (projectsDetails.present && projectsDetails.quality === 'weak') weakSections.push('Projects')

    // Generate suggestions
    const suggestions = this.generateSuggestions(
      educationDetails,
      experienceDetails,
      skillsDetails,
      projectsDetails
    )

    return {
      hasEducation: educationDetails.present,
      hasExperience: experienceDetails.present,
      hasSkills: skillsDetails.present,
      hasProjects: projectsDetails.present,
      educationDetails,
      experienceDetails,
      skillsDetails,
      projectsDetails,
      missingSections,
      weakSections,
      suggestions,
    }
  }

  /**
   * Analyze Education section
   */
  private static analyzeEducation(text: string): SectionDetails {
    const hasSection = this.educationPatterns.test(text)
    
    if (!hasSection) {
      return {
        present: false,
        content: '',
        quality: 'weak',
        wordCount: 0,
        keyPoints: [],
      }
    }

    // Extract education-related content
    const lines = text.split('\n')
    const educationLines = lines.filter(line => this.educationPatterns.test(line))
    const content = educationLines.join('\n')
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length

    // Detect quality indicators
    const hasDegree = /\b(bachelor|master|phd|associate|degree)\b/i.test(text)
    const hasUniversity = /\b(university|college|institute|school)\b/i.test(text)
    const hasDate = this.datePatterns.test(content)
    const hasGpa = /\bgpa\b/i.test(text)

    const keyPoints: string[] = []
    if (hasDegree) keyPoints.push('Degree mentioned')
    if (hasUniversity) keyPoints.push('Institution mentioned')
    if (hasDate) keyPoints.push('Dates included')
    if (hasGpa) keyPoints.push('GPA mentioned')

    // Determine quality
    let quality: 'strong' | 'moderate' | 'weak' = 'weak'
    let score = 0
    if (hasDegree) score++
    if (hasUniversity) score++
    if (hasDate) score++
    if (hasGpa) score++
    if (wordCount >= 30) score++
    if (wordCount >= 50) score++

    if (score >= 4) quality = 'strong'
    else if (score >= 2) quality = 'moderate'

    return {
      present: true,
      content,
      quality,
      wordCount,
      keyPoints,
    }
  }

  /**
   * Analyze Experience section
   */
  private static analyzeExperience(text: string): SectionDetails {
    const hasSection = this.experiencePatterns.test(text)
    
    if (!hasSection) {
      return {
        present: false,
        content: '',
        quality: 'weak',
        wordCount: 0,
        keyPoints: [],
      }
    }

    // Extract experience-related content
    const lines = text.split('\n')
    const experienceLines = lines.filter(line => this.experiencePatterns.test(line))
    const content = experienceLines.join('\n')
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length

    // Detect quality indicators
    const hasJobTitle = this.jobTitlePatterns.test(text)
    const hasDate = this.datePatterns.test(content)
    const hasCompany = /\b(company|corp|inc|llc|ltd|inc\.|corp\.|technologies|software|systems|services|consulting)\b/i.test(text)
    const hasActionVerbs = /\b(managed|led|developed|created|implemented|designed|built|achieved|delivered|coordinated)\b/i.test(text)

    const keyPoints: string[] = []
    if (hasJobTitle) keyPoints.push('Job titles found')
    if (hasDate) keyPoints.push('Dates included')
    if (hasCompany) keyPoints.push('Companies mentioned')
    if (hasActionVerbs) keyPoints.push('Action verbs used')

    // Count job entries (look for multiple date ranges or company patterns)
    const dateMatches = content.match(/\b(19|20)\d{2}\b/g)
    const jobCount = dateMatches ? Math.ceil(dateMatches.length / 2) : 0

    // Determine quality
    let quality: 'strong' | 'moderate' | 'weak' = 'weak'
    let score = 0
    if (hasJobTitle) score++
    if (hasDate) score++
    if (hasCompany) score++
    if (hasActionVerbs) score++
    if (wordCount >= 100) score++
    if (jobCount >= 2) score++

    if (score >= 4) quality = 'strong'
    else if (score >= 2) quality = 'moderate'

    return {
      present: true,
      content,
      quality,
      wordCount,
      keyPoints,
    }
  }

  /**
   * Analyze Skills section
   */
  private static analyzeSkills(text: string): SectionDetails {
    const hasSection = this.skillsPatterns.test(text)
    
    if (!hasSection) {
      return {
        present: false,
        content: '',
        quality: 'weak',
        wordCount: 0,
        keyPoints: [],
      }
    }

    // Extract skills-related content
    const lines = text.split('\n')
    const skillsLines = lines.filter(line => this.skillsPatterns.test(line))
    const content = skillsLines.join('\n')
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length

    // Detect skill types
    const hasTechnical = /\b(python|java|javascript|typescript|react|angular|vue|node|sql|aws|azure|docker|kubernetes|linux|html|css|git)\b/i.test(text)
    const hasSoft = /\b(communication|leadership|teamwork|problem.solving|time.management|analytical|creative)\b/i.test(text)
    const hasTools = /\b(jira|confluence|slack|zoom|excel|word|powerpoint|figma|photoshop)\b/i.test(text)

    // Count skill items (look for separators like commas, bullets)
    const skillItems = content.split(/[,;•\n]/)
    const skillCount = skillItems.filter(s => s.trim().length > 0).length

    const keyPoints: string[] = []
    if (hasTechnical) keyPoints.push('Technical skills found')
    if (hasSoft) keyPoints.push('Soft skills found')
    if (hasTools) keyPoints.push('Tools mentioned')

    // Determine quality
    let quality: 'strong' | 'moderate' | 'weak' = 'weak'
    let score = 0
    if (hasTechnical) score += 2
    if (hasSoft) score++
    if (skillCount >= 5) score++
    if (skillCount >= 10) score++
    if (wordCount >= 30) score++

    if (score >= 4) quality = 'strong'
    else if (score >= 2) quality = 'moderate'

    return {
      present: true,
      content,
      quality,
      wordCount,
      keyPoints,
    }
  }

  /**
   * Analyze Projects section
   */
  private static analyzeProjects(text: string): SectionDetails {
    const hasSection = this.projectsPatterns.test(text)
    
    if (!hasSection) {
      return {
        present: false,
        content: '',
        quality: 'weak',
        wordCount: 0,
        keyPoints: [],
      }
    }

    // Extract project-related content
    const lines = text.split('\n')
    const projectLines = lines.filter(line => this.projectsPatterns.test(line))
    const content = projectLines.join('\n')
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length

    // Detect quality indicators
    const hasTechnologies = /\b(python|java|javascript|react|node|aws|azure|docker|sql|mongodb|express)\b/i.test(text)
    const hasOutcomes = /\b(increased|decreased|improved|reduced|delivered|achieved|won|launched)\b/i.test(text)
    const hasMetrics = /\b(\d+%|\d+%|x\d+|\d+x)\b/.test(content)

    // Count project entries
    const projectKeywords = ['project', 'built', 'developed', 'created', 'implemented', 'designed']
    let projectCount = 0
    projectKeywords.forEach(keyword => {
      const matches = content.match(new RegExp(keyword, 'gi'))
      if (matches) projectCount += matches.length
    })

    const keyPoints: string[] = []
    if (hasTechnologies) keyPoints.push('Technologies listed')
    if (hasOutcomes) keyPoints.push('Outcomes described')
    if (hasMetrics) keyPoints.push('Metrics included')

    // Determine quality
    let quality: 'strong' | 'moderate' | 'weak' = 'weak'
    let score = 0
    if (hasTechnologies) score++
    if (hasOutcomes) score++
    if (hasMetrics) score++
    if (wordCount >= 50) score++
    if (projectCount >= 2) score++

    if (score >= 4) quality = 'strong'
    else if (score >= 2) quality = 'moderate'

    return {
      present: true,
      content,
      quality,
      wordCount,
      keyPoints,
    }
  }

  /**
   * Generate suggestions for improving sections
   */
  private static generateSuggestions(
    education: SectionDetails,
    experience: SectionDetails,
    skills: SectionDetails,
    projects: SectionDetails
  ): SectionSuggestion[] {
    const suggestions: SectionSuggestion[] = []

    // Education suggestions
    if (!education.present) {
      suggestions.push({
        section: 'Education',
        type: 'missing',
        title: 'Add Education Section',
        description: 'Include your educational background including degrees, universities, and graduation dates.',
        priority: 'high',
      })
    } else if (education.quality === 'weak') {
      suggestions.push({
        section: 'Education',
        type: 'weak',
        title: 'Strengthen Education Section',
        description: 'Add more details like specific degree name, university, graduation year, and relevant coursework or achievements.',
        priority: 'medium',
      })
    }

    // Experience suggestions
    if (!experience.present) {
      suggestions.push({
        section: 'Experience',
        type: 'missing',
        title: 'Add Experience Section',
        description: 'Include your work history with job titles, company names, dates, and accomplishments.',
        priority: 'high',
      })
    } else if (experience.quality === 'weak') {
      suggestions.push({
        section: 'Experience',
        type: 'weak',
        title: 'Enhance Experience Section',
        description: 'Add more details about your responsibilities and achievements. Use action verbs and quantify results.',
        priority: 'medium',
      })
    }

    // Skills suggestions
    if (!skills.present) {
      suggestions.push({
        section: 'Skills',
        type: 'missing',
        title: 'Add Skills Section',
        description: 'Create a skills section highlighting your technical and soft skills relevant to the job.',
        priority: 'high',
      })
    } else if (skills.quality === 'weak') {
      suggestions.push({
        section: 'Skills',
        type: 'weak',
        title: 'Expand Skills Section',
        description: 'Add more skills, especially technical skills and tools relevant to your target job. Include both hard and soft skills.',
        priority: 'medium',
      })
    }

    // Projects suggestions
    if (!projects.present) {
      suggestions.push({
        section: 'Projects',
        type: 'missing',
        title: 'Add Projects Section',
        description: 'Include relevant projects that demonstrate your skills and experience. Describe your role and technologies used.',
        priority: 'medium',
      })
    } else if (projects.quality === 'weak') {
      suggestions.push({
        section: 'Projects',
        type: 'weak',
        title: 'Improve Project Descriptions',
        description: 'Add more details about your projects including technologies used, your role, and measurable outcomes.',
        priority: 'low',
      })
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }
}
