export function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={`flex items-center justify-center ${fullScreen ? "min-h-[60vh]" : "py-10"}`}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(245,223,146,0.3)", borderTopColor: "#F5DF92" }}
        />
        <p className="text-sm tracking-widest" style={{ color: "#F5DF92" }}>LOADING…</p>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-5 bg-gray-100 rounded w-1/3" />
        <div className="h-9 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export default function Loading() {
  return <LoadingSpinner fullScreen />;
}
