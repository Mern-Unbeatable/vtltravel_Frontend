import { useState, useRef, useEffect } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

const HotelHeaderGallery = ({ images = [], title = 'Hotel' }) => {
  const sliderRef = useRef(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-play slider on mobile/tablet
  useEffect(() => {
    if (!images || images.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % images.length
        if (sliderRef.current) {
          const containerWidth = sliderRef.current.offsetWidth
          sliderRef.current.scrollTo({
            left: next * containerWidth,
            behavior: 'smooth',
          })
        }
        return next
      })
    }, 3500)

    return () => clearInterval(timer)
  }, [images])

  const scrollSlider = (direction) => {
    if (!images || images.length === 0) return
    setCurrentSlide((prev) => {
      let next = direction === 'left' ? prev - 1 : prev + 1
      if (next < 0) next = images.length - 1
      if (next >= images.length) next = 0
      if (sliderRef.current) {
        const containerWidth = sliderRef.current.offsetWidth
        sliderRef.current.scrollTo({
          left: next * containerWidth,
          behavior: 'smooth',
        })
      }
      return next
    })
  }

  return (
    <div className="relative w-full overflow-hidden bg-white p-0">
      {/* Navigation Arrows for Mobile/Tablet */}
      <button
        type="button"
        onClick={() => scrollSlider('left')}
        className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-xs transition hover:bg-black/70 md:hidden"
        aria-label="Previous slide"
      >
        <IoChevronBack className="text-xl" />
      </button>

      <button
        type="button"
        onClick={() => scrollSlider('right')}
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-xs transition hover:bg-black/70 md:hidden"
        aria-label="Next slide"
      >
        <IoChevronForward className="text-xl" />
      </button>

      {/* Gallery Row / Grid */}
      <div
        ref={sliderRef}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:gap-3"
      >
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative h-[250px] w-full min-w-full shrink-0 snap-center sm:h-[300px] md:h-[260px] md:w-auto md:min-w-0 lg:h-[320px]"
          >
            <img
              src={image}
              alt={`${title} photo ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dots Indicator for Mobile */}
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 md:hidden">
        {images.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            type="button"
            onClick={() => {
              setCurrentSlide(idx)
              if (sliderRef.current) {
                sliderRef.current.scrollTo({
                  left: idx * sliderRef.current.offsetWidth,
                  behavior: 'smooth',
                })
              }
            }}
            className={`h-1.5 rounded-full transition-all ${
              currentSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HotelHeaderGallery
