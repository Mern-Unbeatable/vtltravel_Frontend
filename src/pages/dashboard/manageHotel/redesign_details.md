# হোটেল ম্যানেজমেন্ট রিডিজাইন (Frontend Only)

এই ফোল্ডারের ব্যাকএন্ড ইন্টিগ্রেশনগুলো সাময়িকভাবে মক (mock) করা হয়েছে যাতে ব্যাকএন্ড ডেটাবেজ বা সার্ভার কানেকশন ছাড়াই ফ্রন্টএন্ড থেকে সব কিছু টেস্ট করা যায়।

## সম্পন্ন করা পরিবর্তনের বিবরণ:

1. **ManageHotel.jsx এ লোকাল স্টেট:**
   - TanStack Query এর পরিবর্তে `localStorage` ব্যবহার করে ব্রাউজারে ডেটা স্টোর করা হচ্ছে।
   - এর ফলে নতুন হোটেল তৈরি করা, এডিট করা এবং ডিলিট করার পর মক লিস্ট স্বয়ংক্রিয়ভাবে আপডেট হয়।

2. **HotelForm.jsx এ মক গ্যালারি ও রুম আপলোড:**
   - হোটেল গ্যালারিতে ছবি আপলোড করলে তা কোনো এপিআই সার্ভারে না পাঠিয়ে সরাসরি Base64 স্ট্রিং হিসেবে রূপান্তর করে লোকাল মেমরিতে সেভ করা হচ্ছে।
   - রুম অ্যাড এবং রুম ডিলিট করার এপিআই সার্ভিস ব্লক করে দিয়ে লোকাল ফর্মে অ্যাড করা হয়েছে।

3. **প্রিমিয়াম ইউজার এক্সপেরিয়েন্স (UX):**
   - সুন্দর বর্ডার, ইনপুট ফিল্ডের ফোকাস ইফেক্ট এবং চমৎকার ভিজ্যুয়াল ফিডব্যাক সহ সম্পূর্ণ ফর্মের ডিজাইন উন্নত করা হয়েছে।
   - প্রতিটি রুমের জন্য ক্যালেন্ডার কন্ট্রোল অ্যাড করা হয়েছে যেখানে ডেট সিলেক্ট করে প্রাইস বা ব্লক স্ট্যাটাস সেট করা যায়।

---

## ব্যাকএন্ড ইমপ্লিমেন্টেশন গাইড (Backend Implementation Guide)

নতুন ফ্রন্টএন্ড ডিজাইন অনুযায়ী, পুরো হোটেলের ডেটা (বেসিক ডিটেইলস, গ্যালারি মিডিয়া এবং রুম টাইপস ও ক্যালেন্ডার রেটস) আলাদা আলাদা এন্ডপয়েন্টে না পাঠিয়ে একটি একক **Unified Form Data Request**-এর মাধ্যমে পাঠানো হচ্ছে। ব্যাকএন্ড ইমপ্লিমেন্টেশনের জন্য নিচে ডেটাবেজ ও এপিআই আর্কিটেকচার দেওয়া হলো:

### ১. ডেটাবেজ স্কিমা ডিজাইন (Database Schema)

মঙ্গোডিবি (MongoDB) এবং মঙ্গুস (Mongoose) ব্যবহার করে স্কিমাগুলো নিম্নরূপ ডিজাইন করা যেতে পারে:

#### ক) হোটেল স্কিমা (Hotel Schema)
```javascript
const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  starRating: { type: Number, required: true, min: 1, max: 5 },
  startingPrice: { type: Number, required: true },
  coverImageUrl: { type: String, required: true },
  videoUrl: { type: String, default: "" },
  description: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  facilities: [{ type: String }], // e.g. ['free-wifi', 'swimming-pool']
  addOns: [{
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  gallery: [{
    url: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['VIDEOS', 'HOTEL', 'ROOMS', 'SUITE', 'RESTAURANT', 'BAR', 'BREAKFAST', 'FAMILY', 'WEDDINGS', 'MEETINGS_AND_EVENTS', 'SERVICES', 'HOTEL_ADVANTAGES', 'SPA'],
      default: 'HOTEL' 
    }
  }]
}, { timestamps: true });
```

#### খ) রুম টাইপ স্কিমা (Room Type Schema)
```javascript
const RoomTypeSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { type: String, required: true },
  basePrice: { type: Number, required: true }, // Default daily rate
  size: { type: String }, // e.g., '45 sqm'
  capacity: { type: String }, // e.g., '2 pers. max'
  bedInfo: { type: String }, // e.g., '1 King size bed'
  baths: { type: String }, // e.g., '1 Bath'
  description: { type: String },
  // ক্যালেন্ডার রেট এবং ব্লকিং সেটিংস সংরক্ষণের জন্য
  calendarSettings: {
    type: Map,
    of: new mongoose.Schema({
      price: { type: Number },
      isBlocked: { type: Boolean, default: false }
    }, { _id: false }),
    default: {}
  }
}, { timestamps: true });
```
> [!NOTE]
> `calendarSettings`-এ কী (key) হিসেবে ডেট স্ট্রিং (যেমন: `"2026-08-15"`) ব্যবহার করে সেই নির্দিষ্ট দিনের কাস্টম প্রাইস ও ব্লক স্ট্যাটাস ম্যাপ করা হবে।

