import { Link } from 'react-router-dom'
import { FileText, Briefcase, CheckCircle, Zap, Shield, BarChart, ArrowRight, Sparkles, Star, ChevronRight, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { Show, UserButton, useUser } from '@clerk/react'

const features = [
  {
    icon: FileText,
    title: 'ATS Compatibility Checker',
    description: 'Analyze your resume for Applicant Tracking System compatibility and get actionable recommendations.',
  },
  {
    icon: Briefcase,
    title: 'Job Description Matcher',
    description: 'Compare your resume against job postings and see how well you match the requirements.',
  },
  {
    icon: CheckCircle,
    title: 'Smart Recommendations',
    description: 'Get AI-powered suggestions to improve your resume\'s impact and visibility.',
  },
  {
    icon: Zap,
    title: 'Instant Analysis',
    description: 'Upload your resume and get detailed analysis results in seconds.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared. Your privacy is our priority.',
  },
  {
    icon: BarChart,
    title: 'Detailed Scoring',
    description: 'Get comprehensive scores with breakdowns across multiple categories.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    content: 'ResumePilot helped me optimize my resume and I landed my dream job!',
    rating: 5,
  },
  {
    name: 'Michael Torres',
    role: 'Product Manager at Meta',
    content: 'The ATS analysis was incredibly detailed. Highly recommended!',
    rating: 5,
  },
]

export default function Home() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section Background */}
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

      {/* Navigation */}
      <header className="relative z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-25 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg shadow-primary/25">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold text-gradient">ResumePilot</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Show when="signed-out">
                <Link
                  to="/sign-in"
                  className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                </Link>
              </Show>
              <Show when="signed-in">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <UserButton />
              </Show>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Resume Optimization</span>
          </div>

          {/* Personalized welcome for authenticated users */}
          <Show when="signed-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm animate-fade-in">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600">Welcome back, {user?.firstName || 'User'}!</span>
            </div>
          </Show>
          
          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 animate-fade-in-up">
            <span className="text-foreground">Optimize Your Resume with </span>
            <span className="text-gradient bg-gradient-to-r from-primary via-primary/80 to-primary-400">
              AI-Powered
            </span>
            <br />
            <span className="text-foreground">Analysis</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            ResumePilot helps you create ATS-friendly resumes and match them perfectly to job descriptions using advanced AI technology.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
            <Show when="signed-out">
              <Link
                to="/sign-up"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/sign-in"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-foreground bg-white/50 backdrop-blur-sm border border-border rounded-2xl hover:bg-white/80 hover:border-primary/30 transition-all duration-300"
              >
                Sign In
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  Go to Dashboard
                  <LayoutDashboard className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Show>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up animation-delay-500">
            <div>
              <div className="text-3xl font-bold text-gradient">10K+</div>
              <div className="text-sm text-muted-foreground">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gradient">4.9</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to optimize your resume and land your dream job
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
              className="group relative p-6 lg:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className="relative mb-5 inline-flex">
                <div className={`absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl blur-md transition-all duration-500 ${activeFeature === index ? 'opacity-50 scale-110' : 'opacity-0 scale-100'}`} />
                <div className="relative flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="relative text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="relative text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              
              {/* Arrow indicator */}
              <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300`}>
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Loved by Job Seekers
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals who improved their careers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-lg mb-4">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0">
            <svg className="absolute inset-0 h-full w-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>
          
          {/* Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative px-8 py-16 md:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Join thousands of job seekers who have improved their resumes with ResumePilot.
            </p>
            <Show when="signed-out">
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary bg-white rounded-2xl hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Show>
            <Show when="signed-in">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary bg-white rounded-2xl hover:shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
              >
                Go to Dashboard
                <LayoutDashboard className="w-5 h-5 ml-2" />
              </Link>
            </Show>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-border/50">
        <div className="text-center text-muted-foreground">
          <p>&copy; 2024 ResumePilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
