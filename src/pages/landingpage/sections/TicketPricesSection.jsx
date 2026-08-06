export default function TicketPricesSection() {
  return (
    <section className="mx-auto container px-4 py-12 md:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Singapore to Bintan Ferry Ticket Prices
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-gray-500 md:text-base">
          The price of ferry tickets for travel from Singapore to Bintan typically
          ranges from SGD $100-$110 for adults and SGD $80-$90 for children.
          Prices may vary depending on the ferry operator, travel date, and seat
          class. Booking in advance often helps you get better rates and preferred
          departure times.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-5 text-sm leading-relaxed text-gray-500 md:text-base">
          <p>
            For those looking to book cheap ferry tickets to Bintan, booking
            online is the easiest method. You can compare schedules, check seat
            availability, and secure your trip without waiting at the ticket
            counter.
          </p>
          <p>
            To book your ferry ticket online through Bintan Ferry Tickets, visit
            our website, select your preferred date and departure time, then
            enter passenger details carefully before confirming.
          </p>
          <p>
            Once details are complete, proceed to the checkout page for payment.
            We support major payment methods so you can complete booking quickly
            and receive your e-ticket instantly by email.
          </p>
        </div>

        <div>
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
            alt="Singapore to Bintan ferry"
            className="h-auto w-full rounded-3xl object-cover shadow-sm"
          />
        </div>
      </div>
    </section>
  )
}
