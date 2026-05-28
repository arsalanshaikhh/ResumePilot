import { useState } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

const COLORS = [
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
]

export function ScoreChart({ data, type = 'bar', className, showAnimation = true }: ScoreChartProps) {
  if (data.length === 0) return null

  return (
    <div className={cn('w-full h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'radar' ? (
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(107,114,128,0.2)" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: '#374151', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#6366F1"
              fill="#6366F1"
              fillOpacity={0.25}
              isAnimationActive={showAnimation}
              dot={{ r: 4, fill: '#6366F1', stroke: 'white', strokeWidth: 2 }}
            />
            <Tooltip
              formatter={(value) => [`${value}`, 'Score']}
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(107,114,128,0.2)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
          </RadarChart>
        ) : (
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(107,114,128,0.15)" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: '#374151', fontSize: 12, fontFamily: 'Inter, system-ui, sans-serif' }}
              axisLine={{ stroke: 'rgba(107,114,128,0.3)' }}
              tickLine={false}
              angle={-10}
              textAnchor="end"
            />
            <YAxis
              domain={[0, 105]}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value}`, 'Score']}
              cursor={{ fill: 'rgba(99,102,241,0.05)' }}
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(107,114,128,0.2)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={showAnimation}>
              {data.map((_entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

interface ScoreChartCombinedProps {
  data: ScoreData[]
  className?: string
}

export function ScoreChartCombined({ data, className }: ScoreChartCombinedProps) {
  const [activeTab, setActiveTab] = useState<'bar' | 'radar'>('bar')

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-center gap-2" role="tablist" aria-label="Chart type selector">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'bar'}
          aria-label="Bar chart view"
          onClick={() => setActiveTab('bar')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer',
            activeTab === 'bar'
              ? 'text-white shadow-xl shadow-indigo-500/30'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-indigo-200'
          )}
          style={activeTab === 'bar' ? { background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)' } : undefined}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Bar Chart
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'radar'}
          aria-label="Radar chart view"
          onClick={() => setActiveTab('radar')}
          className={cn(
            'px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer',
            activeTab === 'radar'
              ? 'text-white shadow-xl shadow-indigo-500/30'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-indigo-200'
          )}
          style={activeTab === 'radar' ? { background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)' } : undefined}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Radar Chart
          </span>
        </button>
      </div>

      <ScoreChart data={data} type={activeTab} showAnimation />
    </div>
  )
}

export default ScoreChart
