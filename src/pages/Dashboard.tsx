import { Link } from 'react-router-dom'
import { FileText, Briefcase, TrendingUp, Clock, ArrowRight, Sparkles, Plus, Activity } from 'lucide-react'
import { useState } from 'react'

const stats = [
  { icon: FileText, label: 'Resumes Analyzed', value: '0', color: 'from-blue-500 to-blue-600' },
  { icon: Briefcase, label: 'Jobs Matched', value: '0', color: 'from-green-500 to-green-600' },
  { icon: TrendingUp, label: 'Avg. ATS Score', value: '0%', color: 'from-purple-500 to-purple-600' },
  { icon: Clock, label: 'Analyses This Month', value: '0', color: 'from-orange-500 to-orange-600' },
]

const quickActions = [
  {
    icon: FileText,
    title: 'ATS Analyzer',
    description: 'Upload your resume to check its ATS compatibility and get improvement recommendations.',
    href: '/ats-analyzer',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Briefcase,
    title: 'Job Matcher',
    description: 'Compare your resume against job postings to see how well you match the requirements.',
    href: '/job-matcher',
    color: 'from-green-500 to-green-600',
  },
]

export default function Dashboard() {
  const [hoveredAction, setHoveredAction] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Welcome back! Here's an overview of your resume analysis activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group relative p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-4">
              {/* Icon */}
              <div className={`relative p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shadow-primary/10`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10`} />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {quickActions.map((action, index) => (
          <Link
            key={action.title}
            to={action.href}
            onMouseEnter={() => setHoveredAction(index)}
            onMouseLeave={() => setHoveredAction(null)}
            className="group relative p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 animate-fade-in-up"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${action.color} shadow-lg shadow-primary/15 transition-transform duration-500 group-hover:scale-110`}>
                <action.icon className="h-8 w-8 text-white" />
                
                {/* Glow */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${action.color} rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  {action.title}
                  <Sparkles className={`w-4 h-4 text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${hoveredAction === index ? 'animate-pulse-soft' : ''}`} />
                </h3>
                <p className="text-muted-foreground">
                  {action.description}
                </p>
              </div>
              
              {/* Arrow */}
              <div className={`absolute bottom-6 right-6 p-2 rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300`}>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="border border-border/50 rounded-2xl p-6 md:p-8 bg-white/30 backdrop-blur-sm animate-fade-in-up animation-delay-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>
        </div>
        
        <div className="text-center py-12">
          {/* Empty state illustration */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse-soft" />
            <div className="relative flex items-center justify-center w-full h-full">
              <FileText className="w-12 h-12 text-primary/40" />
            </div>
          </div>
          
          <p className="text-muted-foreground text-lg mb-6">
            No recent activity. Start by analyzing your first resume!
          </p>
          
          <Link
            to="/ats-analyzer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Analyze Your Resume
          </Link>
        </div>
      </div>
    </div>
  )
}
