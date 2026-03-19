import { Loader2 } from 'lucide-react'
import { Skeleton } from './Skeleton'

interface LoadingFallbackProps {
  /** Optional message to display */
  message?: string
  /** Size variant for the loader */
  size?: 'sm' | 'md' | 'lg'
  /** Whether to show full screen loader */
  fullScreen?: boolean
}

/**
 * Loading fallback component for Suspense boundaries
 * Provides visual feedback while async components load
 */
function LoadingFallback({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
}: LoadingFallbackProps): React.JSX.Element {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-primary`}
      />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] p-8">
      {content}
    </div>
  )
}

/**
 * Page skeleton for content loading
 */
function PageSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      
      <Skeleton className="h-64 rounded-xl" />
      
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

/**
 * Card skeleton for individual item loading
 */
function CardSkeleton(): React.JSX.Element {
  return (
    <div className="card-modern space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 rounded-lg" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}

/**
 * Table row skeleton
 */
function TableRowSkeleton({ columns = 4 }: { columns?: number }): React.JSX.Element {
  return (
    <tr className="border-b border-border">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4" />
        </td>
      ))}
    </tr>
  )
}

export {
  LoadingFallback,
  PageSkeleton,
  CardSkeleton,
  TableRowSkeleton,
}
