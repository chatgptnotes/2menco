const CardSkeleton = () => (
  <div className="card space-y-4 animate-pulse">
    <div className="h-4 bg-white/5 rounded w-1/3" />
    <div className="h-8 bg-white/5 rounded w-1/2" />
    <div className="h-3 bg-white/5 rounded w-2/3" />
  </div>
)

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="card space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-white/5 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/5 rounded w-3/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
)

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
)

export { CardSkeleton, TableSkeleton, DashboardSkeleton }
