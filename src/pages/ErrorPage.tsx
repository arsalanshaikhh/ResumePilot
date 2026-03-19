import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'

interface ErrorPageProps {
  /** Custom error code */
  errorCode?: number
  /** Custom error message */
  message?: string
  /** Custom title */
  title?: string
}

/**
 * Error page component for displaying HTTP errors
 * Can be used as a catch-all route or for specific error codes
 */
function ErrorPage({
  errorCode,
  message,
  title,
}: ErrorPageProps): React.JSX.Element {
  const routeError = useRouteError()
  
  // Determine error details
  let displayCode = errorCode ?? 500
  let displayTitle = title
  let displayMessage = message

  if (isRouteErrorResponse(routeError)) {
    displayCode = routeError.status
    displayTitle ??= routeError.statusText
    displayMessage ??= routeError.data?.message
  } else if (routeError instanceof Error) {
    displayMessage ??= routeError.message
  }

  // Get error description based on status code
  const errorDescriptions: Record<number, string> = {
    400: 'The request could not be understood by the server.',
    401: 'You need to be authenticated to access this resource.',
    403: 'You do not have permission to access this resource.',
    404: 'The page you are looking for does not exist.',
    405: 'The method used is not allowed for this resource.',
    408: 'The server timed out waiting for the request.',
    429: 'Too many requests. Please try again later.',
    500: 'Something went wrong on our end. Please try again.',
    502: 'The server received an invalid response.',
    503: 'The service is temporarily unavailable.',
    504: 'The server took too long to respond.',
  }

  const description = displayMessage ?? errorDescriptions[displayCode] ?? 'An unexpected error occurred.'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        <h1 className="text-6xl font-bold text-primary mb-2">
          {displayCode}
        </h1>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {displayTitle ?? getDefaultTitle(displayCode)}
        </h2>

        <p className="text-gray-600 mb-8">
          {description}
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          
          <Link to="/">
            <Button variant="default">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function getDefaultTitle(code: number): string {
  const titles: Record<number, string> = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  }
  return titles[code] ?? 'Error'
}

export default ErrorPage
