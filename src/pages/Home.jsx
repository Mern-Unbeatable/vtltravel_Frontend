import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to VTL Travel
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Your journey starts here. Explore destinations, plan trips, and travel
          with confidence.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/about"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Learn More
          </Link>
          <Link
            to="/contact"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
