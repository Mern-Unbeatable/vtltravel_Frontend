# Customize Stay Add-on Backend Requirements

This document defines the backend changes needed to fully support the new frontend behavior on `CustomizeStayPage`.

## Why this is needed

Frontend now supports:

- Add-on card image rendering per add-on
- Minimum pax requirement per add-on
- Selection blocking when current guest count is below add-on minimum pax

To make this fully reliable, backend must send stable add-on fields in hotel details API.

## Required API fields per add-on

For each add-on item (from `hotel.addOns`), include:

- `id` (string/uuid)
- `name` (string)
- `description` (string, optional)
- `price` (number)
- `priceUnit` (string enum, existing)
- `isActive` (boolean)
- `imageUrl` (string URL) **new/required for image support**
- `minPax` (integer, default `1`) **new/required for pax rule**

Supported `priceUnit` values currently used by frontend:

- `per_room_per_stay`
- `per_person_per_stay`
- `per_room_per_night`
- `per_person_per_night`

## Create / Update add-on payload changes

For add-on management endpoints, accept and persist:

- `imageUrl` (file upload URL or CDN URL after upload)
- `minPax` (positive integer, minimum `1`)

Validation rules:

- If `minPax` missing, set to `1`
- Reject invalid `minPax` (`0`, negative, non-numeric)
- `imageUrl` can be empty only if business allows placeholder image behavior

## Suggested response shape

```json
{
  "id": "addon_123",
  "name": "Bintan Mangrove Tour",
  "description": "Guided mangrove and wildlife experience.",
  "price": 45,
  "priceUnit": "per_person_per_stay",
  "minPax": 2,
  "imageUrl": "https://cdn.example.com/addons/mangrove-tour.jpg",
  "isActive": true
}
```

## Frontend compatibility notes

Frontend currently has fallback read order:

- Image: `imageUrl` -> `coverImageUrl` -> `thumbnailUrl` -> first item from `images[]`
- Min pax: `minPax` -> `minimumPax` -> `minGuests` -> fallback `1`

For long-term consistency, backend should standardize on:

- `imageUrl`
- `minPax`

## QA checklist

- Add-on image appears on customize stay card
- Add-on with `minPax: 1` selectable for single guest
- Add-on with `minPax: 2` blocked when total guests = 1
- Add-on becomes selectable when guests >= `minPax`
- Selected add-ons still appear in booking summary payload
