import { SignUp, Show } from '@clerk/react'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Rocket } from 'lucide-react'

function RedirectToDashboard() {
  const navigate = useNavigate()
  
  useEffect(() => {
    navigate('/dashboard')
  }, [navigate])
  
  return null
}

export default function SignUpPage() {
  return (
    <>
      <Show when="signed-in">
        <RedirectToDashboard />
      </Show>
      
      <div className="min-h-screen relative overflow-hidden bg-background">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          {/* Gradient orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse-soft" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
          
          {/* Grid pattern */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary to-primary/60 rounded-2xl blur-xl opacity-30 animate-pulse-soft" />
                  <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg shadow-primary/25">
                    <Rocket className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gradient">Get Started</h1>
              <p className="text-muted-foreground mt-2">Create your ResumePilot account</p>
            </div>

            {/* Card */}
            <div className="relative p-8 rounded-3xl bg-white/50 backdrop-blur-xl border border-white/20 shadow-soft animate-fade-in-up animation-delay-200">
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              
              <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                appearance={{
                  elements: {
                    rootBox: 'mx-auto',
                    card: 'shadow-none bg-transparent',
                    formButtonPrimary: 'bg-gradient-to-r from-primary to-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 rounded-xl',
                    formFieldInput: 'rounded-xl border-border/50 focus:ring-primary/30 focus:border-primary bg-white/50 backdrop-blur-sm transition-all duration-300',
                    formFieldLabel: 'text-foreground font-medium',
                    footerActionLink: 'text-primary hover:text-primary/80 transition-colors',
                    dividerLine: 'bg-border/50',
                    dividerText: 'text-muted-foreground',
                    headerTitle: 'text-foreground font-bold',
                    headerSubtitle: 'text-muted-foreground',
                  },
                }}
              />
            </div>

            {/* Footer */}
            <p className="text-center mt-8 text-muted-foreground animate-fade-in animation-delay-300">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-primary font-medium hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
