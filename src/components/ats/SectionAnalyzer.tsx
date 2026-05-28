import { cn } from '@/lib/utils'
import { SectionAnalysis } from '@/types/analysis'
import { 
  GraduationCap, 
  Briefcase, 
  Code, 
  FolderKanban, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Lightbulb
} from 'lucide-react'

interface SectionAnalyzerProps {
  analysis: SectionAnalysis
  className?: string
}

export function SectionAnalyzer({ analysis, className }: SectionAnalyzerProps) {
  const sections = [
    {
      id: 'education',
      name: 'Education',
      hasSection: analysis.hasEducation,
      details: analysis.educationDetails,
      icon: GraduationCap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'experience',
      name: 'Experience',
      hasSection: analysis.hasExperience,
      details: analysis.experienceDetails,
      icon: Briefcase,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      id: 'skills',
      name: 'Skills',
      hasSection: analysis.hasSkills,
      details: analysis.skillsDetails,
      icon: Code,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 'projects',
      name: 'Projects',
      hasSection: analysis.hasProjects,
      details: analysis.projectsDetails,
      icon: FolderKanban,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ]

  const getQualityBadge = (quality?: string) => {
    switch (quality) {
      case 'strong':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Strong
          </span>
        )
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <AlertCircle className="w-3 h-3" />
            Moderate
          </span>
        )
      case 'weak':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            Weak
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Section Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={cn(
              "relative p-4 rounded-xl border transition-all duration-300 animate-fade-in-up",
              section.hasSection
                ? "bg-white/50 border-border/50 hover:border-primary/30"
                : "bg-red-50/50 border-red-200/50"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "p-3 rounded-xl mb-3",
                  section.hasSection ? section.bgColor : "bg-red-100"
                )}
              >
                <section.icon
                  className={cn(
                    "w-6 h-6",
                    section.hasSection ? section.color : "text-red-500"
                  )}
                />
              </div>
              <h4 className="font-semibold text-sm mb-1">{section.name}</h4>
              {section.hasSection ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Detected
                  </span>
                  {section.details && getQualityBadge(section.details.quality)}
                </div>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  Missing
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Missing Sections Warning */}
      {analysis.missingSections.length > 0 && (
        <div className="relative p-5 rounded-xl bg-red-50/50 backdrop-blur-sm border border-red-200/50 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-800 mb-2">
                Missing Sections Detected
              </h4>
              <p className="text-sm text-red-600 mb-3">
                The following sections were not found in your resume:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSections.map((section) => (
                  <span
                    key={section}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weak Sections */}
      {analysis.weakSections.length > 0 && (
        <div className="relative p-5 rounded-xl bg-yellow-50/50 backdrop-blur-sm border border-yellow-200/50 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Sections Needing Improvement
              </h4>
              <p className="text-sm text-yellow-700 mb-3">
                The following sections could be strengthened:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.weakSections.map((section) => (
                  <span
                    key={section}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                  >
                    {section}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Section Analysis */}
      <div className="group relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Section Analysis Details
        </h3>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={cn(
                "p-4 rounded-xl border transition-all duration-300 animate-slide-in-right",
                section.hasSection
                  ? "bg-muted/30 border-border/30"
                  : "bg-red-50/50 border-red-200/30"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "p-2 rounded-lg flex-shrink-0",
                    section.hasSection ? section.bgColor : "bg-red-100"
                  )}
                >
                  <section.icon
                    className={cn(
                      "w-5 h-5",
                      section.hasSection ? section.color : "text-red-500"
                    )}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{section.name}</h4>
                    {section.hasSection && section.details && getQualityBadge(section.details.quality)}
                  </div>
                  
                  {section.hasSection && section.details ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {section.details.wordCount} words detected
                      </p>
                      {section.details.keyPoints.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {section.details.keyPoints.map((point, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                            >
                              {point}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">
                      This section was not detected in your resume.
                    </p>
                  )}
                </div>
                
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="group relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h3 className="relative text-xl font-semibold mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Improvement Suggestions
          </h3>

          <div className="space-y-3">
            {analysis.suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.section}-${index}`}
                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-slide-in-right"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs rounded-full font-medium",
                      suggestion.priority === 'high'
                        ? "bg-red-100 text-red-600"
                        : suggestion.priority === 'medium'
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    )}
                  >
                    {suggestion.priority}
                  </span>
                  <span className="font-medium">{suggestion.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionAnalyzer
