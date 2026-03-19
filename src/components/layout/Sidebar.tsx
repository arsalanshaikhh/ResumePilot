import { Link, useLocation } from 'react-router-dom'
import { Home, FileText, Briefcase, Settings, Sparkles, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'ATS Analyzer', href: '/ats-analyzer', icon: FileText },
  { name: 'Job Matcher', href: '/job-matcher', icon: Briefcase },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <aside className="hidden md:flex w-64 flex-col bg-background/50 backdrop-blur-sm">
      {/* Sidebar background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <nav className="relative flex-1 space-y-2 p-4 pt-6">
        <div className="mb-6 px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        
        {navigation.map((item, index) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
              className={cn(
                'group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300',
                isActive
                  ? 'text-primary bg-primary/10 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-r-full" />
              )}
              
              {/* Icon container */}
              <div 
                className={cn(
                  "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/25" 
                    : "bg-muted group-hover:bg-muted/80"
                )}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
                
                {/* Glow effect on hover */}
                {hoveredItem === item.name && !isActive && (
                  <div className="absolute inset-0 bg-primary/10 rounded-lg animate-pulse-soft" />
                )}
              </div>
              
              {/* Label */}
              <span className="flex-1">{item.name}</span>
              
              {/* Active sparkle */}
              {isActive && (
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse-soft" />
              )}
              
              {/* Hover chevron */}
              <ChevronRight 
                className={cn(
                  "w-4 h-4 opacity-0 -translate-x-2 transition-all duration-300",
                  hoveredItem === item.name && "opacity-100 translate-x-0"
                )} 
              />
              
              {/* Hover background effect */}
              {hoveredItem === item.name && !isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-xl -z-10" />
              )}
            </Link>
          )
        })}
      </nav>
      
      {/* Bottom section with gradient */}
      <div className="relative p-4 mt-auto">
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="mt-4 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/10">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Pro Tip:</span> Keep your resume updated
          </p>
        </div>
      </div>
    </aside>
  )
}
