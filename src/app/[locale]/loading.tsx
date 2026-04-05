export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-[#7C3AED] animate-spin" />
        </div>
        <div className="font-mono text-xs text-white/30 animate-pulse tracking-widest">
          LOADING...
        </div>
      </div>
    </div>
  );
}
