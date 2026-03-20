import { useState, useEffect } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { cn } from '@/lib/utils'

export interface ScoreData {
  category: string
  value: number
  fullMark: number
}

interface ScoreChartProps {
  data: ScoreData[]
  type?: 'radar' | 'bar'
  className?: string
  showAnimation?: boolean
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; payload: ScoreData }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-border/50">
        <p className="font-semibold text-sm">{label || payload[0]?.payload?.category}</p>
        <p className="text-primary font-bold">
          Score: {payload[0]?.value}
        </p>
      </div>
    )
  }
  return null
}

export function ScoreChart({ 
  data, 
  type = 'bar', 
  className,
  showAnimation = true 
}: ScoreChartProps) {
  const [animationDuration, setAnimationDuration] = useState(0)

  useEffect(() => {
    if (showAnimation) {
      setAnimationDuration(800)
    } else {
      setAnimationDuration(0)
    }
  }, [showAnimation])

  const radarData = data.map(item => ({
    ...item,
    fullMark: 100
  }))

  const getBarColor = (value: number) => {
    if (value >= 80) return '#10b981'
    if (value >= 60) return '#f59e0b'
    return '#ef4444'
  }

  if (type === 'radar') {
    return (
      <div className={cn("w-full h-[300px]", className)}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={70} data={radarData}>
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                </linearGradient>
              ))}
            </defs>
            <PolarGrid stroke="hsl(var(--border) / 0.5)" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.3)"
              fillOpacity={0.6}
              strokeWidth={2}
              animationDuration={animationDuration}
              animationEasing="ease-out"
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          barSize={40}
        >
          <defs>
            {data.map((_, index) => (
              <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={getBarColor(data[index].value)} stopOpacity={0.9} />
                <stop offset="100%" stopColor={getBarColor(data[index].value)} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            interval={0}
            angle={-10}
            textAnchor="end"
            height={60}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            name="Score"
            radius={[6, 6, 0, 0]}
            animationDuration={animationDuration}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#barGradient${index})`}
                stroke={getBarColor(entry.value)}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Combined component with both radar and bar charts
interface ScoreChartCombinedProps {
  data: ScoreData[]
  className?: string
}

export function ScoreChartCombined({ data, className }: ScoreChartCombinedProps) {
  const [activeTab, setActiveTab] = useState<'bar' | 'radar'>('bar')

  return (
    <div className={cn("space-y-4", className)}>
      {/* Tab switcher */}
      <div className="flex justify-center gap-2 relative z-10" role="tablist" aria-label="Chart type selector">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'bar'}
          aria-label="Bar chart view"
          onClick={() => setActiveTab('bar')}
          className={cn(
            "px-4 py-1.5 text-sm rounded-full transition-all duration-200 cursor-pointer",
            activeTab === 'bar'
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          Bar Chart
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'radar'}
          aria-label="Radar chart view"
          onClick={() => setActiveTab('radar')}
          className={cn(
            "px-4 py-1.5 text-sm rounded-full transition-all duration-200 cursor-pointer",
            activeTab === 'radar'
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          Radar Chart
        </button>
      </div>
      
      {/* Chart */}
      <ScoreChart data={data} type={activeTab} showAnimation />
    </div>
  )
}

export default ScoreChart
