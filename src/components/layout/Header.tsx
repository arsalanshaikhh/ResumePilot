import { UserButton } from '@clerk/clerk-react'
import { Menu, X, Rocket, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'ATS Analyzer', href: '/ats-analyzer' },
  { name: 'Job Matcher', href: '/job-matcher' },
  { name: 'Settings', href: '/settings' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism header */}
      <div className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-soft">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
        
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-25 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-md">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
                  ResumePilot
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {item.name}
                      {isActive && (
                        <Sparkles className="w-3 h-3 text-primary animate-pulse-soft" />
                      )}
                    </span>
                    {isActive && (
                      <div className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {/* User Button */}
              <div className="transform transition-transform duration-200 hover:scale-105">
                <UserButton afterSignOutUrl="/" />
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden relative p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5">
                  <Menu 
                    className={cn(
                      "absolute inset-0 w-5 h-5 transition-all duration-300",
                      mobileMenuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                    )} 
                  />
                  <X 
                    className={cn(
                      "absolute inset-0 w-5 h-5 transition-all duration-300",
                      mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                    )} 
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 py-4 bg-white/50 backdrop-blur-lg border-t border-white/20 space-y-1">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                  style={{ 
                    animationDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                    opacity: mobileMenuOpen ? 1 : 0,
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-10px)'
                  }}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
