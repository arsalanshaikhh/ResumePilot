import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Plotly type definitions for CDN version
interface PlotlyConfig {
  responsive: boolean
  displayModeBar: boolean
  staticPlot: boolean
  toImageButtonOptions?: Record<string, unknown>
}

interface PlotlyLayout {
  polar?: Record<string, unknown>
  xaxis?: Record<string, unknown>
  yaxis?: Record<string, unknown>
  paper_bgcolor?: string
  plot_bgcolor?: string
  margin?: { t: number; r: number; b: number; l: number }
  showlegend?: boolean
  hovermode?: string
  bargap?: number
  title?: Record<string, unknown>
}

interface PlotlyData {
  type?: string
  x?: string[]
  y?: number[]
  r?: number[]
  theta?: string[]
  fill?: string
  fillcolor?: string
  line?: Record<string, unknown>
  marker?: Record<string, unknown>
  hovertemplate?: string
  name?: string
  hoverinfo?: string
}

interface PlotlyHTMLElement extends HTMLElement {
  data?: PlotlyData[]
  layout?: PlotlyLayout
  config?: PlotlyConfig
}

interface PlotlyAPI {
  newPlot(root: string | HTMLElement, data: PlotlyData[], layout?: PlotlyLayout, config?: PlotlyConfig): Promise<void>
  react(root: string | HTMLElement, data: PlotlyData[], layout?: PlotlyLayout, config?: PlotlyConfig): Promise<void>
  Plots: {
    resize(root: string | HTMLElement): void
  }
}

declare global {
  interface Window {
    Plotly: PlotlyAPI
  }
}

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

// Vibrant modern color palette
const colors = [
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
  '#3B82F6', // Blue
]

// Get gradient color based on score value
const getGradientColor = (value: number): string => {
  if (value >= 90) return '#10B981' // Emerald - excellent
  if (value >= 80) return '#14B8A6' // Teal - great
  if (value >= 70) return '#3B82F6' // Blue - good
  if (value >= 60) return '#F59E0B' // Amber - okay
  if (value >= 50) return '#F97316' // Orange - below average
  return '#EF4444' // Red - needs improvement
}

// Get a vibrant color from palette based on index
const getColorByIndex = (index: number): string => {
  return colors[index % colors.length]
}

// Generate gradient colors for bar chart
const getBarGradientColors = (data: ScoreData[]) => {
  return data.map((item, index) => getColorByIndex(index))
}

