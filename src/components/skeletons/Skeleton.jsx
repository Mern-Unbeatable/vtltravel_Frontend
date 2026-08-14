const Skeleton = ({ className = '' }) => (
  <div className={`skeleton ${className}`} aria-hidden="true" />
)

export const HotelResultCardSkeleton = () => (
  <article className="flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:flex-row">
    <Skeleton className="h-[220px] w-full shrink-0 sm:h-[240px] md:min-h-[280px] md:w-[42%] lg:w-[320px]" />
    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5 md:p-6">
      <div>
        <Skeleton className="h-7 w-3/4 rounded-md" />
        <Skeleton className="mt-3 h-4 w-full max-w-md rounded-md" />
        <Skeleton className="mt-2 h-4 w-2/5 rounded-md" />
      </div>
      <div className="mt-6 flex flex-col-reverse gap-5 md:mt-0 md:flex-row md:items-end md:justify-between">
        <Skeleton className="h-4 w-28 rounded-md" />
        <div className="flex w-full flex-col items-start md:w-auto md:items-end">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="mt-2 h-4 w-36 rounded-md" />
          <Skeleton className="mt-4 h-11 w-full rounded-full md:w-36" />
        </div>
      </div>
    </div>
  </article>
)

export const SearchResultsListSkeleton = ({ count = 3 } = {}) => (
  <div>
    <Skeleton className="h-6 w-48 rounded-md" />
    <Skeleton className="mt-2 mb-3 h-4 w-56 rounded-md" />
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <HotelResultCardSkeleton key={`hotel-card-skel-${index}`} />
      ))}
    </div>
  </div>
)

export const FilterFacetSkeleton = ({ rows = 4 } = {}) => (
  <div className="space-y-2.5">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={`facet-skel-${index}`} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded-sm" />
          <Skeleton className="h-3.5 w-28 rounded-md" />
        </div>
        <Skeleton className="h-3.5 w-6 rounded-md" />
      </div>
    ))}
  </div>
)

export const SearchSuggestionsSkeleton = () => (
  <div className="py-1">
    <Skeleton className="mx-4 mb-2 mt-1 h-3 w-16 rounded-md" />
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={`suggest-skel-${index}`} className="flex items-start gap-3 px-4 py-2">
        <Skeleton className="mt-0.5 h-4 w-4 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3.5 w-3/4 rounded-md" />
          <Skeleton className="mt-1.5 h-3 w-1/2 rounded-md" />
        </div>
      </div>
    ))}
  </div>
)

export const GalleryGridSkeleton = ({ count = 4 } = {}) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={`gallery-skel-${index}`}
        className="h-[180px] w-full rounded-xl sm:h-[200px] md:h-[220px]"
      />
    ))}
  </div>
)

const SinglePackageCardSkeleton = () => (
  <article className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
    <Skeleton className="h-44 w-full" />
    <div className="p-4">
      <Skeleton className="h-5 w-4/5 rounded-md" />
      <Skeleton className="mt-3 h-3.5 w-32 rounded-md" />
      <Skeleton className="mt-3 h-4 w-full rounded-md" />
      <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <Skeleton className="h-3 w-10 rounded-md" />
          <Skeleton className="mt-2 h-6 w-16 rounded-md" />
        </div>
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
    </div>
  </article>
)

export const PackageCardSkeleton = ({ count } = {}) => {
  if (!count || count <= 1) return <SinglePackageCardSkeleton />

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SinglePackageCardSkeleton key={`package-skel-${index}`} />
      ))}
    </div>
  )
}

export const PackageGridSkeleton = ({ count = 4 } = {}) => (
  <PackageCardSkeleton count={count} />
)

export const PromotionCardSkeleton = () => (
  <article className="overflow-hidden rounded-2xl">
    <Skeleton className="h-44 w-full sm:h-52" />
  </article>
)