---

### ২. প্রয়োজনীয় এপিআই এন্ডপয়েন্টসমূহ (API Endpoints)

নতুন ফর্ম ডিজাইন অনুযায়ী সকল ফাইল এবং রিলেশনাল ডেটা একবারে একটি পেলোডে সাবমিট হয়:

#### ক) নতুন হোটেল তৈরি করা (Create Hotel)
- **এন্ডপয়েন্ট:** `POST /v1/hotels`
- **Content-Type:** `multipart/form-data`
- **পেলোড বিবরণ (Payload):**
  - `name`: হোটেলের নাম
  - `starRating`: স্টারের সংখ্যা
  - `startingPrice`: শুরুর প্রাইস
  - `description`: হোটেলের বিবরণ
  - `coverImageUrl`: কভার ইমেজ ফাইল (`coverImageUrl` ফিল্ডের বাইনারি ফাইল)
  - `videoUrl`: ভিডিও ফাইল (`videoUrl` ফিল্ডের বাইনারি ফাইল, ঐচ্ছিক)
  - `facilitySlugs`: কমা দ্বারা বিভক্ত ফ্যাসিলিটিজ (যেমন: `"free-wifi,swimming-pool,spa"`)
  - `addOns`: অ্যাড-অন সমূহের লিস্ট (JSON stringified)
  - `gallery`: গ্যালারির মেটাডেটা এবং ক্যাটাগরি ম্যাপিং (JSON stringified)
  - `galleryImages`: গ্যালারির সকল মিডিয়া ফাইল (Array of files)
  - `galleryCategories[i]`: প্রতিটি ফাইলের সাথে সামঞ্জস্যপূর্ণ ক্যাটাগরি (যেমন: `HOTEL`, `ROOMS`, `VIDEOS`)
  - `rooms`: রুম সমূহের সম্পূর্ণ তালিকা ক্যালেন্ডার রেটস সহ (JSON stringified)

#### খ) হোটেল আপডেট করা (Update Hotel)
- **এন্ডপয়েন্ট:** `PUT /v1/hotels/:id`
- **Content-Type:** `multipart/form-data`
- **পেলোড বিবরণ (Payload):** আপডেটেড হোটেল ডেটা, নতুন যোগ করা মিডিয়া এবং রুমের সম্পূর্ণ লিস্ট।
  - *ব্যাকএন্ড সিঙ্ক প্রসেস (Syncing Rooms):* ব্যাকএন্ডে রিকোয়েস্টে আসা রুম লিস্টের সাথে ডাটাবেজে থাকা পূর্বের রুমগুলোর তুলনা করতে হবে। পেলোডে যে রুমগুলো উপস্থিত নেই বা ডিলিট করা হয়েছে সেগুলো ডাটাবেজ থেকে মুছে দিতে হবে, নতুন রুমগুলো তৈরি করতে হবে এবং মডিফাইড রুমগুলোর তথ্য ও ক্যালেন্ডার রেট আপডেট করতে হবে।

#### গ) হোটেল ডিলিট করা (Delete Hotel)
- **এন্ডপয়েন্ট:** `DELETE /v1/hotels/:id`
  - *ক্যাসকেড ডিলিট:* ডাটাবেজ থেকে হোটেল ডকুমেন্টটি ডিলিট করার পাশাপাশি এর অধীনে থাকা সব রুম ডকুমেন্ট এবং স্টোরেজ প্রোভাইডারে থাকা সংশ্লিষ্ট সকল ইমেজ/ভিডিও মুছে দিতে হবে।

#### ঘ) হোটেলের বিস্তারিত তথ্য রিট্রিভ করা (Get Hotel Details)
- **এন্ডপয়েন্ট:** `GET /v1/hotels/:id`
  - *রেসপন্স:* হোটেলের মূল ডকুমেন্টের সাথে এর সমস্ত রুম টাইপস এবং তাদের ডেট-বাই-ডেট ক্যালেন্ডার রেটস একসাথে রিটার্ন করতে হবে যাতে ফ্রন্টএন্ড এক রিকোয়েস্টেই পুরো ভিউ লোড করতে পারে।

---

### ৩. ফাইল আপলোড হ্যান্ডলিং (File Upload Handling)

1. ব্যাকএন্ডে **Multer** বা অনুরুপ ফাইল আপলোডার ব্যবহার করে ইনকামিং `multipart/form-data` থেকে ফাইলগুলো রিসিভ করতে হবে।
2. আপলোডকৃত ছবি ও ভিডিও সরাসরি ডাটাবেজে সেভ না করে **Cloudinary** অথবা **AWS S3** এর মতো অবজেক্ট স্টোরেজে পাঠাতে হবে।
3. স্টোরেজ প্রোভাইডারের আপলোড রেসপন্স থেকে প্রাপ্ত **URL**-টি সংশ্লিষ্ট ডকুমেন্টের গ্যালারি বা কভার ইমেজে স্টোর করতে হবে।
