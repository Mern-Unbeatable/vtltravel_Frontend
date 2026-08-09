const tours = [
  {
    id: 1,
    title: "MEETING VENUE",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "INCENTIVE",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "WEDDINGS",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "EVENTS",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
  },
];

const TourCard = ({ tour }) => {
  return (
    <article
      className="relative h-64 overflow-hidden rounded-t-2xl md:h-70"
      style={{
        
        clipPath: "ellipse(65% 85% at 50% 15%)",
      }}
    >
      {/* Background Image */}
      <img
        src={tour.image}
        alt={tour.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Title */}
      <h3 className="relative pt-8 text-center text-lg font-extrabold tracking-wider text-white uppercase md:text-xl">
        {tour.title}
      </h3>
    </article>
  );
};


const GroupToursSection = () => {
  return (
    <div className="bg-[#F9FAFB]">
       <section className="mx-auto container px-4  py-14 md:py-16 lg:py-20">
      <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 md:mb-10 md:text-4xl">
        Bintan Group Tours
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
    </div>
   
  );
};

export default GroupToursSection;
