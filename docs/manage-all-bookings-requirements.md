# Manage All Bookings — Frontend vs Backend Requirements

Client feedback (Hotel Booking Bug Fixes / Manage All Bookings).  
This doc clarifies **what frontend can do**, **what backend must provide**, and a **copy-paste message for the backend team**.

---

## Client asked for (4 points)

1. Only ~20 of all bookings show — load **all** bookings without leaving/reopening the page.
2. Track whether a **backend cancellation** is also updated in the **hotel system**.
3. Add **filters**: check-in / check-out date, hotel name, status.
4. Add **search** by customer name, email, phone number.

---

## Who does what?

| # | Client request | Frontend | Backend |
|---|----------------|----------|---------|
| 1 | Load all bookings (not stuck at 20) | Call `page` / `limit`, render `items`, use server `pagination` | Return correct `items` + `pagination.total` / `totalPages` for every page; no silent filter that empties the list |
| 2 | Cancel sync to hotel system | Show status / sync badge if API sends fields | On cancel: update hotel system + persist sync result on booking |
| 3 | Filters (dates, hotel, status) | UI controls + send query params | Accept and apply filter query params on `GET /v1/bookings` |
| 4 | Search (name, email, phone) | Search input + send query param(s) | Accept and apply search on guest fields |

**Rule:** Filter/search/pagination must be **server-side**. Doing only frontend filter on the first 20 rows will **not** meet the client request.

---

## Frontend status (current)

File: `src/pages/dashboard/allBookings/components/BookingList.jsx`

**Already done**
- Calls `GET /v1/bookings?page=&limit=20`
- Reads `data.items`, `data.pagination`, `data.summary`
- Page change refetches from API (no leave/reopen needed)

**Still pending on frontend** (after backend supports it)
- Filter UI: check-in, check-out, hotel name, status
- Search UI: customer name / email / phone
- Optional: show hotel-system cancel sync status in table/modal

**Cannot finish alone without backend**
- Full list when API returns `items: []` / `pagination.total: 0` while `summary.totalBookings > 0`
- Real filter/search across all bookings
- Cancel → hotel system tracking fields

---

## Current API shape (observed)

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "summary": {
      "totalBookings": 8,
      "filteredTotal": 0,
      "byStatus": {
        "DRAFT": 0,
        "PENDING": 6,
        "CONFIRMED": 2,
        "CANCELLED": 0,
        "COMPLETED": 0
      },
      "confirmed": 2,
      "pending": 6,
      "cancelled": 0,
      "completed": 0
    },
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

**Problem for frontend:** `summary.totalBookings` can be `8` (or `52`) but `items` is empty and `pagination.total` is `0`. Admin page then shows empty table. This must be fixed on backend (or confirm which query params FE must send).

---

## Backend requirements (needed)

### 1) List + pagination — `GET /v1/bookings`

**Query params**
- `page` (number, default `1`)
- `limit` (number, default `20`, allow higher e.g. up to `100` if needed)

**When no filters/search are applied**
- `items` = bookings for that page
- `pagination.total` = total booking count (same idea as `summary.totalBookings`)
- `pagination.totalPages` = `ceil(total / limit)`
- `summary.filteredTotal` should match `pagination.total` (or equal `totalBookings` when unfiltered)

**Example (unfiltered, page 1, 52 bookings, limit 20)**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBookings": 52,
      "filteredTotal": 52
    },
    "items": [ /* 20 booking objects */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 52,
      "totalPages": 3
    }
  }
}
```

Page 2 → next 20 items, `page: 2`, same `total: 52`.

### 2) Filters (query params)

| Param | Type | Behavior |
|-------|------|----------|
| `checkIn` | date `YYYY-MM-DD` | Bookings with check-in on/after this date (or exact — confirm) |
| `checkOut` | date `YYYY-MM-DD` | Bookings with check-out on/before this date (or exact — confirm) |
| `hotelId` | uuid/string | Preferred filter by hotel id |
| `hotelName` | string | Optional partial match if id not used |
| `status` | string | e.g. `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `DRAFT` |

When filters applied:
- `items` = filtered page results
- `pagination.total` / `summary.filteredTotal` = filtered count
- `summary.totalBookings` can stay as overall (unfiltered) total

### 3) Search (query params)

Prefer one param:
- `q` — matches **guest name OR email OR phone** (partial, case-insensitive)

Or separate:
- `guestName`, `guestEmail`, `guestPhone`

Frontend will send these with `page` / `limit`.

### 4) Cancel sync with hotel system

When a booking is cancelled (admin or system):
1. Update booking status to `CANCELLED` in DB.
2. Call / update the external hotel system.
3. Store sync result on the booking so admin UI can show it.

**Suggested fields on each booking (list + detail)**
| Field | Type | Meaning |
|-------|------|---------|
| `status` | string | `CANCELLED` etc. |
| `hotelSystemSyncStatus` | string | e.g. `SYNCED`, `PENDING`, `FAILED`, `NOT_APPLICABLE` |
| `hotelSystemSyncedAt` | ISO datetime \| null | Last successful sync time |
| `hotelSystemSyncError` | string \| null | Error message if failed |

**Cancel endpoint** (if not already): e.g. `PUT /v1/bookings/:id/cancel` or `PATCH` with status — response should include the sync fields above.

---

## Message to send backend team (copy-paste)

```text
Subject: Manage All Bookings API — pagination, filter, search, cancel sync

Hi team,

Client requirements for Admin → Manage All Bookings need backend support.
Frontend will build UI + send query params; we cannot finish with FE-only filtering.

Please confirm / implement:

1) GET /v1/bookings pagination
- Support page & limit.
- Unfiltered: return items for the page and set pagination.total / totalPages correctly.
- Bug we see now: summary.totalBookings > 0 but items=[] and pagination.total=0.
  Please fix so unfiltered list returns real items.

2) Filters (query params)
- checkIn, checkOut (YYYY-MM-DD)
- hotelId (preferred) and/or hotelName
- status (PENDING | CONFIRMED | CANCELLED | COMPLETED | DRAFT …)

3) Search
- Prefer q = guest name OR email OR phone (partial, case-insensitive)
  OR guestName / guestEmail / guestPhone

4) Cancel → hotel system tracking
- On cancel, update hotel system and persist:
  hotelSystemSyncStatus, hotelSystemSyncedAt, hotelSystemSyncError
- Return these on list/detail so admin can see if cancel synced.

Please share final param names + sample success JSON when ready.
Frontend will wire filter/search UI after that.

Thanks
```

---

## Suggested work order

1. **Backend:** Fix unfiltered list (`items` + `pagination.total`) — highest priority.  
2. **Backend:** Add filter + search query params.  
3. **Frontend:** Add filter/search UI wired to those params.  
4. **Backend:** Cancel sync fields + cancel API behavior.  
5. **Frontend:** Show sync status in table/detail modal.

---

## Related frontend files

- `src/pages/dashboard/allBookings/AllBookings.jsx`
- `src/pages/dashboard/allBookings/components/BookingList.jsx`
- `src/api/endpoints.js` → `BOOKINGS: '/v1/bookings'`
- `src/api/services/bookingService.js`