export const RoomCardSkeleton = () => (
  <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div className="flex flex-col lg:flex-row">
      <Skeleton className="h-[220px] w-full shrink-0 lg:min-h-[240px] lg:w-[320px]" />
      <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
        <div>
          <Skeleton className="h-6 w-2/3 rounded-md" />
          <Skeleton className="mt-2 h-4 w-1/2 rounded-md" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <Skeleton className="mt-3 h-4 w-full rounded-md" />
        </div>
        <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
          <Skeleton className="h-4 w-32 rounded-md" />
          <div className="flex flex-col items-start sm:items-end">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="mt-3 h-10 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </article>
)

export const HotelSummarySidebarSkeleton = () => (
  <aside className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5">
    <Skeleton className="h-5 w-3/4 rounded-md" />
    <Skeleton className="mt-3 h-4 w-48 rounded-md" />
    <div className="mt-4 space-y-2">
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
    <div className="my-4 border-t border-gray-100" />
    <div className="flex items-start gap-3">
      <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="mt-2 h-3 w-24 rounded-md" />
        <Skeleton className="mt-3 h-6 w-28 rounded-full" />
      </div>
    </div>
    <Skeleton className="mt-4 h-3 w-32 rounded-md" />
    <div className="mt-3 space-y-3 rounded-xl bg-[#f8fbfe] p-3.5">
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-2/3 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
    </div>
    <div className="mt-4 border-t border-gray-100 pt-3">
      <Skeleton className="h-7 w-28 rounded-md" />
      <Skeleton className="mt-4 h-11 w-full rounded-full" />
    </div>
  </aside>
)

export const HotelDetailsSkeleton = () => (
  <div>
    <div className="relative w-full overflow-hidden bg-white">
      <div className="flex w-full md:grid md:grid-cols-4 md:gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={`gallery-header-skel-${index}`}
            className="h-[250px] w-full min-w-full sm:h-[300px] md:h-[260px] md:min-w-0 lg:h-[320px]"
          />
        ))}
      </div>
    </div>

    <div className="mx-auto container px-4 pt-8 md:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full max-w-xl">
          <Skeleton className="h-10 w-3/4 rounded-md" />
          <Skeleton className="mt-3 h-4 w-48 rounded-md" />
        </div>
        <Skeleton className="h-10 w-36 shrink-0 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-full max-w-2xl rounded-md" />
      <Skeleton className="mt-2 h-4 w-5/6 max-w-xl rounded-md" />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-10">
          <div className="mt-8 grid grid-cols-1 overflow-hidden rounded-2xl border border-sky-100/80 bg-[#f8fbfe] p-6 md:grid-cols-2 md:gap-8 md:p-8">
            <div>
              <Skeleton className="h-5 w-44 rounded-md" />
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={`fac-skel-${index}`} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
                    <Skeleton className="h-3.5 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-sky-100/80 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="mt-4 h-4 w-full rounded-md" />
              <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
              <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
            </div>
          </div>

          <div>
            <Skeleton className="h-8 w-48 rounded-md" />
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3">
              <Skeleton className="h-10 w-40 rounded-xl" />
              <Skeleton className="h-10 w-44 rounded-xl" />
              <Skeleton className="h-10 w-32 rounded-xl" />
              <Skeleton className="ml-auto h-9 w-24 rounded-full" />
            </div>
            <div className="mt-6 space-y-5">
              <RoomCardSkeleton />
              <RoomCardSkeleton />
            </div>
          </div>
        </div>

        <HotelSummarySidebarSkeleton />
      </div>
    </div>
  </div>
)

export const RoomDetailsModalSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-[260px] w-full rounded-2xl sm:h-[320px]" />
    <div>
      <Skeleton className="h-7 w-2/3 rounded-md sm:h-8" />
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-16 rounded-md" />
        <Skeleton className="h-4 w-14 rounded-md" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-md" />
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
      <Skeleton className="mt-4 h-4 w-full rounded-md" />
      <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
      <Skeleton className="mt-2 h-4 w-2/3 rounded-md" />
      <Skeleton className="mt-4 h-9 w-28 rounded-full" />
    </div>
    <div className="border-t border-gray-100 pt-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`amenity-skel-${index}`}>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-36 rounded-md" />
            </div>
            <div className="mt-2 space-y-1.5 pl-6">
              <Skeleton className="h-3 w-28 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default Skeleton
