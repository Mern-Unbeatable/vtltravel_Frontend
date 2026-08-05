import { Link } from 'react-router-dom'
import {
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoLogoTiktok,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoYoutube,
} from 'react-icons/io5'
import { FaPinterestP } from 'react-icons/fa'

const services = [
  'Ticket Fares',
  'Corporate Bookings',
  'Current Fleet',
  'Charter Enquiry',
  'Visa Info',
  'Baggage Info',
]

const brands = [
  'Holidays From Singapore',
  'Rediscover Singapore',
  'Tour Mount Bromo',
  'Tour In Indonesia',
]

const company = ['Corporate Travel', 'About', 'Contact', 'Careers']

const socialLinks = [
  { icon: IoLogoTiktok, label: 'TikTok' },
  { icon: IoLogoFacebook, label: 'Facebook' },
  { icon: IoLogoInstagram, label: 'Instagram' },
  { icon: IoLogoLinkedin, label: 'LinkedIn' },
  { icon: FaPinterestP, label: 'Pinterest' },
  { icon: IoLogoYoutube, label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* CTA Banner */}
      <div className="mx-auto container px-4 pt-8 pb-10">
        <div className="overflow-hidden rounded-[2rem] bg-[#071a2e] px-5 py-6 md:px-10 md:py-8">
          <div className="flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-start md:gap-8">
            <img
              src="/cta.png"
              alt="Customer support"
              className="h-40 w-auto shrink-0 object-contain sm:h-44 md:h-48 lg:h-52"
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

      {/* Main footer links */}
      <div className="mx-auto container px-4 pb-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link to="/" className="inline-block">
              <img src="/logo.png" alt="VTL Travel" className="h-12 w-auto" />
            </Link>

            <p className="mt-5 text-sm font-medium text-gray-700">Site / Currency</p>
            <select className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none">
              <option>US$ United States dollar</option>
              <option>SGD Singapore dollar</option>
            </select>

            <p className="mt-5 text-sm font-medium text-gray-700">Payment Method</p>
            <div className="mt-2 inline-flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600">
              <span>VISA</span>
              <span>MC</span>
              <span>PayPal</span>
            </div>
          </div>

          <FooterColumn title="Services" items={services} />
          <FooterColumn title="Our Brands" items={brands} />
          <FooterColumn title="Company" items={company} />

          <div>
            <h4 className="mb-4 text-base font-bold text-gray-900">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <IoCallOutline className="mt-0.5 text-primary" />
                <a href="tel:+6582955180" className="hover:text-primary">
                  +65 8295 5180
                </a>
              </li>
              <li className="flex items-start gap-2">
                <IoMailOutline className="mt-0.5 text-primary" />
                <a href="mailto:hello@vtltravel.com" className="hover:text-primary">
                  hello@vtltravel.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <IoLocationOutline className="mt-0.5 shrink-0 text-primary" />
                <span>
                  15 Beach Road, #02-01, Beach Centre, Singapore 189677
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-200">
        <div className="mx-auto container grid grid-cols-1 items-center gap-6 px-4 py-8 lg:grid-cols-[1.1fr_1fr]">
          <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Sign up to Receive News and Information
          </h3>

          <div className="lg:border-l lg:border-gray-200 lg:pl-8">
            <p className="text-sm text-gray-500">
              Sign up for the latest news, current offers travel content here
            </p>
            <form className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter Your Email ..."
                className="w-full flex-1 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="mx-auto container flex flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row">
          <p className="text-sm text-gray-400">
            Copyright VTL Travel Private Limited. All Rights Reserved{' '}
            {new Date().getFullYear()}.
          </p>

          <div className="flex items-center gap-4 text-gray-400">
            {socialLinks.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="transition hover:text-primary"
              >
                <Icon className="text-lg" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <h4 className="mb-4 text-base font-bold text-gray-900">{title}</h4>
      <ul className="space-y-2.5 text-sm text-gray-600">
        {items.map((item) => (
          <li key={item}>
            <a href="#" className="transition hover:text-primary">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
