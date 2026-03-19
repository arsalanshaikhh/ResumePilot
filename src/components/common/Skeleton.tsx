import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

/**
 * Skeleton component for loading states
 * Provides a pulsing placeholder while content loads
 */
function Skeleton({ className }: SkeletonProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'skeleton rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]',
        className
      )}
    />
  )
}

export { Skeleton }
