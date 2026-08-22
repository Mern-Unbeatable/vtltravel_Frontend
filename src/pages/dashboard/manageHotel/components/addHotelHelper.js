import * as z from "zod";

export const availableFacilitiesList = [
  "Free Wi-Fi",
  "Swimming Pool",
  "Private Pool",
  "Fitness Center",
  "Spa",
  "Restaurant",
  "Bar",
  "Room Service",
  "Beach Access",
  "Kids Club",
  "Free Parking",
];

export const GALLERY_CATEGORIES = [
  "Videos",
  "Hotel",
  "Rooms",
  "Suite",
  "Restaurant",
  "Bar",
  "Breakfast",
  "Family",
  "Weddings",
  "Meetings and events",
  "Services",
  "Hotel advantages",
  "Spa",
];

export const categoryMap = {
  Videos: "VIDEOS",
  Hotel: "HOTEL",
  Rooms: "ROOMS",
  Suite: "SUITE",
  Restaurant: "RESTAURANT",
  Bar: "BAR",
  Breakfast: "BREAKFAST",
  Family: "FAMILY",
  Weddings: "WEDDINGS",
  "Meetings and events": "MEETINGS_AND_EVENTS",
  Services: "SERVICES",
  "Hotel advantages": "HOTEL_ADVANTAGES",
  Spa: "SPA",
};

export const getBackendCategoryKey = (uiTab) => {
  return (categoryMap[uiTab] || "HOTEL").toUpperCase();
};

export const isCategoryMatch = (imgCat, uiTab) => {
  if (!imgCat) return uiTab.toLowerCase() === "hotel";
  const imgCatUpper = imgCat.toUpperCase();
  const targetCatUpper = getBackendCategoryKey(uiTab);
  return imgCatUpper === targetCatUpper || imgCatUpper === uiTab.toUpperCase();
};

export const hotelSchema = z.object({
  title: z.string().min(1, "Hotel title is required"),
  starNum: z.number().min(1).max(5),
  priceNum: z.string().min(1, "Starting price is required"),
  location: z.string().min(1, "Location is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  image: z.string().min(1, "Cover image is required"),
  video: z.string().optional().default(""),
  description: z.string().min(1, "Description is required"),
  facilities: z.array(z.string()).default([]),
  gallery: z
    .array(
      z.object({
        url: z.string(),
        category: z.string(),
      }),
    )
    .default([]),
  rooms: z.array(z.any()).default([]),
  available: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  featuredPackages: z.array(z.string()).default([]),
  bestFor: z.string().optional().default(""),
  addOns: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().default(""),
        price: z.string().default(""),
        minPax: z.string().default("1"),
        imageUrl: z.string().default(""),
      }),
    )
    .default([]),
  reviewScore: z.string().optional().default(""),
  reviewCount: z.string().optional().default(""),
  ratingLabel: z.string().optional().default(""),
});

