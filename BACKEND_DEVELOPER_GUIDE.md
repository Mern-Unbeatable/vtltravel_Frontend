# ব্যাকএন্ড ডেভেলপার গাইড (Backend Developer Guide)

এই ডকুমেন্টটি ভিটিএল ট্রাভেল (VTL Travel) ফ্রন্টএন্ড পোর্টালের বিভিন্ন পেজ এবং ফিচারের ডেটা ফ্লো (Data Flow) এবং কানেক্টিভিটি ব্যাখ্যা করে, যা ব্যাকএন্ড ডেটাবেজ ও এপিআই (API) ডিজাইনে সাহায্য করবে।

---

## ১. অথেন্টিকেশন ও ইউজার ম্যানেজমেন্ট (Authentication Flow)

**কানেক্টিভিটি:** [Login.jsx](file:///c:/Users/rakib/vtltravel/src/pages/auth/Login.jsx) ➔ [AuthContext.jsx](file:///c:/Users/rakib/vtltravel/src/context/AuthContext.jsx) ➔ [AdminLayout.jsx](file:///c:/Users/rakib/vtltravel/src/layout/AdminLayout.jsx)

### ফ্লো (Flow):
1. ইউজার ইমেইল ও পাসওয়ার্ড দিয়ে লগইন সাবমিট করলে ফ্রন্টএন্ড থেকে POST রিকোয়েস্ট পাঠানো হবে।
2. ব্যাকএন্ড থেকে রেসপন্সে **JWT Access Token** ও ইউজার প্রোফাইল ডেটা পাঠাতে হবে।
3. টোকেনটি ব্রাউজার কুকিতে (`js-cookie`) সেভ থাকবে এবং পরবর্তীতে প্রতিটি অথেন্টিকেটেড এপিআই রিকোয়েস্টে `Axios Interceptor` ([axiosInstance.js](file:///c:/Users/rakib/vtltravel/src/api/axiosInstance.js)) এর মাধ্যমে `Authorization: Bearer <Token>` হেডার হিসেবে অটোমেটিক পাঠানো হবে।
4. এডমিন প্যানেলের কোনো পেজে আনঅথরাইজড কোনো ইউজার ঢুকতে চাইলে রাউট গার্ড ([router.jsx](file:///c:/Users/rakib/vtltravel/src/routes/router.jsx)) তাকে লগইন পেজে রিডাইরেক্ট করবে।

### রিকমেন্ডেড ইউজার স্কিমা (User Schema):
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (Unique)",
  "passwordHash": "String",
  "role": "String (admin / user)",
  "createdAt": "Date"
}
```

---

## ২. হোটেল ও রুম ম্যানেজমেন্ট সিএমএস (Hotel & Room CMS Flow)

**কানেক্টিভিটি:** [ManageHotel.jsx](file:///c:/Users/rakib/vtltravel/src/pages/dashboard/manageHotel/ManageHotel.jsx) ➔ [HotelForm.jsx](file:///c:/Users/rakib/vtltravel/src/pages/dashboard/manageHotel/components/HotelForm.jsx) ➔ [RoomFormModal.jsx](file:///c:/Users/rakib/vtltravel/src/pages/dashboard/manageHotel/components/RoomFormModal.jsx) ➔ [useHotels.js](file:///c:/Users/rakib/vtltravel/src/hooks/useHotels.js)

### ফ্লো (Flow):
1. **Hotel Creation:** এডমিন যখন নতুন হোটেল তৈরি করেন:
   - কাভার ইমেজ (image), হোটেল ভিডিও (video) এবং গ্যালারি ফটো (gallery) ফাইলগুলো ফ্রন্টএন্ডে আপলোড হয়ে Base64 অথবা সরাসরি ইউআরএল ডেটা হিসেবে এপিআই-তে পাঠানো হবে (ব্যাকএন্ডে এ ফাইলগুলো Cloudinary/S3-তে আপলোড করে স্ট্রিং ইউআরএল ডেটাবেজে সেভ করতে হবে)।
   - হোটেলের অধীনে ডাইনামিক **Add-on Options** (Array of Objects) যুক্ত করা যায়।
   - হোটেলের অধীনে এক বা একাধিক **Rooms configuration** (Array of Room objects) সেট করা যায়।
2. **TanStack Query Integrations:** হোটেলের সমস্ত CRUD অপারেশন `useHotels.js` ফাইলের কুয়েরি ও মিউটেশনের মাধ্যমে পরিচালিত হয়। ব্যাকএন্ড এপিআই রিফ্রেশ হলে ক্যাশ ডেটা অটোমেটিক ইনভ্যালিডেট হবে।

### রিকমেন্ডেড হোটেল স্কিমা (Hotel Schema):
```json
{
  "_id": "ObjectId",
  "title": "String",
  "starNum": "Number (1 to 5)",
  "stars": "String (e.g. '4 ★')",
  "priceNum": "Number (Starting price)",
  "price": "String (e.g. '$87')",
  "image": "String (Cover image URL)",
  "video": "String (Video URL, Optional)",
  "description": "String",
  "facilities": ["String"], // e.g. ["Free Wi-Fi", "Swimming Pool"]
  "gallery": ["String"], // Array of image URLs
  "available": "Boolean",
  "addOns": [
    {
      "name": "String",
      "price": "String (e.g. '$15')"
    }
  ],
  "rooms": [
    {
      "_id": "ObjectId / Unique String",
      "name": "String (Room Title)",
      "price": "String (e.g. '$150')",
      "size": "String (e.g. '45m²')",
      "capacity": "String (e.g. '3 pers. max')",
      "bedInfo": "String (e.g. '1 King size bed')",
      "tags": ["String"],
      "image": "String (Room photo URL)",
      "roomsLeft": "String (e.g. 'Only 2 rooms left')"
    }
  ],
  "createdAt": "Date"
}
```

---

## ৩. কাস্টমার বুকিং ফ্লো (Customer Booking Flow)

**কানেক্টিভিটি:** Public Search Panel ➔ Hotel Details ➔ Customize Booking & Add-ons ➔ Ferry Option ➔ Payment ➔ [BookingList.jsx](file:///c:/Users/rakib/vtltravel/src/pages/dashboard/allBookings/components/BookingList.jsx)

### ফ্লো (Flow):
1. ইউজার পাবলিক পেজে হোটেল সিলেক্ট করবেন এবং কাস্টমাইজেশন ফ্লো-তে যাবেন।
2. ইউজার তার পছন্দমতো **রুম টাইপ**, অতিরিক্ত **Add-on options** (যেমন: এয়ারপোর্ট শাটল, ব্রেকফাস্ট) সিলেক্ট করবেন।
3. পরবর্তী ধাপে ইউজার চাইলে **Ferry Ticket** বুক করতে পারবেন (Ferry Class, Seat Quantity ও অপারেটর সিলেক্ট করে)।
4. ইউজার বিলিং ডিটেইলস দিয়ে পেমেন্ট করলে ব্যাকএন্ডে বুকিং রেকর্ড তৈরি হবে।
5. **Auto-Confirmation:** পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই ব্যাকএন্ডে বুকিং রেকর্ডটির স্ট্যাটাস অটোমেটিক **`Confirmed`** হিসেবে ডেটাবেজে সেভ করতে হবে (কোনো Pending স্ট্যাটাস থাকবে না)।
6. এডমিন তার ড্যাশবোর্ডে **All Bookings** পেজে বুকিং লিস্ট দেখতে পাবেন এবং ভিউ আইকনে ক্লিক করে কাস্টমারের রুম ও ফেরি ডিটেইলস সহ কমপ্লিট ব্রেকডাউন দেখতে পারবেন।

### রিকমেন্ডেড বুকিং স্কিমা (Booking Schema):
```json
{
  "_id": "ObjectId",
  "bookingReference": "String (Unique, e.g. VTL-100234)",
  "customerName": "String",
  "customerEmail": "String",
  "serviceType": "String (Hotel Stay / Tour Package / Ferry Only)",
  "hotelId": "ObjectId (Ref: Hotel, Optional)",
  "hotelName": "String (e.g. Sayeman Beach Resort)",
  "roomType": "String (e.g. Deluxe Ocean View Double Suite - 2 nights)",
  "ferryDetails": {
    "operator": "String (e.g. Green Line Water Bus)",
    "seatClass": "String (e.g. Premium Class)",
    "ticketsCount": "Number"
  },
  "addOnsSelected": [
    {
      "name": "String",
      "price": "String"
    }
  ],
  "bookingDate": "Date / String",
  "amountPaid": "Number",
  "currency": "String (default: USD)",
  "status": "String (Confirmed / Cancelled)", // Defaults to 'Confirmed'
  "createdAt": "Date"
}
```

---

## ৪. প্রয়োজনীয় ব্যাকএন্ড এপিআই রুটস (Required Backend API Routes)

ব্যাকএন্ড ডেভেলপারকে ফ্রন্টএন্ডের জন্য নিচের এপিআই রুটগুলো ডিজাইন করতে হবে:

### অথেন্টিকেশন রুটস (Auth Routes):
- `POST /api/auth/login` - লগইন এবং টোকেন জেনারেট।
- `POST /api/auth/logout` - সেশন/টোকেন ক্লিয়ার।

### হোটেল ম্যানেজমেন্ট রুটস (Hotel CMS Routes - Admin Access):
- `GET /api/hotels` - পেজিনেটেড হোটেল ও রিসোর্ট লিস্ট (পাবলিক ও এডমিন উভয়ের জন্য)।
- `GET /api/hotels/:id` - নির্দিষ্ট হোটেলের বিস্তারিত ডিটেইলস।
- `POST /api/hotels` - নতুন হোটেল যোগ করা (কাভার ও গ্যালারি ইমেজ সহ)।
- `PUT /api/hotels/:id` - হোটেলের বিবরণ, রুম ক্যাটাগরি, এড-অন আপডেট করা।
- `DELETE /api/hotels/:id` - হোটেল ডিলিট করা।

### বুকিং ম্যানেজমেন্ট রুটস (Booking Routes):
- `POST /api/bookings` - ইউজার পেমেন্ট শেষে নতুন বুকিং রেকর্ড তৈরি (Status: Confirmed)।
- `GET /api/bookings` - এডমিন ড্যাশবোর্ডের জন্য সমস্ত বুকিং লিস্ট (Pagination support)।
- `GET /api/bookings/:id` - নির্দিষ্ট বুকিংয়ের ডিটেইলস (View Modal-এর ডেটার জন্য)।
- `PUT /api/bookings/:id/cancel` - বুকিং ক্যানসেল করার রুট (যদি কোনো বিশেষ কারণে দরকার হয়)।
