const services = [
  'Corporate retreats and tour services',
  'Cruise ticketing',
  'Visa application services',
  'Sports event ticketing',
]

export default function OnlineBookingSection() {
  return (
    <section className="bg-[#f4faff] py-12 md:py-16">
      <div className="mx-auto container px-4">
        <div className="max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Book Bintan Resort Ferries Online Booking with VTL Travel
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-500 md:text-base">
            VTL Travel Pte Ltd is a trusted travel partner helping travellers
            book Singapore to Bintan ferry tickets online with ease. With years
            of experience in regional travel services, we make ferry booking
            simple, secure, and convenient for both leisure and corporate
            travellers.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <img
              src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80"
              alt="Bintan ferry deck view"
              className="h-auto w-full rounded-3xl object-cover shadow-sm"
            />
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-gray-500 md:text-base">
            <p>
              Our company focuses on private tour packages, corporate retreats,
              and team-building experiences across Singapore, Indonesia, and
              Malaysia. We carefully plan every trip so travellers can enjoy a
              smooth and memorable journey from start to finish.
            </p>
            <p>
              Through our partnership with BRF Ferry, we developed a reliable
              online booking system for ferry tickets. Travellers can check
              schedules, choose preferred departure times, and confirm seats in
              just a few steps.
            </p>
            <div>
              <p>
                Beyond selling ferry tickets on Bintan Ferry Tickets, VTL Travel
                also offers a range of travel services, including:
              </p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5">
                {services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ol>
            </div>
            <p>
              With dedicated customer support, secure payment methods, and
              instant e-ticket confirmation, VTL Travel is committed to making
              every booking experience fast, safe, and hassle-free.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