export const mapRoomToFormData = (savedRoom) => {
  const formData = new FormData();
  formData.append("name", savedRoom.name);

  const slug = savedRoom.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  formData.append("slug", slug);
  formData.append("description", savedRoom.description || "");
  formData.append("pricePerNight", String(savedRoom.price));
  formData.append("basePrice", String(savedRoom.price));
  formData.append(
    "discountPrice",
    String(
      savedRoom.discountPrice !== undefined &&
        savedRoom.discountPrice !== null &&
        String(savedRoom.discountPrice).trim() !== ""
        ? savedRoom.discountPrice
        : savedRoom.price,
    ),
  );
  formData.append("taxPerNight", "0");

  const sizeLabel = savedRoom.size ? `${savedRoom.size}m²` : "";
  formData.append("roomSize", sizeLabel);
  formData.append("sizeLabel", sizeLabel);
  formData.append("sizeSqm", String(savedRoom.size || 0));

  formData.append("bedType", "King");
  formData.append("bedCount", String(savedRoom.bedInfo || 1));
  formData.append(
    "bedInformation",
    `${savedRoom.bedInfo || 1} King size bed(s)`,
  );

  const viewType =
    savedRoom.tags && savedRoom.tags.length > 0
      ? savedRoom.tags[0]
      : "Ocean View";
  formData.append("viewType", viewType);

  formData.append("bathrooms", String(savedRoom.baths || 1));
  formData.append("maxCapacity", String(savedRoom.capacity || 3));

  const adults =
    Number(savedRoom.capacity) > 1 ? Number(savedRoom.capacity) - 1 : 1;
  formData.append("maxAdults", String(adults));
  formData.append("maxChildren", "1");
  formData.append("totalInventory", "5");

  const alertLabel = savedRoom.roomsLeft
    ? `Only ${savedRoom.roomsLeft} rooms left`
    : "Only 2 rooms left";
  formData.append("roomsLeftAlert", alertLabel);

  formData.append("tags", JSON.stringify(savedRoom.tags || []));
  formData.append("amenityIds", JSON.stringify([]));

  // API expects comma-separated text; backend turns them into arrays in facilityGroups
  const features = Array.isArray(savedRoom.features) ? savedRoom.features : [];
  const foodBeverage = savedRoom.foodBeverage || [];
  const bathroomFacilities =
    savedRoom.bathroomFacilities || savedRoom.bathroom || [];
  const mediaTechnology =
    savedRoom.mediaTechnology || savedRoom.mediaTech || [];
  const serviceEquipment = savedRoom.serviceEquipment || [];

  formData.append("features", JSON.stringify(features));
  formData.append("foodBeverage", foodBeverage.join(", "));
  formData.append("bathroomFacilities", bathroomFacilities.join(", "));
  formData.append("mediaTechnology", mediaTechnology.join(", "));
  formData.append("serviceEquipment", serviceEquipment.join(", "));

  // Features first so room-card chips show Private Deck / Bathtub / etc.
  const amenities = [
    ...features,
    ...foodBeverage,
    ...bathroomFacilities,
    ...mediaTechnology,
    ...serviceEquipment,
  ];
  const amenitySlugs = [
    ...new Set(
      amenities.map((a) =>
        String(a)
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      ),
    ),
  ].filter(Boolean);
  formData.append("amenitySlugs", JSON.stringify(amenitySlugs));

  formData.append("breakfastIncluded", "true");
  formData.append("freeCancellation", "true");
  formData.append("isMemberDeal", "false");
  formData.append("smokingAllowed", "false");

  // Postman PUT /api/v1/rooms/:id — only send imageUrl when photos actually changed.
  // No image change → omit image fields so existing files stay untouched.
  const imagesChanged = Boolean(savedRoom.imagesChanged);
  const existingImages = Array.isArray(savedRoom.existingImages)
    ? savedRoom.existingImages.filter(Boolean)
    : [];
  const newFiles =
    imagesChanged &&
    Array.isArray(savedRoom.imageFiles) &&
    savedRoom.imageFiles.length > 0
      ? savedRoom.imageFiles
      : [];

  if (imagesChanged) {
    formData.append("existingImageUrls", JSON.stringify(existingImages));
    existingImages.forEach((url) => {
      formData.append("existingImages", url);
    });
    newFiles.forEach((file) => {
      formData.append("imageUrl", file);
    });
  }

  return formData;
};

