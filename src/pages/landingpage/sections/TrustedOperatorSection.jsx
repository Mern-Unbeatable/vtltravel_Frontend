export default function TrustedOperatorSection() {
  return (
    <section className="relative mt-4 overflow-hidden">
      {/* White triangle notch at top center */}
      <div className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2">
        <div
          className="h-0 w-0 border-x-[18px] border-t-[16px] border-x-transparent border-t-white"
          aria-hidden="true"
        />
      </div>

      <div
        className="relative min-h-[420px] bg-cover bg-center md:min-h-[480px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        {/* Soft left visibility + strong blue overlay on right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(53,157,215,0.15) 0%, rgba(53,157,215,0.45) 42%, rgba(53,157,215,0.92) 68%, rgba(40,130,185,0.98) 100%)',
          }}
        />

        <div className="relative z-10 mx-auto flex min-h-[420px] container items-center px-4 py-14 md:min-h-[480px] md:justify-end md:py-16">
          <div className="w-full max-w-xl text-white md:max-w-lg lg:max-w-xl">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-[2.5rem]">
              Bintan Resort Ferries: A Trusted Ferry Operator Since 1985
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/95 md:text-base">
              For over 40 years since 1985, Bintan Resort Ferries has been a
              popular ferry operator for travel from Singapore to Bintan. As a
              daily ferry operator, accommodates over 300 passengers each day
              between Singapore and Bintan. Starting with two high-speed
              passenger ferries, Bintan Resort Ferries now owns 21 high-speed
              ferries and operates more than 32 daily return trips across Bintan
              and Singapore.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
