export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#e8e2d9]">
      <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden md:min-h-[calc(100dvh-72px)]">
        <div className="absolute inset-0 bg-[#161410] shimmer" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0d0b] via-[#0e0d0b]/80 to-[#0e0d0b]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-transparent to-transparent" />

        <div className="container-frame relative z-10 grid min-h-[calc(100dvh-4rem)] items-end gap-10 pb-14 pt-10 md:min-h-[calc(100dvh-72px)] md:grid-cols-[minmax(220px,320px),1fr] md:items-center md:pb-20 md:pt-16 lg:gap-16">
          <div className="order-2 md:order-1">
            <div className="aspect-[2/3] max-w-[210px] border border-white/5 bg-white/5 shimmer md:max-w-none" />
          </div>

          <div className="order-1 max-w-3xl md:order-2">
            <div className="mb-8 h-8 w-24 bg-white/8 shimmer" />
            <div className="mb-4 h-3 w-40 bg-white/8 shimmer" />
            <div className="h-16 w-full max-w-2xl bg-white/8 shimmer md:h-20" />
            <div className="mt-5 flex gap-3">
              <div className="h-4 w-12 bg-white/8 shimmer" />
              <div className="h-4 w-16 bg-white/8 shimmer" />
              <div className="h-4 w-14 bg-white/8 shimmer" />
            </div>
            <div className="mt-5 flex gap-2">
              <div className="h-7 w-18 bg-white/6 shimmer" />
              <div className="h-7 w-22 bg-white/6 shimmer" />
            </div>
            <div className="mt-7 space-y-3">
              <div className="h-3.5 w-full max-w-2xl bg-white/8 shimmer" />
              <div className="h-3.5 w-full max-w-xl bg-white/8 shimmer" />
              <div className="h-3.5 w-full max-w-lg bg-white/8 shimmer" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#0e0d0b] py-14 md:py-20">
        <div className="container-frame grid gap-12 lg:grid-cols-[1fr,0.9fr]">
          <div>
            <div className="mb-6 h-8 w-28 bg-white/8 shimmer" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="overflow-hidden border border-white/5 bg-[#161410]">
                  <div className="aspect-[3/4] bg-white/6 shimmer" />
                  <div className="space-y-2 p-3">
                    <div className="h-3.5 w-3/4 bg-white/8 shimmer" />
                    <div className="h-3 w-1/2 bg-white/6 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-6 h-8 w-32 bg-white/8 shimmer" />
            <div className="aspect-video border border-white/5 bg-[#161410] shimmer" />
          </div>
        </div>
      </section>
    </div>
  );
}
