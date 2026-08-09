export default function SkeletonCard({ className = "" }) {
  return (
    <div className={`glass rounded-2xl p-5 border border-ocean-800/60 animate-pulse flex flex-col justify-between h-full ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-ocean-800/50" />
        <div className="w-16 h-6 rounded-full bg-ocean-800/50" />
      </div>
      <div className="mt-4">
        <div className="w-24 h-8 rounded-lg bg-ocean-800/50 mb-2" />
        <div className="w-32 h-4 rounded bg-ocean-800/50 mb-1" />
        <div className="w-20 h-3 rounded bg-ocean-800/40" />
      </div>
    </div>
  );
}
