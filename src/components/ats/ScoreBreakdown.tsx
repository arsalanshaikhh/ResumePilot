import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Layout, FileText, Search, Lightbulb } from 'lucide-react'

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  label?: string
  icon?: React.ReactNode
}

function CircularProgress({
  value,
  size = 100,
  strokeWidth = 8,
  className,
  label,
  icon
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const getColorClass = () => {
    if (value >= 80) return 'text-green-500'
    if (value >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const [gradientId] = useState(() => `score-gradient-${Math.random().toString(36).substr(2, 9)}`)

  const getGradientId = () => gradientId

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          <defs>
            <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" className={getColorClass()} />
              <stop offset="100%" stopColor="currentColor" className={cn(getColorClass(), "opacity-60")} />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted/20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${getGradientId()})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px hsl(var(--primary) / 0.4))`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <div className="mb-1 text-muted-foreground">{icon}</div>}
          <span className="text-2xl font-bold text-gradient">{value}</span>
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>
      
      {label && (
        <span className="mt-3 text-sm font-medium text-center text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  )
}

export interface ScoreCategory {
  id: string
  name: string
  value: number
  description: string
}

interface ScoreBreakdownProps {
  categories: ScoreCategory[]
  className?: string
}

export function ScoreBreakdown({ categories, className }: ScoreBreakdownProps) {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'formatting':
        return <Layout className="w-5 h-5" />
      case 'keywords':
        return <Search className="w-5 h-5" />
      case 'experience':
        return <FileText className="w-5 h-5" />
      case 'skills':
        return <Lightbulb className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getCategoryDescription = (id: string) => {
    switch (id) {
      case 'formatting':
        return 'Resume formatting and file structure'
      case 'keywords':
        return 'ATS keyword optimization'
      case 'experience':
        return 'Work experience clarity'
      case 'skills':
        return 'Skills match with job requirements'
      default:
        return ''
    }
  }

  return (
    <div className={cn("grid grid-cols-2 gap-6", className)}>
      {categories.map((category, index) => (
        <div
          key={category.id}
          className="relative p-5 rounded-xl bg-white/50 backdrop-blur-sm border border-border/50 group animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Hover gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex flex-col items-center">
            <CircularProgress
              value={category.value}
              size={90}
              strokeWidth={7}
              icon={getCategoryIcon(category.id)}
            />
            
            <h4 className="mt-3 text-sm font-semibold text-center">
              {category.name}
            </h4>
            
            <p className="mt-1 text-xs text-center text-muted-foreground line-clamp-2">
              {category.description || getCategoryDescription(category.id)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ScoreBreakdown
