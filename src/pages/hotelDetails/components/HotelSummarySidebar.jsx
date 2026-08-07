import { IoCalendarOutline, IoPersonOutline } from 'react-icons/io5'

const HotelSummarySidebar = ({ title = 'Pullman Hanoi' }) => {
  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 text-xs shadow-2xs">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-2.5 flex items-center gap-2 text-gray-500">
        <span className="text-gray-400">🔗</span>
        <span>Check-in 2:00 PM | Check-out 12:00 PM</span>
      </p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-[#3ea5dc] font-medium text-xs">
          <IoCalendarOutline className="text-sm shrink-0" />
          <span>July 27, 2026 → July 29, 2026</span>
        </div>
        <p className="pl-6 text-[11px] text-gray-400">2 nights</p>

        <div className="mt-3 flex items-center gap-2 text-[#3ea5dc] font-medium text-xs">
          <IoPersonOutline className="text-sm shrink-0" />
          <span>1 adult - 1 room</span>
        </div>
      </div>
    </aside>
  )
}

export default HotelSummarySidebar
