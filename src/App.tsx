import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

// Lazy load pages for code splitting
const Home = lazy(() => import('@/pages/Home'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const ATSAnalyzer = lazy(() => import('@/pages/ATSAnalyzer'))
const JobMatcher = lazy(() => import('@/pages/JobMatcher'))
const Settings = lazy(() => import('@/pages/Settings'))
const SignIn = lazy(() => import('@/pages/auth/SignIn'))
const SignUp = lazy(() => import('@/pages/auth/SignUp'))
const ErrorPage = lazy(() => import('@/pages/ErrorPage'))

// Components
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { LoadingFallback, PageSkeleton } from '@/components/common/LoadingFallback'
import Layout from '@/components/layout/Layout'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key')
}

/**
 * Main App component with:
 * - Lazy loading for code splitting
 * - Error boundaries for error handling
 * - Suspense boundaries for loading states
 */
function App(): React.JSX.Element {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<LoadingFallback fullScreen message="Loading application..." />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/sign-in/*" element={<SignIn />} />
              <Route path="/sign-up/*" element={<SignUp />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ats-analyzer"
                element={
                  <ProtectedRoute>
                    <ATSAnalyzer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/job-matcher"
                element={
                  <ProtectedRoute>
                    <JobMatcher />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              
              {/* Error routes */}
              <Route path="/404" element={<ErrorPage errorCode={404} />} />
              <Route path="/500" element={<ErrorPage errorCode={500} />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<ErrorPage errorCode={404} />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </ClerkProvider>
  )
}

/**
 * Protected route wrapper that handles authentication
 * Wraps content in ErrorBoundary for better error handling
 */
function ProtectedRoute({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <ErrorBoundary>
      <SignedIn>
        <Layout>
          <Suspense fallback={<PageSkeleton />}>
            {children}
          </Suspense>
        </Layout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ErrorBoundary>
  )
}

export default App
