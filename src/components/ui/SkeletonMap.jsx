export default function SkeletonMap() {
  return (
    <div className="glass rounded-2xl border border-ocean-800/60 animate-pulse overflow-hidden" style={{ minHeight: 420 }}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <div className="w-48 h-5 rounded bg-ocean-800/50 mb-2" />
          <div className="w-64 h-3 rounded bg-ocean-800/40" />
        </div>
        <div className="w-16 h-5 rounded-full bg-ocean-800/50" />
      </div>
      <div className="w-full h-[400px] bg-ocean-800/30 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-ocean-800/50 border-t-ocean-300/50 animate-spin" />
      </div>
    </div>
  );
}
