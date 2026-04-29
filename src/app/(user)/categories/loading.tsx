export default function CategoriesLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-10 w-56 rounded bg-gray-200" />
          <div className="mt-3 h-5 w-96 rounded bg-gray-200" />
        </div>
        <div className="h-12 w-44 rounded bg-gray-200" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-6 w-full rounded bg-gray-200" />
          <div className="h-6 w-full rounded bg-gray-200" />
          <div className="h-6 w-full rounded bg-gray-200" />
          <div className="h-6 w-full rounded bg-gray-200" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        <div className="h-28 rounded-xl border border-gray-200 bg-white p-6 shadow-sm" />
        <div className="h-28 rounded-xl border border-gray-200 bg-white p-6 shadow-sm" />
        <div className="h-28 rounded-xl border border-gray-200 bg-white p-6 shadow-sm" />
      </div>
    </div>
  );
}
