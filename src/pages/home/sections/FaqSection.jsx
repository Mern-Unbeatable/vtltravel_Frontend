import { useState } from 'react'
import { IoAdd, IoRemove } from 'react-icons/io5'

const faqs = [
  {
    id: 1,
    question: 'Where do ferries to Bintan depart from in Singapore??',
    answer:
      'Ferries to Bintan typically depart from Tanah Merah Ferry Terminal in Singapore. Please arrive early and check your e-ticket for the exact boarding gate.',
  },
  {
    id: 2,
    question: 'What about Singapore PRs?',
    answer:
      'Singapore Permanent Residents can travel with a valid passport. Additional entry requirements may apply depending on nationality, so please check before departure.',
  },
  {
    id: 3,
    question: 'Which terminal will I arrive at in Bintan?',
    answer:
      'Most Singapore–Bintan ferries arrive at Bandar Bentan Telani (BBT) Ferry Terminal, depending on your selected operator and route.',
  },
  {
    id: 4,
    question: 'Do I need a Visa on Arrival, and how much is it?',
    answer:
      'Visa requirements depend on your nationality. Some travellers may need a Visa on Arrival. Fees and rules can change, so confirm the latest information before travel.',
  },
  {
    id: 5,
    question: 'How long is the ferry to Bintan?',
    answer:
      'The ferry ride from Singapore to Bintan usually takes about 55–70 minutes, depending on sea conditions and the ferry operator.',
  },
  {
    id: 6,
    question: 'What is the e-Arrival Card and is it required?',
    answer:
      'Indonesia may require an e-Arrival Card for entry. Complete it online before travel if required for your trip to avoid delays at immigration.',
  },
  {
    id: 7,
    question: 'Which ferry operators run the Singapore—Bintan route?',
    answer:
      'Popular operators on this route include Bintan Resort Ferries (BRF) and other partner ferry companies available on our booking platform.',
  },
  {
    id: 8,
    question: 'What time should I arrive at the terminal?',
    answer:
      'We recommend arriving at least 60–90 minutes before departure to complete check-in, immigration, and boarding smoothly.',
  },
  {
    id: 9,
    question: 'How many sailings are there per day?',
    answer:
      'There are multiple daily sailings between Singapore and Bintan. Exact schedules vary by day and operator, so check availability when booking.',
  },
  {
    id: 10,
    question: 'Is there a time difference in Bintan?',
    answer:
      'Bintan follows Western Indonesia Time (WIB), which is usually 1 hour behind Singapore Time. Always double-check before planning transfers.',
  },
  {
    id: 11,
    question: 'Do I need a passport and how long must it be valid?',
    answer:
      'Yes, a valid passport is required. Many destinations recommend at least 6 months validity from your date of entry.',
  },
  {
    id: 12,
    question: 'Can I reschedule or cancel my ticket?',
    answer:
      'Reschedule and cancellation options depend on the ferry operator’s policy and fare type. Check your ticket terms or contact support for help.',
  },
  {
    id: 13,
    question: 'Do Singapore citizens need a visa for Bintan?',
    answer:
      'Singapore citizens generally do not need a visa for short leisure trips to Indonesia, but entry rules can change. Please verify before travel.',
  },
  {
    id: 14,
    question: 'Can I bring pets?',
    answer:
      'Pet policies vary by ferry operator and may require advance approval, documents, and special arrangements. Contact support before booking with pets.',
  },
]

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left md:px-5"
      >
        <span className="text-sm font-medium text-gray-800 md:text-[15px]">
          {faq.question}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          {isOpen ? <IoRemove className="text-lg" /> : <IoAdd className="text-lg" />}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 text-sm leading-relaxed text-gray-500 md:px-5">
          {faq.answer}
        </div>
      )}
    </div>
  )
}

export default function FaqSection() {
  const [openId, setOpenId] = useState(1)

  const leftFaqs = faqs.filter((_, index) => index % 2 === 0)
  const rightFaqs = faqs.filter((_, index) => index % 2 === 1)

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="mx-auto container px-4">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:mb-10 md:text-4xl">
          FAQs
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
          <div className="space-y-4">
            {leftFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === faq.id ? null : faq.id))
                }
              />
            ))}
          </div>

          <div className="space-y-4">
            {rightFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === faq.id ? null : faq.id))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
