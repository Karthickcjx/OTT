export function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 rounded-lg overflow-hidden animate-pulse">
      <div className="bg-gray-800 aspect-[2/3] rounded-lg" />
      <div className="mt-2 space-y-1">
        <div className="h-3 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="px-6 md:px-12 py-4">
      <div className="h-5 bg-gray-800 rounded w-40 mb-4 animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="relative h-[70vh] bg-gray-900 animate-pulse">
      <div className="absolute bottom-16 left-12 space-y-4">
        <div className="h-10 bg-gray-800 rounded w-80" />
        <div className="h-4 bg-gray-800 rounded w-96" />
        <div className="h-4 bg-gray-800 rounded w-72" />
        <div className="flex gap-3 mt-4">
          <div className="h-10 bg-gray-800 rounded w-28" />
          <div className="h-10 bg-gray-800 rounded w-36" />
        </div>
      </div>
    </div>
  );
}

export default function Loader() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}
