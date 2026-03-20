import { useState, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles, Target, Lightbulb, TrendingUp, Layout } from 'lucide-react'
import { FileParserService } from '@/services/fileParserService'
import { ATSAnalyzerService } from '@/services/atsAnalyzerService'
import { SectionAnalyzerService } from '@/services/sectionAnalyzerService'
import { ATSAnalysis, SectionAnalysis } from '@/types/analysis'
import { cn } from '@/lib/utils'
import { ScoreBreakdown, ScoreChartCombined, ScoreData, ScoreCategory, SectionAnalyzer } from '@/components/ats'

export default function ATSAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null)
  const [sectionAnalysis, setSectionAnalysis] = useState<SectionAnalysis | null>(null)
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
        await analyzeResume(uploadedFile)
      }
    },
  })

  const analyzeResume = async (uploadedFile: File) => {
    setLoading(true)
    setError(null)

    try {
      const parseResult = await FileParserService.parseFile(uploadedFile)

      if (!parseResult.success || !parseResult.text) {
        throw new Error(parseResult.error || 'Failed to parse file')
      }

      const resumeText = parseResult.text
      
      // Run ATS analysis
      const analysisResult = ATSAnalyzerService.analyzeResume(resumeText)

      setAnalysis({
        id: Date.now().toString(),
        resumeId: uploadedFile.name,
        ...analysisResult,
        analyzedAt: new Date(),
      } as ATSAnalysis)

      // Run section analysis
      const sectionResult = SectionAnalyzerService.analyzeSections(resumeText)
      setSectionAnalysis(sectionResult)
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
    if (score >= 80) return { title: 'Excellent!', desc: 'Your resume is highly ATS-compatible.' }
    if (score >= 60) return { title: 'Good', desc: 'But there are areas for improvement.' }
    return { title: 'Needs Work', desc: 'Improvements needed to pass ATS screening.' }
  }

  /**
   * Maps existing ATS breakdown scores to 4 display categories.
   * 
   * Weight distribution rationale:
   * - Formatting: 70% formatting + 30% file format (combined ATS readability)
   * - Keywords: Direct mapping of keyword optimization score
   * - Experience: Direct mapping of work history clarity score
   * - Skills: 60% keywords + 40% contact (skills inferred from both sources)
   */
  const getScoreCategories = (): ScoreCategory[] => {
    if (!analysis?.breakdown) return []
    
    const breakdown = analysis.breakdown
    
    // Get raw percentage values (each is 0-100)
    const formattingPct = breakdown.formatting?.percentage ?? 0
    const fileFormatPct = breakdown.fileFormat?.percentage ?? 0
    const keywordsPct = breakdown.keywords?.percentage ?? 0
    const structurePct = breakdown.structure?.percentage ?? 0
    const contactPct = breakdown.contact?.percentage ?? 0
    
    return [
      {
        id: 'formatting',
        name: 'Formatting Score',
        value: Math.round(formattingPct * 0.7 + fileFormatPct * 0.3),
        description: 'Resume file format and layout structure'
      },
      {
        id: 'keywords',
        name: 'Keyword Match',
        value: Math.round(keywordsPct),
        description: 'ATS-recognized keywords optimization'
      },
      {
        id: 'experience',
        name: 'Experience Strength',
        value: Math.round(structurePct),
        description: 'Work history clarity and progression'
      },
      {
        id: 'skills',
        name: 'Skills Match',
        value: Math.round(keywordsPct * 0.6 + contactPct * 0.4),
        description: 'Skills alignment with job requirements'
      }
    ]
  }

  const getScoreChartData = (): ScoreData[] => {
    const categories = getScoreCategories()
    return categories.map(cat => ({
      category: cat.name.replace(' Score', '').replace(' Match', '').replace(' Strength', ''),
      value: cat.value,
      fullMark: 100
    }))
  }

  // Memoize computed data to prevent unnecessary recalculations
  const scoreCategories = useMemo(() => getScoreCategories(), [analysis?.breakdown])
  const scoreChartData = useMemo(() => getScoreChartData(), [analysis?.breakdown])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <span className="relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-25" />
            <Target className="relative w-8 h-8 text-primary" />
          </span>
          ATS Compatibility Analyzer
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Upload your resume to check its ATS compatibility and get improvement recommendations
        </p>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "group relative p-8 md:p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-border/50 hover:border-primary/30 hover:bg-white/50"
        )}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <input {...getInputProps()} />
        
        <div className="relative flex flex-col items-center text-center">
          {/* Upload icon */}
          <div className={cn(
            "relative mb-6 p-4 rounded-2xl transition-all duration-300",
            isDragActive ? "bg-primary/20 scale-110" : "bg-muted group-hover:bg-primary/10"
          )}>
            <div className={cn(
              "absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            )} />
            <Upload className={cn(
              "w-10 h-10 transition-colors duration-300",
              isDragActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )} />
          </div>
          
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PDF, DOCX, and TXT files (max 10MB)
          </p>
        </div>
      </div>

      {/* File Info */}
      {file && (
        <div className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 animate-scale-in">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/15">
            <FileText className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          
          {loading && (
            <div className="relative">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-t-primary" />
              <Sparkles className="absolute inset-0 w-6 h-6 text-primary animate-pulse-soft" />
            </div>
          )}
          
          {!loading && analysis && (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-200/50 animate-fade-in">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="grid gap-6 animate-fade-in-up">
          {/* Score Display with Breakdown */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Main Score Circle */}
              <div className="flex-shrink-0">
                <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  ATS Score
                </h3>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    {/* Glow effect */}
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br rounded-full blur-2xl opacity-20",
                      getScoreColor(analysis.score)
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
                          strokeDasharray={`${(analysis.score / 100) * 440} 440`}
                          strokeLinecap="round"
                          className={cn(
                            "transition-all duration-1000 ease-out",
                            getScoreColor(analysis.score).split(' ')[0].replace('from-', 'text-')
                          )}
                          style={{
                            strokeDashoffset: 0,
                            filter: `drop-shadow(0 0 8px hsl(var(--primary) / 0.5))`,
                          }}
                        />
                      </svg>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-foreground">{analysis.score}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className={cn(
                    "text-lg font-semibold",
                    analysis.score >= 80 ? "text-green-600" : analysis.score >= 60 ? "text-yellow-600" : "text-red-500"
                  )}>
                    {getScoreMessage(analysis.score).title}
                  </p>
                  <p className="text-muted-foreground">
                    {getScoreMessage(analysis.score).desc}
                  </p>
                </div>
              </div>

              {/* Score Breakdown with Circular Progress */}
              <div className="flex-1 w-full">
                <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Score Breakdown
                </h3>
                
                <ScoreBreakdown categories={scoreCategories} />
              </div>
            </div>
          </div>

          {/* Animated Chart Visualization */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Score Visualization
            </h3>
            
            <ScoreChartCombined data={scoreChartData} />
          </div>

          {/* Section Analysis */}
          {sectionAnalysis && (
            <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                Section Analysis
              </h3>
              
              <SectionAnalyzer analysis={sectionAnalysis} />
            </div>
          )}

          {/* Keywords */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Keyword Analysis
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">Top Keywords Found</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.relevantKeywords.slice(0, 10).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-full text-sm font-medium border border-primary/10 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-border/30">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{analysis.keywords.totalKeywords}</span> total keywords detected
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Recommendations
            </h3>
            
            <div className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <div 
                  key={rec.id} 
                  className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full font-medium",
                        rec.priority === 'high'
                          ? "bg-red-100 text-red-600"
                          : rec.priority === 'medium'
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      )}
                    >
                      {rec.priority}
                    </span>
                    <span className="font-medium">{rec.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
