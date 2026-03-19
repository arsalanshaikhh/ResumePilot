import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, Briefcase, Target, Sparkles, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react'
import { FileParserService } from '@/services/fileParserService'
import { JobMatch } from '@/types/analysis'
import { cn } from '@/lib/utils'

export default function JobMatcher() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [match, setMatch] = useState<JobMatch | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0]
        const validation = FileParserService.validateFile(uploadedFile)

        if (!validation.valid) {
          setError(validation.error || 'Invalid file')
          return
        }

        setFile(uploadedFile)
        setError(null)
      }
    },
  })

  const analyzeMatch = async () => {
    if (!file || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const parseResult = await FileParserService.parseFile(file)

      if (!parseResult.success || !parseResult.text) {
        throw new Error(parseResult.error || 'Failed to parse file')
      }

      const resumeWords = parseResult.text.toLowerCase().split(/\s+/)
      const jobWords = jobDescription.toLowerCase().split(/\s+/)

      const resumeKeywords = new Set(resumeWords.filter((word) => word.length > 3))
      const jobKeywords = new Set(jobWords.filter((word) => word.length > 3))

      const matchingKeywords = [...resumeKeywords].filter((keyword) => jobKeywords.has(keyword))
      const matchScore = Math.round((matchingKeywords.length / jobKeywords.size) * 100)

      const gaps = [...jobKeywords]
        .filter((keyword) => !resumeKeywords.has(keyword))
        .slice(0, 10)
        .map((skill) => ({
          skill,
          importance: 'important' as const,
          suggestion: `Consider adding ${skill} to your resume if you have relevant experience`,
        }))

      const strengths = matchingKeywords.slice(0, 10)

      setMatch({
        id: Date.now().toString(),
        resumeId: file.name,
        jobDescription,
        matchScore,
        breakdown: {
          requiredSkills: {
            score: matchScore,
            maxScore: 100,
            percentage: matchScore,
            details: [`Found ${matchingKeywords.length} matching keywords`],
          },
          experienceLevel: {
            score: 70,
            maxScore: 100,
            percentage: 70,
            details: ['Experience level assessment based on resume content'],
          },
          education: {
            score: 80,
            maxScore: 100,
            percentage: 80,
            details: ['Education requirements assessment'],
          },
          industryKeywords: {
            score: matchScore,
            maxScore: 100,
            percentage: matchScore,
            details: [`Industry keyword match: ${matchScore}%`],
          },
        },
        gaps,
        strengths,
        recommendations: [
          'Add missing keywords from the job description to your resume',
          'Highlight relevant experience that matches the job requirements',
          'Ensure your resume format is ATS-friendly',
        ],
        analyzedAt: new Date(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { title: 'Excellent Match!', desc: 'Your resume aligns well with this job.' }
    if (score >= 60) return { title: 'Good Match', desc: 'Consider adding missing keywords.' }
    return { title: 'Weak Match', desc: 'Significant improvements needed.' }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <span className="relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-25" />
            <Briefcase className="relative w-8 h-8 text-primary" />
          </span>
          Job Description Matcher
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Upload your resume and paste a job description to see how well you match
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Resume Upload */}
        <div className="space-y-4 animate-fade-in-up">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Your Resume
          </h2>
          
          <div
            {...getRootProps()}
            className={cn(
              "group relative p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden",
              isDragActive 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : "border-border/50 hover:border-primary/30 hover:bg-white/50"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <input {...getInputProps()} />
            
            <div className="relative flex flex-col items-center text-center">
              <div className={cn(
                "relative mb-4 p-3 rounded-xl transition-all duration-300",
                isDragActive ? "bg-primary/20 scale-110" : "bg-muted group-hover:bg-primary/10"
              )}>
                <Upload className={cn(
                  "w-8 h-8 transition-colors duration-300",
                  isDragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )} />
              </div>
              
              <p className="text-lg font-medium mb-1">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
              </p>
              <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files (max 10MB)</p>
            </div>
          </div>

          {file && (
            <div className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-2.5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/15">
                <FileText className="h-5 w-5 text-white" />
              </div>
              
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="space-y-4 animate-fade-in-up animation-delay-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Job Description
          </h2>
          
          <div className="relative">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-64 p-4 rounded-2xl border border-border/50 bg-white/50 backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
            />
            <div className="absolute bottom-4 right-4">
              <span className="text-xs text-muted-foreground">
                {jobDescription.length} characters
              </span>
            </div>
          </div>
          
          <button
            onClick={analyzeMatch}
            disabled={!file || !jobDescription.trim() || loading}
            className={cn(
              "w-full py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
              !file || !jobDescription.trim() || loading
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
            )}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze Match
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-200/50 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Match Results */}
      {match && (
        <div className="grid gap-6 lg:grid-cols-2 animate-fade-in-up">
          {/* Match Score */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Match Score
            </h3>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br rounded-full blur-2xl opacity-20",
                  getScoreColor(match.matchScore)
                )} />
                
                <div className="relative w-40 h-40 md:w-48 md:h-48">
                  <svg className="w-full h-full circular-progress">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-muted/20"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={`${(match.matchScore / 100) * 440} 440`}
                      strokeLinecap="round"
                      className={cn(
                        "transition-all duration-1000 ease-out",
                        getScoreColor(match.matchScore).split(' ')[0].replace('from-', 'text-')
                      )}
                      style={{
                        strokeDashoffset: 0,
                        filter: `drop-shadow(0 0 8px hsl(var(--primary) / 0.5))`,
                      }}
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-gradient">{match.matchScore}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className={cn(
                "text-lg font-semibold",
                match.matchScore >= 80 ? "text-green-600" : match.matchScore >= 60 ? "text-yellow-600" : "text-red-500"
              )}>
                {getScoreMessage(match.matchScore).title}
              </p>
              <p className="text-muted-foreground">
                {getScoreMessage(match.matchScore).desc}
              </p>
            </div>
          </div>

          {/* Strengths */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Matching Strengths
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {match.strengths.map((strength, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-green-500/5 text-green-600 rounded-full text-sm font-medium border border-green-500/20 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          {/* Gaps */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Skill Gaps
            </h3>
            
            <div className="space-y-3">
              {match.gaps.map((gap, index) => (
                <div 
                  key={index} 
                  className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-medium">{gap.skill}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{gap.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Recommendations
            </h3>
            
            <ul className="space-y-3">
              {match.recommendations.map((rec, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ArrowRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