export const mapHotelFormToFormData = (data, base64ToFileFn) => {
  const formData = new FormData();

  formData.append("name", data.title);
  formData.append("starRating", String(data.starNum));
  formData.append("startingPrice", String(data.priceNum));
  formData.append("reviewScore", String(data.reviewScore || ""));
  formData.append("reviewCount", String(data.reviewCount || ""));
  formData.append("ratingLabel", String(data.ratingLabel || ""));
  formData.append(
    "availabilityStatus",
    data.available ? "AVAILABLE" : "UNAVAILABLE",
  );
  formData.append("description", data.description || "");
  formData.append("location", data.location || "");
  formData.append("city", data.city || "");
  formData.append("country", data.country || "");
  const bestForArr =
    typeof data.bestFor === "string"
      ? data.bestFor
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(data.bestFor)
        ? data.bestFor
        : [];
  const bestForSlugs = bestForArr
    .map((name) =>
      String(name)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    )
    .join(",");
  formData.append("bestFor", bestForSlugs);
  formData.append("bestForSlugs", bestForSlugs);

  const featuredPackageOptions = {
    featured: "Packages of the Month",
    "best-hotel-of-the-month": "Best Hotel of the Month",
    "beachfront-resort": "Beachfront Resort",
    "family-resort": "Family Resort",
  };
  const featuredPackageSlugs = (data.featuredPackages || []).filter(Boolean);
  const isFeatured =
    featuredPackageSlugs.includes("featured") || Boolean(data.isFeatured);
  formData.append("isFeatured", String(isFeatured));

  const featuredPackageTags = featuredPackageSlugs
    .filter((slug) => slug !== "featured")
    .map((slug) => ({
      name: featuredPackageOptions[slug] || slug,
      slug,
      category: "featured_package",
    }));

  const bestForTags = bestForArr.map((name) => ({
    name,
    slug: String(name).toLowerCase().replace(/\s+/g, "-"),
    category: "best_for",
  }));
  formData.append(
    "tags",
    JSON.stringify([...bestForTags, ...featuredPackageTags]),
  );
  formData.append(
    "featuredPackages",
    JSON.stringify(
      featuredPackageSlugs.map((slug) => ({
        name: featuredPackageOptions[slug] || slug,
        slug,
      })),
    ),
  );
  formData.append(
    "badges",
    JSON.stringify(
      featuredPackageSlugs
        .filter((slug) => slug !== "featured")
        .map((slug) => featuredPackageOptions[slug] || slug),
    ),
  );

  const slugMap = {
    "Free Wi-Fi": "free-wifi",
    "Wi-Fi": "free-wifi",
    "Swimming Pool": "swimming-pool",
    "Giant Swimming Pools": "swimming-pool",
    Spa: "spa",
    Restaurant: "restaurant",
    "Free Parking": "free-parking",
  };
  const bestForArr = typeof data.bestFor === "string"
    ? data.bestFor.split(",").map((s) => s.trim()).filter(Boolean)
    : Array.isArray(data.bestFor)
      ? data.bestFor
      : [];
  const bestForSlugsArr = bestForArr.map((name) =>
    String(name)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  );

  const facilitySlugsArr = data.facilities.map((fac) => slugMap[fac] || fac.toLowerCase().replace(/\s+/g, "-"));
  const combinedSlugs = [...new Set([...facilitySlugsArr, ...bestForSlugsArr])].filter(Boolean).join(",");

  formData.append("facilitySlugs", combinedSlugs);

  const filteredAddOns = data.addOns
    .filter((a) => a.name && a.name.trim() !== "" && !a.id)
    .map((a) => ({
      name: a.name,
      price: parseFloat(a.price) || 0,
      minPax: Math.max(1, Number(a.minPax) || 1),
      imageUrl: a.imageUrl || "",
    }));
  formData.append("addOns", JSON.stringify(filteredAddOns));

  if (data.image) {
    if (data.image.startsWith("data:")) {
      const fileObj = base64ToFileFn(data.image, "cover_image.png");
      if (fileObj) formData.append("coverImageUrl", fileObj);
    } else {
      formData.append("coverImageUrl", data.image);
    }
  }

  if (data.video) {
    if (data.video.startsWith("data:")) {
      const fileObj = base64ToFileFn(data.video, "video.mp4");
      if (fileObj) formData.append("videoUrl", fileObj);
    } else {
      formData.append("videoUrl", data.video);
    }
  }

  if (data.gallery && data.gallery.length > 0) {
    data.gallery.forEach((img, idx) => {
      const urlStr = img.url;
      const cat = img.category || "Hotel";
      const catUpper = cat.toUpperCase().replace(/\s+/g, "_");
      const formKey = `images${catUpper}`;
      const isVideo = catUpper === "VIDEOS";
      const ext = isVideo ? "mp4" : "png";

      if (urlStr.startsWith("data:")) {
        const fileObj = base64ToFileFn(
          urlStr,
          `gallery_${catUpper.toLowerCase()}_${idx}.${ext}`,
        );
        if (fileObj) {
          formData.append(formKey, fileObj);
        }
      }
    });
  }

  return formData;
};
