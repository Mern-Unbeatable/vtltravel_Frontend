# Search hotel card — backend field mapping

Search result cards (`HotelResultCard`) already use live hotel list data (`name`, `images`, `fromPrice`, etc.). Extra UI pieces (rating, amenities, badges, “Best for”) currently fall back to **one dummy set** so the design matches the card mock while those fields are missing.

When the API starts sending a field, **remove the dummy for that field automatically**. No card redesign is required — `getHotelCardDisplay()` prefers backend values.

## How it works

1. `useHotels()` loads hotels from the search API.
2. `HotelResultCard` calls `getHotelCardDisplay(hotel)`.
3. For each extra field: **if backend has a value → use it; else → dummy**.

Dummy defaults live in `src/utils/hotelCardDisplay.js` (`HOTEL_CARD_DUMMY`). After the API covers a field, you can delete that dummy key.

## Field mapping

| Card UI | Backend field (preferred first) | Dummy until then | Notes |
|---|---|---|---|
| Image location chip | `city` → `location` → `island` | `"Bintan"` | Short place name |
| Title | `name` / `title` | — | Already from API |
| Description | `shortDescription` | — | Already from API; hide if empty |
| Star icons | `starRating` | `4` | Integer 1–5 |
| Score + label | `guestRating` or `rating` or `reviewScore` + `ratingLabel` | `4.6` / `"Excellent"` | If `reviewScore` is out of 10, frontend divides by 2 for the /5 card |
| Review count | `reviewCount` or `reviewsCount` | `128` | Number |
| Amenity chips (max 5) | `cardAmenities` → `popularFacilities` → `facilities` | Private Beach, Pool, Family Friendly, Spa, Breakfast | Array of strings or `{ name }` / `{ facility.name }` |
| “Best for” | `bestFor` → `tags` | Couples, Families, Relaxing getaway | Array of strings |
| Top-right badges (max 2) | `badges` → `highlights` → `accommodationStyle` | Beachfront Resort, Family Favourite | Strings or `{ name }` |
| From price | `fromPrice` → `startingPrice` → `price` | — | Already from API |
| Public rate | `publicRate` → `roomTypes[0].basePrice` | `150` | Same currency as from price |
| Gallery count | hotel images / gallery API | — | Already from API |
| See the hotel | `id` / `slug` | — | Already from API |

### Suggested API shapes (optional)

```json
{
  "id": "uuid",
  "name": "The Residence Bintan",
  "shortDescription": "Peaceful beachfront resort...",
  "city": "Bintan",
  "starRating": 4,
  "guestRating": 4.6,
  "ratingLabel": "Excellent",
  "reviewCount": 128,
  "fromPrice": 150,
  "publicRate": 150,
  "facilities": [{ "facility": { "name": "Pool" } }],
  "bestFor": ["Couples", "Families"],
  "badges": ["Beachfront Resort", "Family Favourite"]
}
```

## Frontend change when a field goes live

You do **not** need to hard-code new dummy data per hotel.

- If the list payload includes the field, the card switches by itself.
- If the name differs from the table above, add that key to the fallback chain in `getHotelCardDisplay()`.
- When every extra field is real, delete `HOTEL_CARD_DUMMY` and the dummy branches.

## Do not invent API totals

Filter counts and hotel list items still come from the backend. Dummy data is **display-only** for missing card extras, not for search results or pagination.
