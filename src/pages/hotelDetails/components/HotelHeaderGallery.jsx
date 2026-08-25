import { useState, useRef, useEffect } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { HiOutlinePhotograph } from 'react-icons/hi'
import HotelGalleryModal from '../../searchResultsPage/components/HotelGalleryModal'
import FallbackImage from '../../../components/FallbackImage'

const HotelHeaderGallery = ({ images = [], title = 'Hotel', hotelId }) => {
  const sliderRef = useRef(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const displayImages = images.length > 0 ? images.slice(0, 4) : ['']

  useEffect(() => {
    if (displayImages.length <= 1) return undefined

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % displayImages.length
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
  }, [displayImages.length])

  const scrollSlider = (direction) => {
    if (displayImages.length <= 1) return
    setCurrentSlide((prev) => {
      let next = direction === 'left' ? prev - 1 : prev + 1
      if (next < 0) next = displayImages.length - 1
      if (next >= displayImages.length) next = 0
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

  const getGridColsClass = () => {
    const count = displayImages.length
    if (count === 1) return 'md:grid-cols-1'
    if (count === 2) return 'md:grid-cols-2'
    if (count === 3) return 'md:grid-cols-3'
    return 'md:grid-cols-4'
  }

  return (
    <div className="relative w-full overflow-hidden bg-white p-0">
      {displayImages.length > 1 && (
        <>
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
        </>
      )}

      <div
        ref={sliderRef}
        className={`flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid ${getGridColsClass()} md:gap-3`}
      >
        {displayImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative h-[250px] w-full min-w-full shrink-0 snap-center bg-[#f3f4f6] sm:h-[300px] md:h-[260px] md:w-auto md:min-w-0 lg:h-[320px]"
          >
            <FallbackImage
              src={image}
              alt={`${title} photo ${index + 1}`}
              className="h-full w-full object-cover"
              dummyClassName="h-full w-full object-contain p-12"
            />
            {index === Math.min(3, displayImages.length - 1) && images.length > 0 && (
              <button
                type="button"
                onClick={() => setIsGalleryOpen(true)}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-2.5 text-xs font-semibold text-white backdrop-blur-xs transition hover:bg-black/75 cursor-pointer shadow-sm active:scale-95"
              >
                <HiOutlinePhotograph className="h-4.5 w-4.5" />
                <span>{images.length} photos</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {displayImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 md:hidden">
          {displayImages.map((_, idx) => (
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
      )}

      <HotelGalleryModal
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        hotelTitle={title}
        hotelId={hotelId}
        images={images}
      />
    </div>
  )
}

export default HotelHeaderGallery