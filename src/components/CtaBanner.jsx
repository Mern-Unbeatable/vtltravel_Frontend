import { Link } from 'react-router-dom'

const CtaBanner = () => {
  return (
    <div className="mx-auto container px-4 py-14 md:py-16 lg:py-20">
      <div className="overflow-hidden rounded-2xl bg-[#021320] px-5 py-6 md:px-10 md:py-8">
        <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-start md:gap-8">
          <img
            src="/cta.png"
            alt="Customer support"
            className="h-40 w-auto shrink-0 object-contain sm:h-44 md:h-48 lg:h-52 self-end -mb-6 md:-mb-12"
          />

          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
              Ready for your Batam getaway?
            </h3>
            <p className="mt-3 text-sm text-white/90 md:text-base">
              Book online in 2 minutes. Use code{' '}
              <span className="font-semibold text-primary">VTLTRAVEL</span>{' '}
              and save 10% today.
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Book Your Ferry Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CtaBanner
