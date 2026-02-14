const SidebarSkeleton = () => {
  return (
    <aside className="w-full h-full flex flex-col min-h-0 border-r border-border bg-card overflow-hidden">
      <div className="p-3 bg-muted/50 border-b border-border shrink-0 flex-none">
        <div className="skeleton h-10 w-full rounded-lg" />
        <div className="mt-2 flex gap-2">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-4 w-16 rounded" />
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden p-2">
        {Array(8).fill(null).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-3 border-b border-border/50">
            <div className="skeleton size-12 rounded-full shrink-0" />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="skeleton h-4 w-28" />
              <div className="skeleton h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
