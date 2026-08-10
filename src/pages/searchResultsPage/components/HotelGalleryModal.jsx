import { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'

const CATEGORIES = [
  'Videos',
  'Hotel',
  'Rooms',
  'Suite',
  'Restaurant',
  'Bar',
  'Breakfast',
  'Family',
  'Weddings',
  'Meetings and events',
  'Services',
  'Hotel advantages',
  'Spa',
]

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?auto=format&fit=crop&w=900&q=80',
]

const HotelGalleryModal = ({ open, onClose, hotelTitle }) => {
  const [activeCategory, setActiveCategory] = useState('Hotel')

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex h-[min(860px,90vh)] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${hotelTitle || 'Hotel'} gallery`}
      >
        <aside className="hidden w-[220px] shrink-0 border-r border-gray-200 md:block">
          <nav className="h-full overflow-y-auto py-4">
            {CATEGORIES.map((category) => {
              const isActive = category === activeCategory

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`relative flex w-full items-center px-5 py-3 text-left text-[15px] transition-colors ${
                    isActive
                      ? 'font-semibold text-slate-900'
                      : 'font-medium text-slate-700 hover:bg-gray-50'
                  }`}
                >
                  {category}
                  {isActive ? (
                    <span className="absolute bottom-2 right-0 top-2 w-[3px] rounded-l bg-primary" />
                  ) : null}
                </button>
              )
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-2xl font-semibold text-slate-900">{activeCategory}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-600 transition-colors hover:bg-gray-100"
              aria-label="Close gallery"
            >
              <IoClose className="h-6 w-6" />
            </button>
          </div>

          {/* Horizontal Category Selector for Mobile */}
          <div className="border-b border-gray-100 px-5 py-3 md:hidden overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
            <div className="flex gap-2">
              {CATEGORIES.map((category) => {
                const isActive = category === activeCategory
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-track]:bg-transparent">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {GALLERY_IMAGES.map((image, index) => (
                <div
                  key={`${activeCategory}-${image}-${index}`}
                  className="overflow-hidden rounded-xl"
                >
                  <img
                    src={image}
                    alt={`${activeCategory} ${index + 1}`}
                    className="h-[220px] w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelGalleryModal
