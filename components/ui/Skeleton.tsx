/**
 * Skeleton loading component
 */

export function Skeleton({ className = '', variant = 'default' }: { className?: string; variant?: 'default' | 'text' | 'circular' }) {
  const baseClasses = 'animate-pulse bg-dark-gray';
  const variantClasses = {
    default: 'rounded-lg',
    text: 'rounded',
    circular: 'rounded-full',
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="card-gradient p-6 rounded-xl border border-white/10 space-y-4">
      <Skeleton className="h-6 w-3/4" variant="text" />
      <Skeleton className="h-4 w-full" variant="text" />
      <Skeleton className="h-4 w-5/6" variant="text" />
    </div>
  );
}

export function BuildingCardSkeleton() {
  return (
    <div className="card-gradient p-4 rounded-xl border border-white/10">
      <Skeleton className="h-12 w-12 rounded-lg mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" variant="text" />
      <Skeleton className="h-4 w-full mb-2" variant="text" />
      <Skeleton className="h-4 w-2/3" variant="text" />
    </div>
  );
}

