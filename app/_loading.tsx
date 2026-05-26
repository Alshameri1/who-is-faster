
export function Loading() {
  return (
    <div className="flex h-screen items-center justify-center overflow-hidden bg-[#0c1628]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-lg text-white/70">جاري تحميل اللعبة...</p>
      </div>
    </div>
  )
}