export function ScoreChart({ 
  data, 
  type = 'bar', 
  className,
  showAnimation = true 
}: ScoreChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const isMounted = useRef(true)
  const prevDataRef = useRef<ScoreData[]>([])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current || !window.Plotly || data.length === 0) return

    const categories = data.map(item => item.category)
    const values = data.map(item => item.value)
    const gradientColors = getBarGradientColors(data)

    let plotData: PlotlyData[]
    let layout: PlotlyLayout

    // Animation settings
    const animationConfig = showAnimation ? {
      transition: {
        duration: 800,
        easing: 'cubic-in-out'
      },
      frame: {
        duration: 800,
        redraw: true
      }
    } : {}

    if (type === 'radar') {
      // Enhanced Radar chart with multiple traces for visual appeal
      const radarTraces: PlotlyData[] = [
        // Outer glow trace (larger, more transparent)
        {
          type: 'scatterpolar',
          r: [...values, values[0]],
          theta: [...categories, categories[0]],
          fill: 'toself',
          fillcolor: 'rgba(99, 102, 241, 0.1)',
          line: {
            color: 'rgba(99, 102, 241, 0.3)',
            width: 8
          },
          marker: {
            size: 0
          },
          name: 'Background',
          hoverinfo: 'skip'
        },
        // Main filled trace
        {
          type: 'scatterpolar',
          r: [...values, values[0]],
          theta: [...categories, categories[0]],
          fill: 'toself',
          fillcolor: 'rgba(99, 102, 241, 0.25)',
          line: {
            color: '#6366F1',
            width: 3
          },
          marker: {
            color: gradientColors,
            size: 10,
            line: {
              color: 'white',
              width: 2
            }
          },
          hovertemplate: '<b>%{theta}</b><br>Score: %{r}<extra></extra>',
          name: 'Score'
        },
        // Inner highlight trace
        {
          type: 'scatterpolar',
          r: values.map(v => v * 0.3),
          theta: categories,
          fill: 'toself',
          fillcolor: 'rgba(139, 92, 246, 0.15)',
          line: {
            color: '#8B5CF6',
            width: 1,
            dash: 'dot'
          },
          marker: {
            size: 0
          },
          name: 'Inner',
          hoverinfo: 'skip'
        }
      ]
      
      plotData = radarTraces

      layout = {
        polar: {
          radialaxis: {
            visible: true,
            range: [0, 100],
            tickfont: {
              size: 11,
              color: '#6B7280',
              family: 'Inter, system-ui, -apple-system, sans-serif'
            },
            ticks: 'outside',
            showline: true,
            linecolor: 'rgba(107, 114, 128, 0.3)',
            gridcolor: 'rgba(107, 114, 128, 0.15)',
            gridwidth: 1
          },
          angularaxis: {
            tickfont: {
              size: 13,
              color: '#374151',
              family: 'Inter, system-ui, -apple-system, sans-serif'
            },
            tickmode: 'array',
            tickvals: categories,
            ticktext: categories,
            linecolor: 'rgba(107, 114, 128, 0.3)',
            gridcolor: 'rgba(107, 114, 128, 0.15)'
          },
          bgcolor: 'transparent'
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { t: 50, r: 50, b: 50, l: 50 },
        showlegend: false,
        hovermode: 'closest',
        title: {
          text: 'Resume Score Analysis',
          font: {
            size: 18,
            color: '#1F2937',
            family: 'Inter, system-ui, -apple-system, sans-serif'
          },
          y: 0.98,
          yanchor: 'top'
        }
      }
    } else {
      // Enhanced Bar chart with gradient-like effect using color array
      plotData = [{
        type: 'bar',
        x: categories,
        y: values,
        marker: {
          color: gradientColors,
          line: {
            color: gradientColors.map(c => c),
            width: 2
          },
          opacity: 0.95
        },
        hovertemplate: '<b>%{x}</b><br>Score: %{y}<extra></extra>',
        name: 'Score'
      }]

      layout = {
        xaxis: {
          title: '',
          tickfont: {
            size: 12,
            color: '#374151',
            family: 'Inter, system-ui, -apple-system, sans-serif'
          },
          tickangle: -15,
          showgrid: false,
          zeroline: false,
          showline: true,
          linecolor: 'rgba(107, 114, 128, 0.3)'
        },
        yaxis: {
          title: '',
          range: [0, 105],
          tickfont: {
            size: 11,
            color: '#6B7280',
            family: 'Inter, system-ui, -apple-system, sans-serif'
          },
          showgrid: true,
          gridcolor: 'rgba(107, 114, 128, 0.15)',
          gridwidth: 1,
          zeroline: false,
          showline: false
        },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        margin: { t: 60, r: 30, l: 45, b: 70 },
        showlegend: false,
        hovermode: 'closest',
        bargap: 0.35,
        title: {
          text: 'Section-wise Score Breakdown',
          font: {
            size: 18,
            color: '#1F2937',
            family: 'Inter, system-ui, -apple-system, sans-serif'
          },
          y: 0.98,
          yanchor: 'top'
        }
      }
    }

    const config: PlotlyConfig = {
      responsive: true,
      displayModeBar: false,
      staticPlot: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'score_chart',
        height: 500,
        width: 700,
        scale: 2
      }
    }

    // Use react for updates, newPlot for initial render
    const chartElement = chartRef.current as PlotlyHTMLElement
    const hasData = chartElement.data && chartElement.data.length > 0
    
    // Check if data actually changed
    const dataChanged = JSON.stringify(prevDataRef.current) !== JSON.stringify(data)
    prevDataRef.current = data

    if (chartElement && hasData && !dataChanged) {
      window.Plotly.react(chartElement, plotData, layout, config)
    } else if (chartElement) {
      window.Plotly.newPlot(chartElement, plotData, layout, config)
    }

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && window.Plotly && isMounted.current) {
        window.Plotly.Plots.resize(chartRef.current)
      }
    }

    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [data, type, showAnimation])

  return (
    <div className={cn("w-full h-[300px]", className)}>
      <div 
        ref={chartRef} 
        className="w-full h-full"
        data-chart-type={type}
      />
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
      {/* Enhanced Tab switcher with gradient backgrounds */}
      <div className="flex justify-center gap-2 relative z-10" role="tablist" aria-label="Chart type selector">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'bar'}
          aria-label="Bar chart view"
          onClick={() => setActiveTab('bar')}
          className={cn(
            "px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer relative overflow-hidden",
            activeTab === 'bar'
              ? "text-white shadow-xl shadow-indigo-500/30"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-indigo-200"
          )}
          style={activeTab === 'bar' ? {
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)'
          } : undefined}
        >
          <span className="relative z-10 flex items-center gap-2">
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
            "px-6 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer relative overflow-hidden",
            activeTab === 'radar'
              ? "text-white shadow-xl shadow-indigo-500/30"
              : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-indigo-200"
          )}
          style={activeTab === 'radar' ? {
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)'
          } : undefined}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Radar Chart
          </span>
        </button>
      </div>
      
      {/* Chart */}
      <ScoreChart data={data} type={activeTab} showAnimation />
    </div>
  )
}

export default ScoreChart
