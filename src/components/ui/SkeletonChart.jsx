export default function SkeletonChart({ className = "" }) {
  return (
    <div className={`glass rounded-2xl border border-ocean-800/60 animate-pulse flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-5 pt-5 pb-0">
        <div>
          <div className="w-40 h-5 rounded bg-ocean-800/50 mb-2" />
          <div className="w-56 h-3 rounded bg-ocean-800/40" />
        </div>
      </div>
      <div className="pt-4 px-5 pb-5 flex-1 flex flex-col justify-end">
        <div className="w-full h-[240px] rounded-xl bg-ocean-800/30 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
          {/* Skeleton Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-4">
            <div className="w-full h-px bg-ocean-800/20" />
            <div className="w-full h-px bg-ocean-800/20" />
            <div className="w-full h-px bg-ocean-800/20" />
            <div className="w-full h-px bg-ocean-800/20" />
            <div className="w-full h-px bg-ocean-800/20" />
          </div>
          {/* Skeleton Chart Bars/Area shape */}
          <div className="w-full h-full flex items-end px-4 gap-2 pb-4 opacity-50 relative z-10">
            <div className="flex-1 h-1/4 rounded-t bg-ocean-800/40" />
            <div className="flex-1 h-2/4 rounded-t bg-ocean-800/40" />
            <div className="flex-1 h-1/3 rounded-t bg-ocean-800/40" />
            <div className="flex-1 h-2/3 rounded-t bg-ocean-800/40" />
            <div className="flex-1 h-1/2 rounded-t bg-ocean-800/40" />
            <div className="flex-1 h-full rounded-t bg-ocean-800/40" />
            <div className="flex-1 h-3/4 rounded-t bg-ocean-800/40" />
            <div className="flex-1 h-2/5 rounded-t bg-ocean-800/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
