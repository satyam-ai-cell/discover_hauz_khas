// =====================================================================
// Discover Hauz Khas — static site generator (zero dependencies)
// Renders SEO-optimised static HTML for every page from src/data.mjs.
// Run:  node build.mjs   →   outputs to /dist
// =====================================================================
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// ===== inlined data (was src/data.mjs) =====
// =============================================================
// Discover Hauz Khas — core data
// Real businesses researched across Hauz Khas, New Delhi.
// `phoneVerified: true` = number confirmed from a public listing.
// `phoneVerified: false` (or missing) = replace with the number
// from the business's Google Business Profile before launch.
// =============================================================

const siteConfig = {
  name: "Discover Hauz Khas",
  shortName: "Discover Hauz Khas",
  // ⇩ Change this to your live Vercel/custom domain before deploying.
  url: "https://discover-hauz-khas.vercel.app",
  locality: "Hauz Khas",
  region: "New Delhi",
  tagline: "Everything around you in Hauz Khas",
  description:
    "The everyday directory for people in Hauz Khas — find what's open right now near you: pharmacies, clinics, salons, gyms, coworking, cafés, restaurants and stores, with live hours, distance and one-tap directions.",
  email: "hello@discoverhauzkhas.in",
  phone: "+91 11 4000 0000",
  social: {
    instagram: "https://instagram.com/discoverhauzkhas",
    facebook: "https://facebook.com/discoverhauzkhas",
    twitter: "https://twitter.com/discoverhauzkhas",
    youtube: "https://youtube.com/@discoverhauzkhas",
  },
};


const categories = [
  {
    slug: "cafes",
    name: "Cafés & Coffee",
    singular: "Café",
    blurb: "Instagrammable coffee spots, tea rooms and all-day cafés.",
    metaDescription:
      "The best cafés and coffee shops in Hauz Khas, New Delhi — from Instagrammable tea rooms to all-day café-offices. Addresses, ratings and details.",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=70",
    icon: "☕",
  },
  {
    slug: "restaurants",
    name: "Restaurants & Dining",
    singular: "Restaurant",
    blurb: "From Himalayan kitchens to rooftop Italian with a lake view.",
    metaDescription:
      "Where to eat in Hauz Khas, New Delhi — the best restaurants for Himalayan, Italian, North Indian and fusion food, with addresses and ratings.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=70",
    icon: "🍽️",
  },
  {
    slug: "bars-nightlife",
    name: "Bars & Nightlife",
    singular: "Bar",
    blurb: "Rooftop bars, pubs and live-music lounges over the lake.",
    metaDescription:
      "Hauz Khas nightlife guide — the best rooftop bars, pubs and lounges in Hauz Khas Village, New Delhi, with lake views, live music and details.",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=70",
    icon: "🍸",
  },
  {
    slug: "art-galleries",
    name: "Art & Culture",
    singular: "Art Gallery",
    blurb: "Contemporary galleries, studios and the historic lake ruins.",
    metaDescription:
      "Art galleries and cultural spaces in Hauz Khas Village, New Delhi — contemporary art, studios and the historic Hauz Khas complex.",
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=70",
    icon: "🎨",
  },
  {
    slug: "boutiques",
    name: "Fashion & Boutiques",
    singular: "Boutique",
    blurb: "Independent designers, slow fashion and concept stores.",
    metaDescription:
      "Shop the best boutiques in Hauz Khas Village, New Delhi — independent designers, slow fashion, leather goods and concept stores.",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=70",
    icon: "👗",
  },
  {
    slug: "salons-spas",
    name: "Salons & Spas",
    singular: "Salon",
    blurb: "Hair, beauty, grooming and relaxing spa retreats.",
    metaDescription:
      "The best salons, spas and beauty parlours in Hauz Khas, New Delhi — hair, grooming, skincare and massage, with addresses and ratings.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=70",
    icon: "💇",
  },
  {
    slug: "fitness",
    name: "Gyms & Fitness",
    singular: "Gym",
    blurb: "Gyms, yoga, pilates and functional-training studios.",
    metaDescription:
      "Gyms and fitness studios in Hauz Khas & Hauz Khas Enclave, New Delhi — strength training, yoga, pilates and functional fitness.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=70",
    icon: "🏋️",
  },
  {
    slug: "coworking",
    name: "Coworking & Study",
    singular: "Coworking Space",
    blurb: "Hot desks, private cabins and café-offices near IIT Delhi.",
    metaDescription:
      "Coworking spaces in Hauz Khas & SDA Market, New Delhi — hot desks, private cabins and café-offices near IIT Delhi. Compare and choose.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=70",
    icon: "💻",
  },
  {
    slug: "health",
    name: "Clinics & Pharmacies",
    singular: "Clinic",
    blurb: "Hospitals, clinics, dentists and 24x7 pharmacies.",
    metaDescription:
      "Clinics, hospitals, dentists and pharmacies in Hauz Khas, New Delhi — everyday healthcare and wellness services near you.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=70",
    icon: "🩺",
  },
  {
    slug: "shopping",
    name: "Books & Lifestyle",
    singular: "Store",
    blurb: "Bookshops, home, gifting and everyday market essentials.",
    metaDescription:
      "Bookshops, lifestyle and everyday stores in Hauz Khas, Aurobindo Place & SDA Market, New Delhi — books, gifts, home and essentials.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=70",
    icon: "🛍️",
  },
];


// Image pools (topical Unsplash photos) reused per category.
const img = {
  cafe1: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=70",
  cafe2: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=900&q=70",
  cafe3: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=70",
  cafe4: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=70",
  food1: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=70",
  food2: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=70",
  food3: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=70",
  bar1: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=70",
  bar2: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=900&q=70",
  bar3: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=900&q=70",
  bar4: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=900&q=70",
  art1: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&w=900&q=70",
  art2: "https://images.unsplash.com/photo-1594732832278-abd644401426?auto=format&fit=crop&w=900&q=70",
  shop1: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=900&q=70",
  shop2: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=70",
  bag1: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=70",
  salon1: "https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&w=900&q=70",
  salon2: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=900&q=70",
  gym1: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=70",
  gym2: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=70",
  yoga1: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=70",
  cowork1: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=70",
  cowork2: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&w=900&q=70",
  cowork3: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=70",
  health1: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=70",
  health2: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=70",
  pharma1: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=70",
  books1: "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=900&q=70",
  books2: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=70",
  cafe5: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=70",
  cafe6: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=70",
  food4: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=70",
  food5: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=70",
  bar5: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=70",
  bar6: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=70",
  art3: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=900&q=70",
  art4: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=900&q=70",
  heritage1: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Feroz_Shah%27s_Madrasa.JPG/1280px-Feroz_Shah%27s_Madrasa.JPG",
  shop3: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=70",
  shop4: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=70",
  salon3: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=70",
  salon4: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=70",
  gym3: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=70",
  yoga2: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=900&q=70",
  cowork4: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=70",
  health3: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=900&q=70",
  health4: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=900&q=70",
  books3: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=900&q=70",
};

const listings = [
  // ---------------- CAFÉS ----------------
  {
    slug: "coast-cafe",
    name: "Coast Café",
    category: "cafes",
    area: "Hauz Khas Village",
    address: "2nd & 3rd Floor, above OGAAN, H-2, Hauz Khas Village, New Delhi 110016",
    phone: "+91 11 4160 1717",
    phoneVerified: true,
    rating: 4.3,
    reviews: 4200,
    price: 3,
    tags: ["Coastal", "South Indian", "Rooftop", "Instagrammable"],
    short: "Breezy fusion café with coastal plates and a leafy rooftop.",
    description:
      "Coast Café is one of the most photographed cafés in Hauz Khas Village, known for its all-white, plant-filled interiors and a fusion menu leaning on South Indian and coastal flavours. The upper-floor seating overlooks the Village lanes, making it a favourite brunch and coffee spot.",
    hours: "12:00 PM – 12:00 AM",
    image: img.cafe1,
    featured: true,
  },
  {
    slug: "the-tea-room-blossom-kochhar",
    name: "The Tea Room by Blossom Kochhar",
    category: "cafes",
    area: "Hauz Khas Village",
    address: "Hauz Khas Village, New Delhi 110016",
    rating: 4.4,
    reviews: 680,
    price: 2,
    tags: ["Tea", "Aromatherapy", "Calm", "Instagrammable"],
    short: "A soothing aroma-led tea lounge with an all-day menu.",
    description:
      "The Tea Room by Blossom Kochhar is a calm, aromatherapy-inspired café in Hauz Khas Village serving a wide range of teas alongside light all-day food. Its soft, wholesome interiors make it one of the most relaxing coffee and tea spots in the area.",
    hours: "11:00 AM – 9:00 PM",
    image: img.cafe2,
  },
  {
    slug: "oval-bean-cafe",
    name: "Oval Bean Café",
    category: "cafes",
    area: "Hauz Khas Village",
    address: "Main Market, Hauz Khas Village, New Delhi 110016",
    rating: 4.0,
    reviews: 520,
    price: 1,
    tags: ["Coffee", "Burgers", "Budget", "Quick bite"],
    short: "Pocket-friendly café for burgers, pastas, shakes and coffee.",
    description:
      "Oval Bean Café is a value-for-money café in the heart of Hauz Khas Village serving burgers, fries, sandwiches, pastas, wraps and a full range of coffees, teas and shakes. A reliable quick-bite stop while exploring the Village.",
    hours: "11:00 AM – 11:00 PM",
    image: img.cafe3,
  },
  {
    slug: "summer-house-cafe",
    name: "Summer House Café",
    category: "cafes",
    area: "Aurobindo Place",
    address: "Aurobindo Place Market, Hauz Khas, New Delhi 110016",
    phone: "+91 98102 00780",
    phoneVerified: true,
    rating: 4.2,
    reviews: 3100,
    price: 3,
    tags: ["Rooftop", "Live music", "Continental", "Weekend"],
    short: "Leafy rooftop café-bar with live music and continental plates.",
    description:
      "Summer House Café is a long-standing rooftop café-bar near Aurobindo Place serving continental and Italian food with regular live music and DJ nights. Its greenery-filled terrace makes it a popular weekend hangout close to Hauz Khas.",
    hours: "12:00 PM – 12:30 AM",
    image: img.cafe4,
  },

  // ---------------- RESTAURANTS ----------------
  {
    slug: "yeti-the-himalayan-kitchen",
    name: "Yeti – The Himalayan Kitchen",
    category: "restaurants",
    area: "Hauz Khas Village",
    address: "30, First Floor, Hauz Khas Village, New Delhi 110016",
    rating: 4.2,
    reviews: 2600,
    price: 3,
    tags: ["Himalayan", "Tibetan", "Nepalese", "Momos"],
    short: "Authentic Himalayan, Tibetan and Nepalese comfort food.",
    description:
      "Yeti – The Himalayan Kitchen is a Hauz Khas Village institution for Tibetan, Nepalese and Himalayan cuisine — think momos, thukpa, phaley and hearty mountain curries. Warm interiors and Village views make it a dependable sit-down dinner spot.",
    hours: "12:00 PM – 1:00 AM",
    image: img.food1,
  },
  {
    slug: "lama-kitchen",
    name: "Lama Kitchen – Himalayan Cook House",
    category: "restaurants",
    area: "Hauz Khas Village",
    address: "50A, Hauz Khas Village, New Delhi 110016",
    rating: 4.1,
    reviews: 900,
    price: 2,
    tags: ["Himalayan", "Momos", "Thukpa", "Cosy"],
    short: "Cosy Himalayan cook-house for momos, thukpa and curries.",
    description:
      "Lama Kitchen offers a rooted Himalayan culinary experience in Hauz Khas Village, with authentic momos, thukpa and comforting curries. A cosy, unfussy pick for mountain food in the Village.",
    hours: "12:00 PM – 11:00 PM",
    image: img.food2,
  },
  {
    slug: "mia-bella",
    name: "Mia Bella",
    category: "restaurants",
    area: "Hauz Khas Village",
    address: "50E, 2nd Floor, Hauz Khas Fort Road, Hauz Khas Village, New Delhi 110016",
    phone: "+91 84482 01901",
    phoneVerified: true,
    rating: 4.3,
    reviews: 1700,
    price: 4,
    tags: ["Italian", "European", "Rooftop", "Lake view", "Date night"],
    short: "Rooftop Italian & European dining overlooking the lake.",
    description:
      "Mia Bella is a rooftop oasis overlooking the historic Hauz Khas lake, serving Italian and European cuisine. With one of the best views in the Village, it is a go-to for romantic dinners and special evenings.",
    hours: "12:00 PM – 1:00 AM",
    image: img.food3,
    featured: true,
  },
  {
    slug: "naivedyam",
    name: "Naivedyam",
    category: "restaurants",
    area: "Hauz Khas Village",
    address: "1, Hauz Khas Village, New Delhi 110016",
    phone: "+91 11 2696 0426",
    phoneVerified: true,
    rating: 4.2,
    reviews: 8200,
    price: 2,
    tags: ["South Indian", "Vegetarian", "Dosa", "Value"],
    short: "Beloved South Indian vegetarian institution in the Village.",
    description:
      "Naivedyam is a long-standing South Indian vegetarian favourite in Hauz Khas Village, famous for its crisp dosas, filter coffee and temple-style interiors. Great value and a reliable crowd-pleaser for groups.",
    hours: "11:00 AM – 11:00 PM",
    image: img.food2,
  },
  {
    slug: "gunpowder",
    name: "Gunpowder",
    category: "restaurants",
    area: "Hauz Khas Village",
    address: "22, Top Floor, Hauz Khas Village, New Delhi 110016",
    phone: "+91 11 2653 5700",
    phoneVerified: true,
    rating: 4.3,
    reviews: 3400,
    price: 3,
    tags: ["South Indian", "Andhra", "Kerala", "Rooftop", "Lake view"],
    short: "Hidden top-floor gem for regional South Indian cooking.",
    description:
      "Gunpowder is a much-loved, tucked-away restaurant on the top floor of a Hauz Khas Village building, serving robust Andhra, Kerala and coastal home-style food with a view of the lake. Worth the climb.",
    hours: "12:30 PM – 3:30 PM, 7:00 PM – 11:00 PM",
    image: img.food1,
  },

  // ---------------- BARS & NIGHTLIFE ----------------
  {
    slug: "hauz-khas-social",
    name: "Hauz Khas Social",
    category: "bars-nightlife",
    area: "Hauz Khas Village",
    address: "Plot 9A & 12, Hauz Khas Tank, Hauz Khas Village, Deer Park, New Delhi 110016",
    phone: "+91 78386 52814",
    phoneVerified: true,
    rating: 4.4,
    reviews: 26000,
    price: 3,
    tags: ["Rooftop", "Cocktails", "Café-office", "Lake view", "Live music"],
    short: "The iconic multi-level brasserie & bar over the lake.",
    description:
      "Hauz Khas Social is the most popular themed brasserie-bar in the Village and a defining Delhi hangout. Its multi-level, rustic-industrial space includes a rooftop overlooking the Hauz Khas monument and lake, plus a work-friendly café by day and a buzzing bar by night.",
    hours: "11:00 AM – 1:00 AM",
    image: img.bar1,
    featured: true,
  },
  {
    slug: "raasta",
    name: "Raasta",
    category: "bars-nightlife",
    area: "Hauz Khas Village",
    address: "30, First Floor, Hauz Khas Village, New Delhi 110016",
    phone: "+91 11 4062 3028",
    phoneVerified: true,
    rating: 4.1,
    reviews: 5400,
    price: 3,
    tags: ["Caribbean", "Reggae", "Rooftop", "Cocktails"],
    short: "Caribbean-themed reggae bar with a colourful rooftop.",
    description:
      "Raasta is a Caribbean-inspired resto-bar paying tribute to reggae culture, with vibrant murals, a lively rooftop and a full cocktail list. One of the most recognisable nightlife spots in Hauz Khas Village.",
    hours: "12:00 PM – 1:00 AM",
    image: img.bar2,
  },
  {
    slug: "match-box-hauz-khas",
    name: "Match Box – Pub & Grub",
    category: "bars-nightlife",
    area: "Hauz Khas Village",
    address: "Hauz Khas Village, New Delhi 110016",
    rating: 4.0,
    reviews: 2100,
    price: 2,
    tags: ["Rock", "Pub", "Pocket-friendly", "Music"],
    short: "Rock-and-roll pub with pocket-friendly drinks and music.",
    description:
      "Match Box is a Rock & Roll themed pub in Hauz Khas Village serving pocket-friendly food and drinks with great music. A favourite for casual, budget-friendly nights out in the Village.",
    hours: "12:00 PM – 1:00 AM",
    image: img.bar3,
  },
  {
    slug: "epic-rooftop",
    name: "Epic – The Rooftop",
    category: "bars-nightlife",
    area: "Hauz Khas Village",
    address: "Hauz Khas Village, New Delhi 110016",
    rating: 4.0,
    reviews: 1500,
    price: 3,
    tags: ["Rooftop", "Fine dining", "DJ", "Cocktails"],
    short: "Rooftop resto-bar with fine-dining plates and daily DJs.",
    description:
      "Epic is a restaurant-bar hybrid offering rooftop fine dining, flavourful cocktails and daily live music and DJ nights. A stylish choice for dinner-plus-drinks in Hauz Khas Village.",
    hours: "12:00 PM – 1:00 AM",
    image: img.bar4,
  },

  // ---------------- ART & CULTURE ----------------
  {
    slug: "art-konsult",
    name: "Art Konsult",
    category: "art-galleries",
    area: "Hauz Khas Village",
    address: "A-4, Hauz Khas Village, New Delhi 110016",
    rating: 4.4,
    reviews: 160,
    price: 1,
    tags: ["Contemporary art", "Exhibitions", "Studio"],
    short: "Long-running contemporary art gallery in the Village.",
    description:
      "Art Konsult is one of Hauz Khas Village's established contemporary art galleries, hosting rotating exhibitions of emerging and established Indian artists. A cornerstone of the Village's reputation as an arts district.",
    hours: "11:00 AM – 7:00 PM",
    image: img.art1,
  },
  {
    slug: "the-village-gallery",
    name: "The Village Gallery",
    category: "art-galleries",
    area: "Hauz Khas Village",
    address: "Hauz Khas Village, New Delhi 110016",
    rating: 4.3,
    reviews: 120,
    price: 1,
    tags: ["Art", "Paintings", "Exhibitions"],
    short: "One of the Village's oldest galleries for Indian art.",
    description:
      "The Village Gallery is among the oldest art galleries in Hauz Khas Village, showcasing modern and contemporary Indian paintings and sculpture. It helped shape the Village's identity as a hub for art lovers and collectors.",
    hours: "11:00 AM – 7:00 PM",
    image: img.art2,
  },

  // ---------------- FASHION & BOUTIQUES ----------------
  {
    slug: "ogaan",
    name: "OGAAN",
    category: "boutiques",
    area: "Hauz Khas Village",
    address: "H-2, Hauz Khas Village, New Delhi 110016",
    rating: 4.3,
    reviews: 340,
    price: 4,
    tags: ["Designer", "Multi-brand", "Womenswear", "Slow fashion"],
    short: "Iconic multi-designer boutique for contemporary Indian labels.",
    description:
      "OGAAN is a celebrated multi-designer boutique in Hauz Khas Village stocking contemporary Indian designers and slow-fashion labels. A long-standing anchor of the Village's reputation as the capital of 'ethnic chic'.",
    hours: "11:00 AM – 8:00 PM",
    image: img.shop1,
    featured: true,
  },
  {
    slug: "nappa-dori",
    name: "Nappa Dori",
    category: "boutiques",
    area: "Hauz Khas Village",
    address: "Hauz Khas Village, New Delhi 110016",
    phone: "+91 11 2656 3384",
    phoneVerified: true,
    rating: 4.5,
    reviews: 410,
    price: 4,
    tags: ["Leather goods", "Accessories", "Gifting", "Design"],
    short: "Design-led leather goods, trunks and travel accessories.",
    description:
      "Nappa Dori is a design-forward leather goods label that began in Hauz Khas Village, known for its handcrafted bags, trunks, wallets and travel accessories. A must-visit for design and gifting.",
    hours: "11:00 AM – 8:00 PM",
    image: img.bag1,
  },
  {
    slug: "hauz-khas-social-market-boutiques",
    name: "Kilol – Hand Block Prints",
    category: "boutiques",
    area: "Hauz Khas Village",
    address: "Hauz Khas Village, New Delhi 110016",
    phoneVerified: false,
    rating: 4.2,
    reviews: 150,
    price: 2,
    tags: ["Hand-block print", "Ethnic wear", "Sarees", "Fabric"],
    short: "Traditional hand-block printed clothing and fabrics.",
    description:
      "Kilol brings Rajasthani hand-block printed clothing, sarees and fabrics to Hauz Khas Village, fitting neatly into the area's reputation for handcrafted, ethnic-chic fashion. A good stop for prints and everyday ethnic wear.",
    hours: "11:00 AM – 8:00 PM",
    image: img.shop2,
  },

  // ---------------- SALONS & SPAS ----------------
  {
    slug: "looks-salon-hauz-khas",
    name: "Looks Salon – Hauz Khas",
    category: "salons-spas",
    area: "Hauz Khas Main Market",
    address: "Shop E-43, Near Main Market, Hauz Khas, New Delhi 110016",
    phone: "+91 11 4045 3522",
    phoneVerified: true,
    rating: 4.6,
    reviews: 1075,
    price: 3,
    tags: ["Hair", "Beauty", "Grooming", "Bridal"],
    short: "Full-service unisex salon for hair, beauty and grooming.",
    description:
      "Looks Salon in Hauz Khas Main Market is a highly rated unisex salon offering haircuts, colour, skincare, grooming and bridal services. A reliable, professional pick for everyday beauty needs near Hauz Khas.",
    hours: "10:00 AM – 9:00 PM",
    image: img.salon1,
  },
  {
    slug: "attitude-salon-hauz-khas",
    name: "Attitude Salon",
    category: "salons-spas",
    area: "Hauz Khas",
    address: "D-12, Hauz Khas (Opp. HDFC & Canara Bank), New Delhi 110016",
    phoneVerified: false,
    rating: 3.8,
    reviews: 191,
    price: 2,
    tags: ["Hair", "Beauty", "Unisex"],
    short: "Neighbourhood unisex salon for hair and beauty basics.",
    description:
      "Attitude Salon is a convenient neighbourhood salon in Hauz Khas offering hair, skin and beauty services. Centrally located opposite the main bank row, it's an easy walk-in option for everyday grooming.",
    hours: "10:00 AM – 8:30 PM",
    image: img.salon2,
  },

  // ---------------- GYMS & FITNESS ----------------
  {
    slug: "studio-abhyas",
    name: "Studio Abhyas",
    category: "fitness",
    area: "Hauz Khas Enclave",
    address: "R-17, 1st Floor, Near Shakinaka Restaurant, Hauz Khas Enclave, New Delhi 110016",
    phoneVerified: false,
    rating: 4.5,
    reviews: 210,
    price: 3,
    tags: ["Functional", "Group classes", "Personal training"],
    short: "Boutique fitness studio for functional and group workouts.",
    description:
      "Studio Abhyas is a boutique fitness studio in Hauz Khas Enclave offering functional training, group classes and personal coaching in a focused, community-driven space. A strong alternative to big-box gyms.",
    hours: "6:00 AM – 10:00 PM",
    image: img.gym1,
  },
  {
    slug: "anytime-fitness-sda",
    name: "Anytime Fitness – SDA",
    category: "fitness",
    area: "SDA Market",
    address: "SDA Market, Hauz Khas, New Delhi 110016",
    phoneVerified: false,
    rating: 4.2,
    reviews: 460,
    price: 3,
    tags: ["24x7", "Strength", "Cardio", "Membership"],
    short: "24x7 strength-and-cardio gym near IIT Delhi.",
    description:
      "Anytime Fitness at SDA Market offers round-the-clock access to strength and cardio equipment with trained staff, popular with students and professionals near IIT Delhi and Hauz Khas Enclave.",
    hours: "Open 24 hours",
    image: img.gym2,
  },
  {
    slug: "yoga-studio-hauz-khas",
    name: "The Yoga Studio – Hauz Khas",
    category: "fitness",
    area: "Hauz Khas Enclave",
    address: "Hauz Khas Enclave, New Delhi 110016",
    phoneVerified: false,
    rating: 4.4,
    reviews: 180,
    price: 2,
    tags: ["Yoga", "Pilates", "Meditation", "Wellness"],
    short: "Calm studio for yoga, pilates and guided meditation.",
    description:
      "The Yoga Studio in Hauz Khas Enclave runs yoga, pilates and meditation classes for all levels in a quiet, dedicated space — a mindful counterpoint to the area's busier gyms.",
    hours: "6:00 AM – 8:00 PM",
    image: img.yoga1,
  },

  // ---------------- COWORKING ----------------
  {
    slug: "myhq-sda",
    name: "myHQ Coworking – SDA",
    category: "coworking",
    area: "SDA Market",
    address: "C-21, First Floor, SDA Market, Opp. IIT Delhi Main Gate, Hauz Khas Enclave, New Delhi 110016",
    phoneVerified: false,
    rating: 4.3,
    reviews: 520,
    price: 2,
    tags: ["Hot desk", "Café-office", "Wi-Fi", "Near IIT"],
    short: "Flexible café-office hot desks opposite IIT Delhi.",
    description:
      "myHQ at SDA Market offers flexible coworking hot desks with redeemable café credits, right opposite IIT Delhi's main gate. An affordable, well-connected option for students, freelancers and small teams around Hauz Khas.",
    hours: "9:00 AM – 9:00 PM",
    image: img.cowork1,
    featured: true,
  },
  {
    slug: "cowork-pad-kharera",
    name: "Cowork Pad – Kharera",
    category: "coworking",
    area: "Hauz Khas Main Market",
    address: "E-25/A, Near ICICI Bank, Main Market, Kharera, Hauz Khas, New Delhi 110016",
    phoneVerified: false,
    rating: 4.2,
    reviews: 140,
    price: 2,
    tags: ["Private cabins", "Dedicated desks", "Meeting room"],
    short: "Private cabins, dedicated desks and hot desks near the market.",
    description:
      "Cowork Pad in Kharera (Hauz Khas Main Market) provides private offices, dedicated desks and hot desks with meeting-room access — a practical, central workspace for teams that want a fixed base near Hauz Khas.",
    hours: "9:00 AM – 8:00 PM",
    image: img.cowork2,
  },
  {
    slug: "social-offline-hauz-khas",
    name: "Social Offline – Hauz Khas",
    category: "coworking",
    area: "Hauz Khas Village",
    address: "Hauz Khas Village (edge of Deer Park), New Delhi 110016",
    phoneVerified: false,
    rating: 4.4,
    reviews: 800,
    price: 2,
    tags: ["Café-office", "Wi-Fi", "Lake view", "Work + food"],
    short: "Work-friendly café by day over the Hauz Khas lake.",
    description:
      "Social Offline at Hauz Khas doubles as a café-office by day, letting members put their membership toward food and drinks while working with a view of the lake. A lively alternative to a traditional coworking floor.",
    hours: "11:00 AM – 12:00 AM",
    image: img.cowork3,
  },

  // ---------------- HEALTH ----------------
  {
    slug: "healing-touch-hospital",
    name: "Healing Touch Hospital",
    category: "health",
    area: "Hauz Khas",
    address: "Hauz Khas, New Delhi 110016",
    phoneVerified: false,
    rating: 4.0,
    reviews: 260,
    price: 2,
    tags: ["Hospital", "Multi-speciality", "Emergency"],
    short: "Neighbourhood multi-speciality hospital.",
    description:
      "Healing Touch Hospital is a multi-speciality healthcare facility serving the Hauz Khas neighbourhood, offering consultations, diagnostics and inpatient care close to home.",
    hours: "Open 24 hours",
    image: img.health1,
  },
  {
    slug: "max-multi-speciality-panchsheel",
    name: "Max Multi Speciality Centre",
    category: "health",
    area: "Panchsheel Park",
    address: "Panchsheel Park, near Hauz Khas, New Delhi 110017",
    phoneVerified: false,
    rating: 4.1,
    reviews: 640,
    price: 3,
    tags: ["Multi-speciality", "Diagnostics", "OPD"],
    short: "Trusted multi-speciality OPD and diagnostics centre.",
    description:
      "Max Multi Speciality Centre near Hauz Khas provides OPD consultations across specialities plus diagnostics, backed by the Max Healthcare network — a dependable everyday healthcare option for the neighbourhood.",
    hours: "8:00 AM – 8:00 PM",
    image: img.health2,
  },
  {
    slug: "apollo-pharmacy-hauz-khas",
    name: "Apollo Pharmacy – Hauz Khas",
    category: "health",
    area: "Hauz Khas",
    address: "Main Market, Hauz Khas, New Delhi 110016",
    phoneVerified: false,
    rating: 4.2,
    reviews: 380,
    price: 1,
    tags: ["Pharmacy", "Medicines", "24x7", "Essentials"],
    short: "Well-stocked pharmacy for medicines and health essentials.",
    description:
      "Apollo Pharmacy in Hauz Khas stocks prescription medicines, wellness products and everyday health essentials, with home delivery in the neighbourhood — a convenient chemist near the main market.",
    hours: "8:00 AM – 11:00 PM",
    image: img.pharma1,
  },

  // ---------------- BOOKS & LIFESTYLE ----------------
  {
    slug: "midland-book-shop",
    name: "Midland Book Shop",
    category: "shopping",
    area: "Aurobindo Place",
    address: "Shop No. 20, Aurobindo Place Market, Hauz Khas, New Delhi 110016",
    phone: "+91 98182 82497",
    phoneVerified: true,
    rating: 4.5,
    reviews: 900,
    price: 2,
    tags: ["Books", "Bestsellers", "Fiction", "Academic"],
    short: "Beloved independent bookshop in Aurobindo Place.",
    description:
      "Midland Book Shop is a much-loved independent bookstore in Aurobindo Place Market near Hauz Khas, stocking fiction, non-fiction, academic titles and bestsellers with knowledgeable staff. A favourite of Delhi's readers.",
    hours: "10:30 AM – 8:00 PM",
    image: img.books1,
    featured: true,
  },
  {
    slug: "sda-market-lifestyle-stores",
    name: "SDA Market Lifestyle Stores",
    category: "shopping",
    area: "SDA Market",
    address: "Safdarjung Development Area (SDA) Market, Hauz Khas, New Delhi 110016",
    phoneVerified: false,
    rating: 4.2,
    reviews: 300,
    price: 2,
    tags: ["Stationery", "Gifts", "Home", "Essentials"],
    short: "Bookshops, stationery and eclectic lifestyle stores.",
    description:
      "SDA Market near IIT Delhi is a local favourite for bookstores, stationery, salons, gyms and eclectic lifestyle stores, alongside cafés and street food — a compact, everyday counterpoint to touristy Hauz Khas Village.",
    hours: "10:00 AM - 9:00 PM",
    image: img.books2,
  },

  // ================= EXPANSION: more real Hauz Khas listings =================
  // ---- Cafés ----
  { slug: "blue-tokai-coffee-roasters", name: "Blue Tokai Coffee Roasters", category: "cafes", area: "SDA Market", address: "SDA Market, near IIT Delhi, Hauz Khas, New Delhi 110016", phone: "+91 93190 93997", phoneVerified: true, rating: 4.5, reviews: 1800, price: 2, tags: ["Specialty coffee", "Roastery", "Filter", "Work-friendly"], short: "Third-wave specialty coffee from a beloved Indian roaster.", description: "Blue Tokai Coffee Roasters brings single-origin, freshly roasted Indian coffee to the SDA Market near IIT Delhi, with a calm, work-friendly space popular with students and professionals around Hauz Khas.", hours: "8:30 AM - 10:00 PM", image: img.cafe5 },
  { slug: "elmas-bakery-kitchen", name: "Elma's Bakery & Kitchen", category: "cafes", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.3, reviews: 2200, price: 3, tags: ["Bakery", "English tea room", "Desserts", "Instagrammable"], short: "Whimsical English-cottage tea room and bakery.", description: "Elma's is a fairytale English-cottage café in Hauz Khas Village famous for its cakes, tarts and all-day breakfast in a floral, vintage setting. A perennial favourite for a slow, pretty brunch.", hours: "10:00 AM - 11:00 PM", image: img.cafe6 },
  { slug: "kunzum-cafe", name: "Kunzum Café", category: "cafes", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phone: "+91 11 2651 3949", phoneVerified: true, rating: 4.2, reviews: 300, price: 1, tags: ["Books", "Coffee", "Community", "Pay-as-you-like"], short: "Travel café and bookstore with a community soul.", description: "Kunzum is a book-lined café in Hauz Khas that blends good coffee, a curated bookshop and regular community events, a quiet counterpoint to the Village's louder venues.", hours: "11:00 AM - 8:00 PM", image: img.cafe1 },
  { slug: "cafe-small-talk", name: "Café Small Talk", category: "cafes", area: "Hauz Khas Village", address: "14, First Floor, Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.1, reviews: 650, price: 2, tags: ["Cozy", "Value", "Coffee", "Continental"], short: "Cozy, value-for-money café tucked in the Village lanes.", description: "Café Small Talk is a snug, affordable café in Hauz Khas Village with warm interiors and a wide all-day menu, a reliable spot for a relaxed coffee or bite while exploring.", hours: "12:00 PM - 11:00 PM", image: img.cafe2 },

  // ---- Restaurants ----
  { slug: "amour-hauz-khas", name: "Amour Bistro", category: "restaurants", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 3800, price: 3, tags: ["European", "Rooftop", "Instagrammable", "Brunch"], short: "Dreamy pastel rooftop bistro with European plates.", description: "Amour is a pastel-and-florals rooftop bistro in Hauz Khas Village serving European and continental food, one of the most photographed brunch spots in the Village.", hours: "12:00 PM - 1:00 AM", image: img.food4 },
  { slug: "imperfecto-hauz-khas", name: "Imperfecto", category: "restaurants", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phone: "+91 96430 02717", phoneVerified: true, rating: 4.2, reviews: 5200, price: 3, tags: ["Mediterranean", "Rooftop", "Cocktails", "Live music"], short: "Mediterranean rooftop restaurant-bar with a lush vibe.", description: "Imperfecto brings Mediterranean and Spanish-inspired food, cocktails and live music to a leafy Hauz Khas Village rooftop, a dependable pick for a long, lively meal.", hours: "12:00 PM - 1:00 AM", image: img.food5 },
  { slug: "the-living-room-cafe", name: "The Living Room Café (TLR)", category: "restaurants", area: "Hauz Khas Village", address: "31, First Floor, Hauz Khas Village, New Delhi 110016", phone: "+91 11 4608 0533", phoneVerified: true, rating: 4.1, reviews: 4100, price: 3, tags: ["Cafe-bar", "Live gigs", "Continental", "Lake view"], short: "Iconic café-bar known for live gigs and lake views.", description: "TLR is a long-running Hauz Khas Village café-bar famous for its live music nights, easy continental menu and views over the lake, a Village institution.", hours: "12:00 PM - 1:00 AM", image: img.food1 },
  { slug: "diablo-hauz-khas", name: "Diablo", category: "restaurants", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.0, reviews: 1600, price: 3, tags: ["Global", "Rooftop", "DJ", "Party"], short: "High-energy rooftop restaurant-club.", description: "Diablo is a rooftop restaurant-and-club in Hauz Khas Village pairing a global menu with late-night DJs, popular for group nights out.", hours: "12:00 PM - 1:00 AM", image: img.food2 },
  { slug: "auro-kitchen-bar", name: "Auro Kitchen & Bar", category: "restaurants", area: "Aurobindo Place", address: "Aurobindo Place Market, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.3, reviews: 2400, price: 4, tags: ["Modern Indian", "Cocktails", "Rooftop", "Date night"], short: "Polished modern-Indian dining and cocktails.", description: "Auro Kitchen & Bar at Aurobindo Place offers a refined modern-Indian menu and craft cocktails on a smart rooftop, a step up for special dinners near Hauz Khas.", hours: "12:00 PM - 12:30 AM", image: img.food3 },

  // ---- Bars & Nightlife ----
  { slug: "moonshine-cafe-bar", name: "Moonshine Café & Bar", category: "bars-nightlife", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.1, reviews: 3000, price: 3, tags: ["Rooftop", "Cocktails", "Live music", "Lake view"], short: "Laid-back rooftop bar over the lake.", description: "Moonshine is a relaxed rooftop café-bar in Hauz Khas Village with cocktails, comfort food and lake views, a good first stop before a night out.", hours: "12:00 PM - 1:00 AM", image: img.bar5 },
  { slug: "out-of-the-box-hauz-khas", name: "Out of the Box", category: "bars-nightlife", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.0, reviews: 4600, price: 2, tags: ["Resto-bar", "Quirky", "Value", "Cocktails"], short: "Quirky, pocket-friendly resto-bar chain favourite.", description: "Out of the Box (OTB) is a fun, value-for-money resto-bar in Hauz Khas Village with a playful menu and easy drinks, a student and group favourite.", hours: "12:00 PM - 1:00 AM", image: img.bar6 },
  { slug: "prison-hauz-khas", name: "Prison", category: "bars-nightlife", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 3.9, reviews: 1500, price: 2, tags: ["Themed", "Pub", "Music", "Budget"], short: "Jail-themed pub with pocket-friendly nights.", description: "Prison is a novelty jail-themed pub in Hauz Khas Village with cell-style seating, loud music and affordable drinks, one of the Village's classic party spots.", hours: "12:00 PM - 1:00 AM", image: img.bar1 },
  { slug: "xes-cafe-hauz-khas", name: "XES Café", category: "bars-nightlife", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.0, reviews: 2100, price: 2, tags: ["Cafe-bar", "Rooftop", "Casual", "Music"], short: "Casual rooftop café-bar for easy evenings.", description: "XES is a casual, long-standing café-bar in Hauz Khas Village with rooftop seating and an all-day-into-night menu, popular for unfussy hangouts.", hours: "12:00 PM - 1:00 AM", image: img.bar2 },
  { slug: "cafe-public-connection", name: "Café Public Connection", category: "bars-nightlife", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 3.9, reviews: 1900, price: 2, tags: ["Rooftop", "Pub", "Budget", "Music"], short: "Budget rooftop pub with Village views.", description: "Café Public Connection is a value rooftop pub in Hauz Khas Village serving drinks and bar food with a lively crowd and open-air seating.", hours: "12:00 PM - 1:00 AM", image: img.bar3 },

  // ---- Art & Culture / Heritage ----
  { slug: "hauz-khas-fort-madrasa", name: "Hauz Khas Fort & Madrasa", category: "art-galleries", area: "Hauz Khas Village", address: "Hauz Khas Complex, Deer Park, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.5, reviews: 41000, price: 1, tags: ["Heritage", "14th century", "Lake", "Monument"], short: "The 14th-century royal tank, tomb and madrasa.", description: "The Hauz Khas Complex is the neighbourhood's namesake: Alauddin Khilji's royal reservoir, Firuz Shah Tughlaq's tomb and one of the Delhi Sultanate's greatest madrasas, overlooking the historic lake. Open 10 AM to 6 PM.", hours: "10:00 AM - 6:00 PM", image: img.heritage1 },
  { slug: "deer-park-hauz-khas", name: "Deer Park (A.N. Jha Deer Park)", category: "art-galleries", area: "Hauz Khas", address: "Deer Park, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.4, reviews: 15000, price: 1, tags: ["Park", "Nature", "Deer", "Walks"], short: "Lush landscaped park with spotted deer and birdlife.", description: "The Deer Park at the entrance to the Hauz Khas tank is a green expanse home to spotted deer, peacocks and rabbits, a favourite for morning walks and picnics beside the monuments.", hours: "5:00 AM - 7:00 PM", image: img.art3 },
  { slug: "the-indian-popular-art", name: "The Indian Popular Art", category: "art-galleries", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.3, reviews: 90, price: 1, tags: ["Gallery", "Folk art", "Prints", "Collectibles"], short: "Gallery-store for Indian folk and popular art.", description: "The Indian Popular Art in Hauz Khas Village showcases and sells Indian folk, tribal and popular art, prints and collectibles, adding to the Village's arts-district character.", hours: "11:00 AM - 7:30 PM", image: img.art4 },
  { slug: "dadi-poti-ka-gumbad", name: "Dadi-Poti ka Gumbad", category: "art-galleries", area: "Hauz Khas Enclave", address: "Green Park / Hauz Khas Enclave, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 400, price: 1, tags: ["Heritage", "Tombs", "Architecture", "Hidden"], short: "Twin medieval tombs tucked near the Enclave.", description: "Dadi-Poti ka Gumbad are two striking medieval tombs near Hauz Khas Enclave, a quiet slice of Delhi Sultanate architecture away from the crowds.", hours: "Open sunrise to sunset", image: img.art1 },

  // ---- Fashion & Boutiques ----
  { slug: "bodice-hauz-khas", name: "Bodice", category: "boutiques", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.4, reviews: 120, price: 4, tags: ["Designer", "Contemporary", "Womenswear", "Award-winning"], short: "Award-winning contemporary Indian fashion label.", description: "Bodice, by designer Ruchika Sachdeva, is a celebrated contemporary womenswear label with a refined Hauz Khas presence, known for clean, considered design.", hours: "11:00 AM - 8:00 PM", image: img.shop1 },
  { slug: "shivan-and-narresh", name: "Shivan & Narresh", category: "boutiques", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.3, reviews: 95, price: 4, tags: ["Luxury", "Resort wear", "Swimwear", "Couture"], short: "Luxury resort-wear and couture atelier.", description: "Shivan & Narresh is a luxury Indian label known for holiday couture and swimwear, bringing high-fashion glamour to the Hauz Khas design scene.", hours: "11:00 AM - 8:00 PM", image: img.shop2 },
  { slug: "ole-couture", name: "Ole Couture", category: "boutiques", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 80, price: 3, tags: ["Bridal", "Occasion wear", "Custom", "Ethnic"], short: "Occasion and bridal wear atelier.", description: "Ole Couture is a Hauz Khas atelier specialising in occasion and bridal wear with custom tailoring, part of the Village's dense cluster of independent designers.", hours: "11:00 AM - 8:00 PM", image: img.bag1 },
  { slug: "mise-a-jour", name: "Mise À Jour", category: "boutiques", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 60, price: 4, tags: ["Designer", "Womenswear", "Contemporary"], short: "Contemporary designer womenswear boutique.", description: "Mise À Jour offers contemporary designer womenswear in Hauz Khas Village, one of many independent labels that give the area its ethnic-chic reputation.", hours: "11:00 AM - 8:00 PM", image: img.shop1 },
  { slug: "dozakh-hauz-khas", name: "Dozakh", category: "boutiques", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.1, reviews: 55, price: 3, tags: ["Slow fashion", "Craft", "Unisex", "Sustainable"], short: "Craft-led slow-fashion concept label.", description: "Dozakh is a craft-driven, slow-fashion label in Hauz Khas Village working with Indian textiles and hand techniques for a distinctive, sustainable wardrobe.", hours: "11:00 AM - 8:00 PM", image: img.shop2 },
  { slug: "ish-om-hauz-khas", name: "Ish Om", category: "boutiques", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.0, reviews: 40, price: 3, tags: ["Boutique", "Ethnic", "Accessories"], short: "Independent ethnic-wear and accessories boutique.", description: "Ish Om is an independent Hauz Khas Village boutique offering ethnic wear and accessories, typical of the Village's owner-run design stores.", hours: "11:00 AM - 8:00 PM", image: img.bag1 },
  { slug: "ricco-hauz-khas", name: "Ricco", category: "boutiques", area: "Hauz Khas Village", address: "Hauz Khas Village, New Delhi 110016", phoneVerified: false, rating: 4.1, reviews: 70, price: 3, tags: ["Menswear", "Bespoke", "Tailoring"], short: "Menswear and bespoke tailoring studio.", description: "Ricco is a Hauz Khas Village menswear and bespoke tailoring studio, rounding out the Village's mix of womenswear labels with sharp made-to-measure options.", hours: "11:00 AM - 8:00 PM", image: img.shop1 },

  // ---- Salons & Spas ----
  { slug: "euphoria-wellness-spa", name: "Euphoria Wellness Spa", category: "salons-spas", area: "SDA Market", address: "1st Floor, C-8, SDA Market, above Subway, Hauz Khas Enclave, New Delhi 110016", phoneVerified: false, rating: 4.3, reviews: 520, price: 3, tags: ["Spa", "Massage", "Wellness", "Couple therapy"], short: "Relaxing wellness spa above SDA Market.", description: "Euphoria Wellness Spa at SDA Market offers a full menu of massages and therapies near IIT Delhi, a convenient reset close to Hauz Khas Enclave.", hours: "10:00 AM - 9:00 PM", image: img.salon3 },
  { slug: "rainbow-spa-hauz-khas", name: "Rainbow Spa", category: "salons-spas", area: "SDA Market", address: "C-7, SDA Market, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.1, reviews: 380, price: 3, tags: ["Spa", "Thai massage", "Aroma", "Relaxation"], short: "Thai-style spa near IIT Delhi.", description: "Rainbow Spa in SDA Market provides Thai and aroma massages in a calm setting, a popular unwind spot for the Hauz Khas and Green Park crowd.", hours: "10:00 AM - 9:30 PM", image: img.salon4 },
  { slug: "lorenzo-spa-hauz-khas", name: "Lorenzo Spa", category: "salons-spas", area: "SDA Market", address: "SDA Community Centre, opposite IIT Gate Market, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 410, price: 3, tags: ["Spa", "Deep tissue", "Wellness"], short: "Well-reviewed spa opposite the IIT gate market.", description: "Lorenzo Spa sits opposite the IIT Delhi gate market near Hauz Khas, offering deep-tissue and relaxation therapies for students and professionals nearby.", hours: "10:00 AM - 9:00 PM", image: img.salon3 },
  { slug: "jawed-habib-hauz-khas", name: "Jawed Habib Hair & Beauty", category: "salons-spas", area: "Hauz Khas", address: "Main Market, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.0, reviews: 300, price: 2, tags: ["Hair", "Unisex", "Grooming", "Chain"], short: "Trusted unisex hair and beauty salon chain.", description: "Jawed Habib in Hauz Khas offers dependable haircuts, colour and grooming from the well-known national salon chain, a reliable everyday option near the market.", hours: "10:00 AM - 8:00 PM", image: img.salon4 },
  { slug: "geetanjali-salon-hauz-khas", name: "Geetanjali Salon", category: "salons-spas", area: "Hauz Khas", address: "Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.0, reviews: 260, price: 3, tags: ["Beauty", "Bridal", "Skincare", "Unisex"], short: "Full-service beauty and bridal salon.", description: "Geetanjali Salon provides skincare, beauty and bridal services near Hauz Khas from a long-established salon brand, popular for occasion grooming.", hours: "10:00 AM - 8:00 PM", image: img.salon3 },

  // ---- Gyms & Fitness ----
  { slug: "cult-fit-hauz-khas", name: "cult.fit — Hauz Khas", category: "fitness", area: "Green Park", address: "Green Park, near Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.3, reviews: 900, price: 3, tags: ["Group classes", "S&C", "HRX", "Yoga"], short: "Group-workout studio near Hauz Khas.", description: "cult.fit near Hauz Khas runs energetic group workouts, from strength and HRX to yoga and dance fitness, a modern alternative to a traditional gym.", hours: "6:00 AM - 10:00 PM", image: img.gym1 },
  { slug: "golds-gym-green-park", name: "Gold's Gym — Green Park", category: "fitness", area: "Green Park", address: "Green Park, near Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.1, reviews: 700, price: 3, tags: ["Gym", "Strength", "Cardio", "PT"], short: "Full-scale gym with strength and cardio floors.", description: "Gold's Gym near Green Park and Hauz Khas offers a full equipment floor, personal training and classes for members across South Delhi.", hours: "6:00 AM - 10:30 PM", image: img.gym2 },
  { slug: "zorba-yoga-hauz-khas", name: "Zorba - A Renaissance Yoga Studio", category: "fitness", area: "Hauz Khas Enclave", address: "Hauz Khas Enclave, New Delhi 110016", phoneVerified: false, rating: 4.4, reviews: 210, price: 2, tags: ["Yoga", "Meditation", "Breathwork", "Wellness"], short: "Calm studio for yoga and meditation.", description: "Zorba offers yoga, meditation and breathwork in a serene Hauz Khas Enclave studio, a mindful option among the area's fitness choices.", hours: "6:00 AM - 8:00 PM", image: img.yoga1 },
  { slug: "sarva-yoga-hauz-khas", name: "Sarva Yoga Studio", category: "fitness", area: "Hauz Khas", address: "Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 150, price: 2, tags: ["Yoga", "Pilates", "Wellness", "Beginners"], short: "Guided yoga and pilates for all levels.", description: "Sarva runs guided yoga and pilates sessions near Hauz Khas suitable for beginners and regulars alike, part of the neighbourhood's growing wellness scene.", hours: "6:00 AM - 8:30 PM", image: img.yoga2 },
  { slug: "the-fitness-project-sda", name: "The Fitness Project", category: "fitness", area: "SDA Market", address: "SDA Market, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 180, price: 3, tags: ["Functional", "Strength", "Personal training"], short: "Boutique functional-training gym near IIT Delhi.", description: "The Fitness Project at SDA Market focuses on functional and strength training with coaching, a compact studio popular with the IIT Delhi and Hauz Khas crowd.", hours: "6:00 AM - 10:00 PM", image: img.gym3 },

  // ---- Coworking & Study ----
  { slug: "91springboard-south-delhi", name: "91springboard — South Delhi", category: "coworking", area: "Hauz Khas / Saidulajab", address: "Near Hauz Khas / Saidulajab, New Delhi 110030", phoneVerified: false, rating: 4.2, reviews: 340, price: 3, tags: ["Coworking", "Community", "Private cabins", "Events"], short: "Community-led coworking hub in South Delhi.", description: "91springboard's South Delhi hub near Hauz Khas offers hot desks, private cabins and a strong startup community with regular events and networking.", hours: "9:00 AM - 8:00 PM", image: img.cowork1 },
  { slug: "altf-coworking-hauz-khas", name: "AltF Coworking", category: "coworking", area: "Hauz Khas", address: "Hauz Khas / Green Park, New Delhi 110016", phoneVerified: false, rating: 4.1, reviews: 220, price: 3, tags: ["Managed office", "Private cabins", "Meeting rooms"], short: "Managed private offices and desks.", description: "AltF Coworking provides managed private offices, dedicated desks and meeting rooms near Hauz Khas, a fit for small teams wanting a plug-and-play workspace.", hours: "9:00 AM - 8:00 PM", image: img.cowork2 },
  { slug: "innov8-hauz-khas", name: "Innov8 Coworking", category: "coworking", area: "Hauz Khas", address: "Near Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 260, price: 3, tags: ["Coworking", "Design-led", "Cafe", "Events"], short: "Design-led coworking with a café vibe.", description: "Innov8 offers design-forward coworking with in-house cafés and events near Hauz Khas, popular with freelancers and growing teams.", hours: "9:00 AM - 8:00 PM", image: img.cowork3 },
  { slug: "the-circle-work-hauz-khas", name: "The Circle Work", category: "coworking", area: "Hauz Khas", address: "Near Hauz Khas / Saket, New Delhi 110017", phoneVerified: false, rating: 4.1, reviews: 140, price: 2, tags: ["Coworking", "Hot desk", "Quiet", "Budget"], short: "Value coworking with quiet focus spaces.", description: "The Circle Work provides affordable hot desks and quiet focus areas near Hauz Khas, a practical base for students and solo professionals.", hours: "9:00 AM - 9:00 PM", image: img.cowork4 },

  // ---- Clinics & Pharmacies ----
  { slug: "dr-dangs-lab-hauz-khas", name: "Dr. Dangs Lab", category: "health", area: "Hauz Khas", address: "Block A, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.4, reviews: 1200, price: 3, tags: ["Diagnostics", "Pathology", "Trusted", "Home collection"], short: "Renowned diagnostics and pathology lab.", description: "Dr. Dangs Lab in Hauz Khas is one of Delhi's most trusted diagnostic and pathology labs, offering a wide test menu and home sample collection.", hours: "7:00 AM - 7:00 PM", image: img.health3 },
  { slug: "dr-lal-pathlabs-hauz-khas", name: "Dr. Lal PathLabs", category: "health", area: "Aurobindo Marg", address: "Sri Aurobindo Marg, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 800, price: 2, tags: ["Diagnostics", "Blood tests", "Chain", "Home collection"], short: "Well-known diagnostics chain for tests and checkups.", description: "Dr. Lal PathLabs near Hauz Khas offers reliable diagnostic tests and health checkups from a national pathology network, with home collection available.", hours: "7:00 AM - 8:00 PM", image: img.health4 },
  { slug: "dental-house-hauz-khas", name: "Dental House", category: "health", area: "Hauz Khas Enclave", address: "Hauz Khas Enclave, New Delhi 110016", phoneVerified: false, rating: 4.5, reviews: 320, price: 2, tags: ["Dentist", "Orthodontics", "Implants", "Whitening"], short: "Modern dental clinic for the neighbourhood.", description: "Dental House in Hauz Khas Enclave provides general and cosmetic dentistry, orthodontics and implants in a modern, well-reviewed clinic.", hours: "10:00 AM - 8:00 PM", image: img.health1 },
  { slug: "south-delhi-dental-centre", name: "South Delhi Dental & Orthodontic Centre", category: "health", area: "Hauz Khas", address: "Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.3, reviews: 240, price: 2, tags: ["Dentist", "Braces", "Root canal", "Family"], short: "Family dental and orthodontic clinic.", description: "South Delhi Dental & Orthodontic Centre offers family dentistry, braces and root-canal treatment near Hauz Khas, a handy local option for oral care.", hours: "10:00 AM - 8:00 PM", image: img.health2 },
  { slug: "aura-skin-clinic-hauz-khas", name: "Aura Skin & Hair Clinic", category: "health", area: "Hauz Khas", address: "Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.1, reviews: 190, price: 3, tags: ["Dermatology", "Skin", "Hair", "Cosmetology"], short: "Dermatology and cosmetology clinic.", description: "Aura Skin & Hair Clinic near Hauz Khas offers dermatology, skin and hair treatments and cosmetology, rounding out the area's everyday healthcare options.", hours: "10:00 AM - 7:00 PM", image: img.pharma1 },

  // ---- Books & Lifestyle ----
  { slug: "fabindia-green-park", name: "Fabindia — Green Park", category: "shopping", area: "Green Park", address: "Green Park Main Market, near Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.3, reviews: 900, price: 3, tags: ["Ethnic wear", "Home", "Handloom", "Gifting"], short: "Handloom clothing, home and gifting.", description: "Fabindia at Green Park near Hauz Khas stocks handloom clothing, home furnishings and organic products, a go-to for ethnic wear and gifting.", hours: "10:30 AM - 8:30 PM", image: img.shop3 },
  { slug: "aurobindo-place-market", name: "Aurobindo Place Market", category: "shopping", area: "Aurobindo Place", address: "Aurobindo Place Market, Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 500, price: 2, tags: ["Market", "Bookshops", "Everyday", "Eateries"], short: "Everyday market for books, food and essentials.", description: "Aurobindo Place Market near Hauz Khas is a local hub of bookshops, eateries and everyday stores, anchored by favourites like Midland Book Shop.", hours: "10:00 AM - 9:00 PM", image: img.shop4 },
  { slug: "green-park-main-market", name: "Green Park Main Market", category: "shopping", area: "Green Park", address: "Green Park Main Market, near Hauz Khas, New Delhi 110016", phoneVerified: false, rating: 4.2, reviews: 650, price: 2, tags: ["Market", "Shopping", "Food", "Essentials"], short: "Bustling neighbourhood market next to Hauz Khas.", description: "Green Park Main Market, a short hop from Hauz Khas, packs in clothing, lifestyle and grocery stores plus popular eateries, a everyday-shopping mainstay.", hours: "10:00 AM - 9:00 PM", image: img.books3 },
];


const reviews = [
  {
    name: "Ananya R.",
    place: "hauz-khas-social",
    rating: 5,
    text: "The rooftop view of the lake at sunset is unbeatable. Discover Hauz Khas helped me find the exact table-with-a-view I wanted.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=70",
  },
  {
    name: "Rohan M.",
    place: "myhq-sda",
    rating: 5,
    text: "Found an affordable coworking hot desk opposite IIT Delhi in ten minutes. Exactly what a local directory should do.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70",
  },
  {
    name: "Sneha K.",
    place: "coast-cafe",
    rating: 4,
    text: "Every café listing has the vibe, price and timings upfront. Coast Café was just as calm and pretty as described.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=70",
  },
];


const blogPosts = [
  {
    slug: "best-cafes-in-hauz-khas-village",
    title: "The Best Cafés in Hauz Khas Village (2026 Guide)",
    excerpt:
      "From aromatherapy tea rooms to plant-filled rooftops, here are the Hauz Khas cafés worth planning a morning around.",
    metaDescription:
      "A local's guide to the best cafés in Hauz Khas Village in 2026 — coffee, tea rooms, rooftops and café-offices, with addresses, timings and what to order.",
    date: "2026-07-20",
    readMins: 5,
    category: "Cafés",
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=70",
    relatedCategory: "cafes",
    body: [
      { type: "p", text: "Hauz Khas Village is one of Delhi's most café-dense neighbourhoods, packing tea rooms, coffee bars and rooftop hangouts into a few winding lanes. This guide rounds up the spots locals actually return to — sorted by vibe, budget and timings." },
      { type: "h2", text: "For a calm, aromatic morning" },
      { type: "p", text: "The Tea Room by Blossom Kochhar leads the calm-café category with its aromatherapy-led menu and soft interiors. Pair it with a slow breakfast and you have the gentlest possible start in the Village." },
      { type: "h2", text: "For the Instagram-worthy brunch" },
      { type: "p", text: "Coast Café's all-white, plant-filled rooms and coastal plates make it the most photographed café in Hauz Khas Village. Head to the upper floors for the best light and a view over the lanes." },
      { type: "h2", text: "For working with a coffee" },
      { type: "p", text: "If you need Wi-Fi and a table for a few hours, the café-offices at Hauz Khas Social and Social Offline let you work by day and stay for the evening. See our full list of café-offices and coworking spaces in Hauz Khas." },
    ],
  },
  {
    slug: "hauz-khas-nightlife-guide",
    title: "Hauz Khas Nightlife: Best Bars, Pubs & Rooftops",
    excerpt:
      "Rooftop cocktails over the lake, reggae bars and pocket-friendly pubs — how to plan a night out in Hauz Khas Village.",
    metaDescription:
      "The best bars, pubs and rooftop lounges in Hauz Khas Village, New Delhi — lake views, live music, cocktails and budget picks. A 2026 nightlife guide.",
    date: "2026-07-18",
    readMins: 6,
    category: "Nightlife",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=70",
    relatedCategory: "bars-nightlife",
    body: [
      { type: "p", text: "Few Delhi neighbourhoods do nightlife quite like Hauz Khas Village — bars stack up floor over floor, many with rooftops that look straight onto the 14th-century lake and monument. Here's how to plan the night." },
      { type: "h2", text: "Start on a rooftop" },
      { type: "p", text: "Hauz Khas Social is the anchor: a multi-level brasserie-bar whose rooftop frames the lake and monument. Get there before sunset for the view, then let the music build." },
      { type: "h2", text: "Keep it colourful" },
      { type: "p", text: "Raasta brings Caribbean-reggae energy and murals; Match Box leans rock-and-roll and pocket-friendly. Between them you can swing from a laid-back pint to a full dance floor without leaving the lane." },
      { type: "h2", text: "Dinner-plus-drinks" },
      { type: "p", text: "For food that keeps pace with the cocktails, Epic – The Rooftop pairs fine-dining plates with daily DJs. Browse every option on our bars & nightlife page before you head out." },
    ],
  },
  {
    slug: "coworking-spaces-in-hauz-khas",
    title: "Where to Work in Hauz Khas: Coworking & Café-Offices",
    excerpt:
      "Hot desks opposite IIT Delhi, private cabins near the market and lake-view café-offices — the best places to get work done in Hauz Khas.",
    metaDescription:
      "The best coworking spaces and café-offices in Hauz Khas & SDA Market, New Delhi — hot desks near IIT Delhi, private cabins and Wi-Fi café-offices compared.",
    date: "2026-07-15",
    readMins: 4,
    category: "Work",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=70",
    relatedCategory: "coworking",
    body: [
      { type: "p", text: "With IIT Delhi next door and a constant flow of students and founders, Hauz Khas has quietly become one of South Delhi's best places to work flexibly. Here are the options, from cheapest to most social." },
      { type: "h2", text: "Cheapest hot desks" },
      { type: "p", text: "myHQ at SDA Market sits opposite IIT Delhi's main gate and offers day passes with café credits — ideal for students and freelancers who want a low-commitment desk." },
      { type: "h2", text: "A fixed base for a small team" },
      { type: "p", text: "Cowork Pad in Kharera offers private cabins and dedicated desks with meeting-room access, a better fit if your team needs to leave a monitor behind each night." },
      { type: "h2", text: "Work with a view" },
      { type: "p", text: "Prefer buzz over silence? Social Offline lets you work over the lake and put your spend toward food and coffee. Compare all three on our coworking & study page." },
    ],
  },
  {
    slug: "things-to-do-in-hauz-khas",
    title: "Things to Do in Hauz Khas: Village, Lake & Market",
    excerpt:
      "History, art, shopping and food in one afternoon — a local's route through Hauz Khas Village, the lake ruins and the surrounding markets.",
    metaDescription:
      "Things to do in Hauz Khas, New Delhi — the historic lake and fort ruins, art galleries, designer boutiques, cafés and markets, mapped into an easy local route.",
    date: "2026-07-10",
    readMins: 6,
    category: "Guide",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=70",
    relatedCategory: "art-galleries",
    body: [
      { type: "p", text: "Hauz Khas rewards a wander. In a single afternoon you can walk from a 14th-century reservoir and madrasa to a contemporary art gallery, a designer boutique and a rooftop dinner. Here's a route that ties it together." },
      { type: "h2", text: "Start at the lake and ruins" },
      { type: "p", text: "Enter the Hauz Khas Complex through Deer Park to reach the medieval tank, tombs and madrasa — the historic core that gives the neighbourhood its name and its best golden-hour views." },
      { type: "h2", text: "Browse art and boutiques" },
      { type: "p", text: "Weave through the Village lanes to galleries like Art Konsult and boutiques like OGAAN and Nappa Dori. This stretch is why Hauz Khas earned its 'ethnic chic' reputation." },
      { type: "h2", text: "End with food and a view" },
      { type: "p", text: "Close the loop with dinner at a rooftop like Mia Bella or drinks at Hauz Khas Social. Hungry now? Start with our guide to the best cafés and restaurants in Hauz Khas." },
    ],
  },
];

// ---------------- selectors ----------------
const getCategory = (slug) =>
  categories.find((c) => c.slug === slug);

const getListingsByCategory = (slug) =>
  listings.filter((l) => l.category === slug);

const getListing = (slug) =>
  listings.find((l) => l.slug === slug);

const getFeatured = () => listings.filter((l) => l.featured);

const getBlogPost = (slug) =>
  blogPosts.find((p) => p.slug === slug);

const categoryCount = (slug) =>
  getListingsByCategory(slug).length;

const mapsUrl = (l) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${l.name}, ${l.address}`
  )}`;

// =============================================================
// Part 2 additions — resident-utility layer
// (geofence, per-area coordinates, "open now" parsing, ordering)
// =============================================================

// Approx centre of the Hauz Khas services cluster + a radius that
// covers the Village, SDA, Aurobindo Place, the Enclave and Green Park.
const GEOFENCE = { lat: 28.5535, lng: 77.1945, radiusKm: 2.6 };

// Centroids for each micro-area used in the listings, so "Near me"
// distance sorting works today. Refine with exact per-place lat/lng later.
const AREA_COORDS = {
  "Hauz Khas Village": { lat: 28.5546, lng: 77.1926 },
  "Hauz Khas Main Market": { lat: 28.5531, lng: 77.1996 },
  "Hauz Khas": { lat: 28.5535, lng: 77.1968 },
  "Hauz Khas Enclave": { lat: 28.5486, lng: 77.2022 },
  "SDA Market": { lat: 28.5499, lng: 77.1907 },
  "Aurobindo Place": { lat: 28.5471, lng: 77.1936 },
  "Aurobindo Marg": { lat: 28.5451, lng: 77.1951 },
  "Green Park": { lat: 28.5591, lng: 77.2061 },
  "Panchsheel Park": { lat: 28.5432, lng: 77.2131 },
  "Hauz Khas / Saidulajab": { lat: 28.5301, lng: 77.1991 },
};

// Deterministic tiny offset per listing so co-located pins don't overlap.
function hashJitter(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffffffff;
  const a = ((h % 1000) / 1000 - 0.5) * 0.0028;
  const b = (((h >> 10) % 1000) / 1000 - 0.5) * 0.0028;
  return [a, b];
}
function coordFor(l) {
  const base = AREA_COORDS[l.area] || AREA_COORDS["Hauz Khas"] || GEOFENCE;
  const [da, db] = hashJitter(l.slug);
  return { lat: +(base.lat + da).toFixed(5), lng: +(base.lng + db).toFixed(5) };
}

// "Open now" ranges → array of [openMin, closeMin]; closeMin may exceed
// 1440 for places that run past midnight. Client compares against wall time.
function toMin(t) {
  const m = String(t).trim().match(/^(\d{1,2}):?(\d{2})?\s*([APap][Mm])$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const pm = /p/i.test(m[3]);
  if (h === 12) h = pm ? 12 : 0;
  else if (pm) h += 12;
  return h * 60 + min;
}
function parseHoursRanges(str) {
  if (!str) return [];
  const s = String(str).trim();
  if (/24\s*hours|24\s*\/\s*7|24x7/i.test(s)) return [[0, 1440]];
  if (/sunrise\s*to\s*sunset/i.test(s)) return [[360, 1140]]; // ~6:00 AM–7:00 PM
  const ranges = [];
  s.split(",").forEach((part) => {
    const seg = part.split(/[\u2013\u2014-]/).map((x) => x.trim());
    if (seg.length !== 2) return;
    let o = toMin(seg[0]);
    let c = toMin(seg[1]);
    if (o == null || c == null) return;
    if (c <= o) c += 1440; // runs past midnight
    ranges.push([o, c]);
  });
  return ranges;
}

// Which categories are everyday services (resident-first) vs going-out/discovery.
const EVERYDAY = new Set(["health", "salons-spas", "fitness", "coworking", "shopping"]);
const isEveryday = (slug) => EVERYDAY.has(slug);
// Per-category accent colours (colour-coded scanning, like a real local index).
const CAT_COLOR = {
  cafes: "#C77D2E",
  restaurants: "#C64B5A",
  "bars-nightlife": "#7A5AF0",
  "art-galleries": "#2E9E8F",
  boutiques: "#D65A9A",
  "salons-spas": "#B45FB0",
  fitness: "#2F8F5B",
  coworking: "#3B7DD8",
  health: "#1E9E6A",
  shopping: "#C98A2E",
};
const catColor = (slug) => CAT_COLOR[slug] || "#7B2D6E";
// Order for the resident ("I'm Here") view: services first, going-out last.
const RESIDENT_ORDER = ["health", "salons-spas", "fitness", "coworking", "shopping", "restaurants", "cafes", "bars-nightlife", "boutiques", "art-galleries"];
const residentCategories = () =>
  [...D.categories].sort((a, b) => RESIDENT_ORDER.indexOf(a.slug) - RESIDENT_ORDER.indexOf(b.slug));

const D = { siteConfig, categories, listings, reviews, blogPosts, getCategory, getListingsByCategory, getListing, getFeatured, getBlogPost, categoryCount, mapsUrl };

// ===== inlined static assets (was assets/*) =====
const __ASSETS = {
  "styles.css": "/* ============ Discover Hauz Khas — design system ============ */\n:root {\n  --brand: #b3121c;\n  --brand-dark: #8f0d15;\n  --brand-light: #fdeaec;\n  --ink: #0b1220;\n  --muted: #64748b;\n  --line: #eef1f5;\n  --bg: #ffffff;\n  --soft: #f8fafc;\n  --shadow: 0 6px 24px -8px rgba(15, 23, 42, 0.14);\n  --lift: 0 18px 40px -12px rgba(15, 23, 42, 0.22);\n  --radius: 16px;\n  --maxw: 1200px;\n}\n* { box-sizing: border-box; }\nhtml { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }\nbody {\n  margin: 0;\n  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;\n  color: var(--ink);\n  background: var(--bg);\n  line-height: 1.55;\n  -webkit-font-smoothing: antialiased;\n}\nimg { max-width: 100%; display: block; }\na { color: inherit; text-decoration: none; }\nh1, h2, h3, h4 { font-family: Poppins, Inter, system-ui, sans-serif; line-height: 1.14; margin: 0; color: var(--ink); }\np { margin: 0; }\nul { margin: 0; padding: 0; list-style: none; }\n.container { max-width: var(--maxw); margin: 0 auto; padding: 0 20px; }\n.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }\n.skip { position: absolute; left: -999px; top: 0; z-index: 100; background: #fff; padding: 10px 16px; border-radius: 10px; box-shadow: var(--lift); }\n.skip:focus { left: 16px; top: 16px; }\n\n/* ---------- buttons / chips ---------- */\n.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 999px; padding: 11px 22px; font-weight: 600; font-size: 14px; cursor: pointer; border: 1px solid transparent; transition: all .18s ease; }\n.btn-primary { background: var(--brand); color: #fff; }\n.btn-primary:hover { background: var(--brand-dark); }\n.btn-white { background: #fff; color: var(--brand); }\n.btn-white:hover { background: #f1f5f9; }\n.btn-ghost { background: #fff; color: var(--ink); border-color: #e2e8f0; }\n.btn-ghost:hover { border-color: #cbd5e1; background: var(--soft); }\n.chip { display: inline-flex; align-items: center; gap: 6px; border-radius: 999px; border: 1px solid #e2e8f0; background: #fff; padding: 7px 14px; font-size: 14px; font-weight: 500; color: #334155; transition: all .18s; }\n.chip:hover { border-color: var(--brand); color: var(--brand); }\n.eyebrow { color: var(--brand); font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }\n.section-title { font-size: clamp(26px, 4vw, 38px); font-weight: 800; }\n\n/* ---------- media (object-fit cover) ---------- */\n.media { position: relative; overflow: hidden; background: #e9edf3; }\n.media img.cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }\n.ratio-43 { aspect-ratio: 4 / 3; }\n.ratio-45 { aspect-ratio: 4 / 5; }\n.ratio-169 { aspect-ratio: 16 / 9; }\n.ratio-1610 { aspect-ratio: 16 / 10; }\n\n/* ---------- header ---------- */\n.site-header { position: sticky; top: 0; z-index: 50; background: rgba(255, 255, 255, .96); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }\n.header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 64px; }\n.brand { display: flex; align-items: center; gap: 9px; }\n.brand-badge { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 11px; background: var(--brand); color: #fff; }\n.brand-name { font-family: Poppins; font-weight: 700; font-size: 18px; letter-spacing: -.01em; }\n.brand-name .accent { color: var(--brand); }\n.nav { display: none; align-items: center; gap: 2px; }\n.nav a { padding: 8px 14px; border-radius: 999px; font-size: 14px; font-weight: 500; color: #334155; }\n.nav a:hover { color: var(--brand); }\n.has-menu { position: relative; }\n.menu-trigger { display: inline-flex; align-items: center; gap: 4px; }\n.mega { position: absolute; left: 50%; top: 100%; transform: translateX(-50%); padding-top: 12px; width: 560px; visibility: hidden; opacity: 0; transition: all .18s; }\n.has-menu:hover .mega { visibility: visible; opacity: 1; }\n.mega-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--lift); padding: 12px; }\n.mega-item { display: flex; gap: 12px; padding: 10px 12px; border-radius: 12px; }\n.mega-item:hover { background: var(--soft); }\n.mega-item .ic { font-size: 20px; }\n.mega-item b { display: block; font-size: 14px; color: var(--ink); }\n.mega-item span { display: block; font-size: 12px; color: var(--muted); }\n.header-cta { display: none; }\n.menu-btn { display: inline-flex; padding: 8px; border-radius: 10px; cursor: pointer; color: var(--ink); }\n#nav-toggle { display: none; }\n.mobile-nav { display: none; position: absolute; left: 0; right: 0; top: 64px; background: #fff; border-bottom: 1px solid var(--line); padding: 14px 0; }\n#nav-toggle:checked ~ .mobile-nav { display: block; }\n.mobile-nav a { display: block; padding: 11px 20px; font-weight: 500; color: #334155; }\n.mobile-nav a:hover { background: var(--soft); }\n.mobile-nav .btn { margin: 10px 20px 0; }\n@media (min-width: 1024px) {\n  .nav { display: flex; }\n  .header-cta { display: block; }\n  .menu-btn { display: none; }\n}\n\n/* ---------- hero ---------- */\n.hero { position: relative; color: #fff; }\n.hero .media { position: absolute; inset: 0; }\n.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(11,18,32,.66) 0%, rgba(11,18,32,.55) 45%, rgba(11,18,32,.84) 100%); }\n.hero-content { position: relative; text-align: center; padding: 96px 0 108px; }\n.hero h1 { font-size: clamp(34px, 6vw, 60px); font-weight: 800; color: #fff; }\n.hero h1 .accent { color: #f5333f; }\n.hero-sub { max-width: 640px; margin: 18px auto 0; font-size: clamp(16px, 2.2vw, 19px); color: rgba(255,255,255,.86); }\n.hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,.16); backdrop-filter: blur(6px); padding: 7px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; margin-bottom: 18px; }\n.hero-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 24px; }\n.hero-chips a { background: rgba(255,255,255,.16); backdrop-filter: blur(6px); padding: 7px 16px; border-radius: 999px; font-size: 14px; font-weight: 500; transition: all .18s; }\n.hero-chips a:hover { background: #fff; color: var(--ink); }\n\n/* ---------- search bar ---------- */\n.searchbar { display: flex; flex-direction: column; gap: 8px; background: #fff; border-radius: var(--radius); box-shadow: var(--lift); padding: 8px; max-width: 660px; margin: 30px auto 0; }\n.searchbar .field { display: flex; align-items: center; gap: 8px; padding: 0 12px; flex: 1; }\n.searchbar input[type=text] { border: 0; outline: 0; width: 100%; font-size: 14px; padding: 12px 0; color: var(--ink); background: transparent; }\n.searchbar select { border: 0; outline: 0; background: transparent; font-size: 14px; color: #334155; padding: 12px; }\n.searchbar .divider { border-left: 1px solid var(--line); }\n.searchbar .btn { padding: 13px 26px; }\n@media (min-width: 640px) { .searchbar { flex-direction: row; align-items: center; } }\n\n/* ---------- sections & grids ---------- */\n.section { padding: 64px 0; }\n.section.soft { background: var(--soft); }\n.section.dark { background: var(--ink); color: #fff; }\n.section.dark .section-title { color: #fff; }\n.section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 30px; }\n.section-head.center { display: block; text-align: center; }\n.section-head h2 { margin-top: 8px; }\n.section-head p.lead { color: var(--muted); margin-top: 10px; max-width: 560px; }\n.section-head.center p.lead { margin-left: auto; margin-right: auto; }\n.link-all { color: var(--brand); font-weight: 600; font-size: 14px; }\n.link-all:hover { text-decoration: underline; }\n.grid { display: grid; gap: 22px; }\n.grid-3 { grid-template-columns: 1fr; }\n.grid-cats { grid-template-columns: repeat(2, 1fr); }\n@media (min-width: 640px) { .grid-3 { grid-template-columns: repeat(2, 1fr); } .grid-cats { grid-template-columns: repeat(3, 1fr); } }\n@media (min-width: 1024px) { .grid-3 { grid-template-columns: repeat(3, 1fr); } .grid-cats { grid-template-columns: repeat(5, 1fr); } }\n\n/* stats */\n.stats { display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 16px; padding: 32px 0; border-bottom: 1px solid var(--line); }\n.stats .n { font-family: Poppins; font-weight: 800; font-size: clamp(26px, 4vw, 38px); }\n.stats .l { color: var(--muted); font-size: 14px; margin-top: 4px; }\n\n/* ---------- cards ---------- */\n.card { border: 1px solid #f0f2f6; border-radius: var(--radius); overflow: hidden; background: #fff; box-shadow: var(--shadow); transition: transform .2s, box-shadow .2s; display: flex; flex-direction: column; }\n.card:hover { transform: translateY(-4px); box-shadow: var(--lift); }\n.card:hover .media img.cover { transform: scale(1.05); }\n.card .tag-cat { position: absolute; left: 12px; top: 12px; background: rgba(255,255,255,.95); border-radius: 999px; padding: 5px 12px; font-size: 12px; font-weight: 600; }\n.card-body { padding: 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }\n.card-title { font-size: 18px; font-weight: 700; }\n.card-title a:hover { color: var(--brand); }\n.row-between { display: flex; align-items: center; justify-content: space-between; gap: 10px; }\n.price { color: #059669; font-weight: 600; font-size: 14px; }\n.place-area { display: flex; align-items: center; gap: 6px; color: var(--muted); font-size: 14px; }\n.card-desc { color: #475569; font-size: 14px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }\n.view-link { color: var(--brand); font-weight: 600; font-size: 14px; }\n.card:hover .view-link { text-decoration: underline; }\n\n/* rating */\n.rating { display: inline-flex; align-items: center; gap: 6px; }\n.stars { display: inline-flex; }\n.stars svg { margin-right: 2px; }\n.rating .val { font-weight: 700; font-size: 14px; }\n.rating .cnt { color: var(--muted); font-size: 12px; }\n\n/* category tile */\n.cat-tile { position: relative; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); display: block; }\n.cat-tile .overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,18,32,.85), rgba(11,18,32,.25) 46%, rgba(11,18,32,0)); }\n.cat-tile .label { position: absolute; left: 0; right: 0; bottom: 0; padding: 18px; color: #fff; }\n.cat-tile .label .ic { font-size: 22px; }\n.cat-tile .label h3 { color: #fff; font-size: 18px; margin-top: 4px; }\n.cat-tile .label span { color: rgba(255,255,255,.82); font-size: 13px; }\n.cat-tile:hover .media img.cover { transform: scale(1.05); }\n\n/* how it works */\n.steps { display: grid; gap: 26px; grid-template-columns: 1fr; }\n@media (min-width: 768px) { .steps { grid-template-columns: repeat(3, 1fr); } }\n.step { text-align: center; border: 1px solid #f0f2f6; border-radius: var(--radius); padding: 28px; box-shadow: var(--shadow); }\n.step .ic { width: 56px; height: 56px; margin: 0 auto; display: grid; place-items: center; border-radius: 14px; background: var(--brand-light); font-size: 24px; }\n.step h3 { margin-top: 16px; font-size: 20px; }\n.step p { margin-top: 8px; color: #475569; font-size: 14px; }\n\n/* reviews */\n.reviews { display: grid; gap: 22px; grid-template-columns: 1fr; }\n@media (min-width: 768px) { .reviews { grid-template-columns: repeat(3, 1fr); } }\n.review { background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: var(--radius); padding: 26px; }\n.review blockquote { margin: 16px 0 0; color: #e2e8f0; font-size: 15px; line-height: 1.7; }\n.review figcaption { display: flex; align-items: center; gap: 12px; margin-top: 20px; }\n.review figcaption img { width: 40px; height: 40px; border-radius: 999px; object-fit: cover; }\n.review .who b { color: #fff; display: block; font-size: 14px; }\n.review .who a { color: #94a3b8; font-size: 13px; }\n.review .who a:hover { color: var(--brand); }\n\n/* cta band */\n.cta { border-radius: 24px; background: var(--brand); color: #fff; text-align: center; padding: 56px 24px; }\n.cta h2 { color: #fff; font-size: clamp(26px, 4vw, 38px); font-weight: 800; }\n.cta p { max-width: 560px; margin: 12px auto 0; color: rgba(255,255,255,.9); }\n.cta .btn { margin-top: 26px; }\n\n/* ---------- page header (inner pages) ---------- */\n.page-hero { background: var(--soft); border-bottom: 1px solid var(--line); }\n.page-hero .container { padding-top: 40px; padding-bottom: 40px; }\n.page-hero h1 { font-size: clamp(28px, 4.4vw, 44px); font-weight: 800; margin-top: 12px; }\n.page-hero p.lead { color: var(--muted); margin-top: 12px; max-width: 640px; font-size: 16px; }\n.breadcrumb { font-size: 14px; color: var(--muted); }\n.breadcrumb ol { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }\n.breadcrumb a:hover { color: var(--brand); }\n.breadcrumb .sep { color: #cbd5e1; }\n.breadcrumb [aria-current] { color: #334155; font-weight: 500; }\n\n/* ---------- listing detail ---------- */\n.detail-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }\n@media (min-width: 900px) { .detail-grid { grid-template-columns: 1.6fr 1fr; } }\n.detail-media { border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }\n.detail-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }\n.detail-tags span { background: var(--soft); border: 1px solid var(--line); color: #475569; border-radius: 999px; padding: 5px 12px; font-size: 13px; }\n.info-card { border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 22px; position: sticky; top: 84px; }\n.info-row { display: flex; gap: 14px; padding: 14px 2px; border-bottom: 1px solid var(--line); align-items: flex-start; }\n.info-row:last-child { border-bottom: 0; }\n.info-row .ic { color: var(--brand); flex-shrink: 0; width: 22px; height: 22px; display: grid; place-items: center; margin-top: 1px; }\n.info-row > span:last-child { display: flex; flex-direction: column; gap: 4px; min-width: 0; }\n.info-row .k { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .07em; font-weight: 600; }\n.info-row .v { font-weight: 500; font-size: 15px; line-height: 1.5; word-break: break-word; }\n.info-row .v a { color: var(--brand); }\n.verify-note { font-size: 12px; color: #94a3b8; }\n.badge-verified { display: inline-flex; align-items: center; gap: 4px; color: #059669; font-size: 12px; font-weight: 600; }\n\n/* ---------- prose (blog) ---------- */\n.prose { max-width: 720px; margin: 0 auto; }\n.prose p { margin: 0 0 20px; font-size: 17px; line-height: 1.75; color: #334155; }\n.prose h2 { font-size: 24px; margin: 34px 0 12px; }\n.prose a { color: var(--brand); font-weight: 500; text-decoration: underline; }\n.post-meta { color: var(--muted); font-size: 14px; }\n\n/* ---------- forms ---------- */\n.form { display: grid; gap: 16px; max-width: 620px; }\n.form label { font-size: 14px; font-weight: 600; display: block; margin-bottom: 6px; }\n.form input, .form select, .form textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 14px; font-size: 15px; font-family: inherit; color: var(--ink); background: #fff; }\n.form input:focus, .form select:focus, .form textarea:focus { outline: 2px solid var(--brand); outline-offset: 1px; border-color: var(--brand); }\n.form .two { display: grid; gap: 16px; }\n@media (min-width: 640px) { .form .two { grid-template-columns: 1fr 1fr; } }\n.note { background: var(--brand-light); border: 1px solid #f7d4d6; color: #9b2c34; border-radius: 12px; padding: 12px 16px; font-size: 14px; }\n\n/* ---------- footer ---------- */\n.site-footer { margin-top: 80px; background: var(--ink); color: #cbd5e1; }\n.footer-grid { display: grid; gap: 40px; grid-template-columns: 1fr; padding: 56px 0; }\n@media (min-width: 768px) { .footer-grid { grid-template-columns: 1.6fr 1fr 1fr 1fr; } }\n.footer-grid h2 { color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 16px; }\n.footer-grid a { color: #cbd5e1; font-size: 14px; }\n.footer-grid a:hover { color: #fff; }\n.footer-grid li { margin-bottom: 10px; }\n.footer-about p { color: #94a3b8; font-size: 14px; margin-top: 16px; max-width: 340px; }\n.newsletter { margin-top: 22px; }\n.newsletter form { display: flex; gap: 8px; margin-top: 12px; }\n.newsletter input { flex: 1; border-radius: 999px; border: 1px solid rgba(255,255,255,.15); background: rgba(255,255,255,.05); color: #fff; padding: 11px 16px; font-size: 14px; }\n.newsletter input::placeholder { color: #64748b; }\n.footer-bottom { border-top: 1px solid rgba(255,255,255,.1); }\n.footer-bottom .container { display: flex; flex-direction: column; gap: 12px; align-items: center; justify-content: space-between; padding: 22px 20px; font-size: 14px; color: #94a3b8; }\n.footer-bottom .socials { display: flex; gap: 16px; }\n.footer-bottom a:hover { color: #fff; }\n@media (min-width: 640px) { .footer-bottom .container { flex-direction: row; } }\n\n/* search results */\n.result-empty { text-align: center; padding: 60px 0; color: var(--muted); }\n.mt-6 { margin-top: 24px; } .mt-3 { margin-top: 12px; } .mb-0 { margin-bottom: 0; }\n\n/* ---------- icons (SVG line set) ---------- */\n.ic-svg { width: 1em; height: 1em; display: inline-block; vertical-align: middle; flex-shrink: 0; }\n.hero-chips a .ic-svg { width: 16px; height: 16px; vertical-align: -3px; margin-right: 2px; }\n.hero-badge .ic-svg.hb { width: 15px; height: 15px; vertical-align: -2px; }\n.tag-cat .ic-svg { width: 14px; height: 14px; vertical-align: -2px; }\n.cat-tile .label .ic { display: inline-flex; }\n.cat-tile .label .ic .ic-svg { width: 26px; height: 26px; }\n.mega-item .ic { color: var(--brand); display: inline-flex; }\n.mega-item .ic .ic-svg { width: 22px; height: 22px; }\n.step .ic .ic-svg { width: 28px; height: 28px; color: var(--brand); }\n.info-row .ic .ic-svg { width: 18px; height: 18px; }\n.map-head .ic-svg { width: 18px; height: 18px; vertical-align: -3px; color: var(--brand); margin-right: 4px; }\n\n/* ---------- map embed ---------- */\n.map-embed { border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); margin-top: 44px; }\n.map-embed .map-head { padding: 14px 20px; border-bottom: 1px solid var(--line); font-weight: 700; font-family: Poppins, sans-serif; }\n.map-embed iframe { width: 100%; height: 400px; border: 0; display: block; }\n\n/* ---------- footer credit ---------- */\n.credit-row { padding: 0 20px 20px; font-size: 12px; color: #64748b; }\n",
  "app.js": "// Lightweight site JS: fake-submit handling for demo forms (newsletter,\n// contact, add-listing). Replace with your ESP / form backend before launch.\ndocument.addEventListener(\"submit\", function (e) {\n  var f = e.target;\n  if (f && f.classList && f.classList.contains(\"js-form\")) {\n    e.preventDefault();\n    var ok = f.parentNode.querySelector(\".form-success\");\n    if (ok) {\n      f.style.display = \"none\";\n      ok.style.display = \"block\";\n      ok.setAttribute(\"role\", \"status\");\n    }\n  }\n});\n",
  "search.js": "// Client-side search over the embedded listings index.\n(function () {\n  var params = new URLSearchParams(location.search);\n  var q = (params.get(\"q\") || \"\").trim().toLowerCase();\n  var cat = (params.get(\"category\") || \"\").trim();\n  var data = window.__LISTINGS__ || [];\n  var catNames = window.__CATNAMES__ || {};\n\n  // reflect current query into the search box\n  var qi = document.getElementById(\"q\");\n  if (qi && q) qi.value = params.get(\"q\");\n  var cs = document.getElementById(\"category\");\n  if (cs && cat) cs.value = cat;\n\n  var res = data.filter(function (l) {\n    var mc = !cat || l.category === cat;\n    var hay = (l.name + \" \" + l.area + \" \" + (l.tags || []).join(\" \") + \" \" + l.short + \" \" + l.categoryName).toLowerCase();\n    var mq = !q || hay.indexOf(q) >= 0;\n    return mc && mq;\n  });\n\n  var bits = [];\n  if (q) bits.push(\"“\" + params.get(\"q\") + \"”\");\n  if (cat) bits.push(\"in \" + (catNames[cat] || cat));\n  document.getElementById(\"search-term\").textContent = bits.length ? bits.join(\" \") : \"all places\";\n  document.getElementById(\"search-count\").textContent = res.length;\n\n  var wrap = document.getElementById(\"search-results\");\n  var empty = document.getElementById(\"search-empty\");\n  if (!res.length) { empty.style.display = \"block\"; return; }\n  empty.style.display = \"none\";\n  wrap.innerHTML = res.map(cardHTML).join(\"\");\n\n  function k(n) { return n >= 1000 ? (n / 1000).toFixed(1) + \"k\" : n; }\n  function cardHTML(l) {\n    var price = \"₹\".repeat(l.price);\n    return (\n      '<article class=\"card\"><a href=\"/place/' + l.slug + '/\"><div class=\"media ratio-43\">' +\n      '<img class=\"cover\" loading=\"lazy\" src=\"' + l.image + '\" alt=\"' + l.name + '\">' +\n      '<span class=\"tag-cat\">' + l.icon + \" \" + l.categorySingular + \"</span></div></a>\" +\n      '<div class=\"card-body\"><div class=\"row-between\"><h3 class=\"card-title\"><a href=\"/place/' + l.slug + '/\">' + l.name + \"</a></h3>\" +\n      '<span class=\"price\">' + price + \"</span></div>\" +\n      '<p class=\"place-area\"><svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z\" stroke=\"currentColor\" stroke-width=\"2\"/></svg> ' + l.area + \"</p>\" +\n      '<p class=\"card-desc\">' + l.short + \"</p>\" +\n      '<div class=\"row-between\"><span class=\"rating\"><span class=\"val\">★ ' + l.rating.toFixed(1) + \"</span> \" +\n      '<span class=\"cnt\">(' + k(l.reviews) + \")</span></span>\" +\n      '<a class=\"view-link\" href=\"/place/' + l.slug + '/\">View →</a></div></div></article>'\n    );\n  }\n})();\n"
};

// ===== Part 2 assets: resident-utility CSS + JS (mode / geo / open-now / near-me / favourites) =====
__ASSETS["dhk.css"] = String.raw`
/* ---------- locator strip ---------- */
.locator { background: var(--brand-light); border-bottom: 1px solid #f7d4d6; }
.locator .container { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; padding: 10px 20px; }
.locator .loc-msg { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #7a1720; font-weight: 500; }
.locator .loc-msg svg { width: 16px; height: 16px; flex: 0 0 auto; }
.locator .spacer { flex: 1 1 40px; }
.loc-actions { display: flex; align-items: center; gap: 8px; }
.loc-btn { border: 1px solid #e7b3b7; background: #fff; color: var(--brand); border-radius: 999px; padding: 7px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
.loc-btn:hover { background: var(--brand); color: #fff; }
.mode-switch { display: inline-flex; background: #fff; border: 1px solid #e7b3b7; border-radius: 999px; padding: 3px; }
.mode-switch button { border: 0; background: transparent; color: #7a1720; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 999px; cursor: pointer; }
.mode-switch button[aria-pressed="true"] { background: var(--brand); color: #fff; }
.saved-pill { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #7a1720; }

/* ---------- filter toolbar ---------- */
.toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 4px 0 26px; }
.toolbar .tgl { display: inline-flex; align-items: center; gap: 7px; border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 8px 14px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer; transition: all .15s; }
.toolbar .tgl svg { width: 16px; height: 16px; }
.toolbar .tgl:hover { border-color: var(--brand); color: var(--brand); }
.toolbar .tgl[aria-pressed="true"] { background: var(--brand); border-color: var(--brand); color: #fff; }
.toolbar select { border: 1px solid #e2e8f0; background: #fff; border-radius: 999px; padding: 9px 14px; font-size: 14px; color: #334155; font-family: inherit; }
.toolbar .count { margin-left: auto; color: var(--muted); font-size: 14px; font-weight: 500; }
.toolbar .clearf { color: var(--brand); font-size: 13px; font-weight: 600; cursor: pointer; background: none; border: 0; }

/* ---------- card badges / actions ---------- */
.card-flags { display: flex; flex-wrap: wrap; gap: 6px; }
.flag { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; border-radius: 999px; padding: 3px 9px; }
.flag-open { background: #dcfce7; color: #166534; }
.flag-closed { background: #f1f5f9; color: #64748b; }
.flag-dist { background: var(--brand-light); color: var(--brand); }
.fav { position: absolute; right: 12px; top: 12px; z-index: 3; width: 34px; height: 34px; border-radius: 999px; border: 0; background: rgba(255,255,255,.94); box-shadow: var(--shadow); cursor: pointer; display: grid; place-items: center; color: #94a3b8; }
.fav:hover { color: var(--brand); }
.fav svg { width: 18px; height: 18px; }
.fav[aria-pressed="true"] { color: var(--brand); }
.fav[aria-pressed="true"] svg { fill: currentColor; }
.card .media { position: relative; }
.place-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.place-actions a { flex: 1 1 auto; }

/* live "open now near you" empty state */
.near-empty { display: none; text-align: center; color: var(--muted); padding: 30px 0; }

/* mode-based emphasis (progressive; default = local/resident) */
.for-explore { display: none; }
body[data-mode="explore"] .for-explore { display: block; }
body[data-mode="explore"] .for-local-primary { opacity: .96; }
.mode-note { display: none; }
body[data-mode="explore"] .mode-note.explore { display: flex; }
body[data-mode="local"] .mode-note.local { display: flex; }

/* ============================================================
   THEME v4 - mode-driven skin
   default + "I'm Here" (local)  = plum / grape (light)
   "Exploring" (explore)         = original Part-1 red
   Flip is driven by body[data-mode]; every colour is a variable.
   ============================================================ */

/* ---- LOCAL (default): plum / grape, light ---- */
body, body[data-mode="local"] {
  --brand: #7B2D6E; --brand-dark: #5A1F50; --brand-light: #F4E9F2;
  --ink: #1A1420; --muted: #6B6472; --line: #EBE4EF;
  --bg: #FAF7FB; --soft: #FFFFFF; --card: #FFFFFF;
  --surface: #271A33; --on-surface: #FFFFFF;
  --hero-grad: linear-gradient(160deg, #FFFFFF 0%, #F8EFF6 55%, #F1E4EF 100%);
  --hero-overlay: linear-gradient(160deg, rgba(255,255,255,.74), rgba(241,228,239,.5));
  --hero-text: #3A1F37; --hero-sub: #6B5566; --hero-accent: #7B2D6E; --hero-media-op: .12;
}
/* ---- EXPLORE: original red ---- */
body[data-mode="explore"] {
  --brand: #b3121c; --brand-dark: #8f0d15; --brand-light: #fdeaec;
  --ink: #0b1220; --muted: #64748b; --line: #eef1f5;
  --bg: #ffffff; --soft: #f8fafc; --card: #ffffff;
  --surface: #0b1220; --on-surface: #FFFFFF;
  --hero-grad: none;
  --hero-overlay: linear-gradient(180deg, rgba(11,18,32,.34), rgba(11,18,32,.66));
  --hero-text: #ffffff; --hero-sub: rgba(255,255,255,.9); --hero-accent: #ff5a63; --hero-media-op: 1;
}
/* ---- constants (theme-independent) ---- */
:root {
  --live: #1E9E6A; --live-ink: #12734B; --closed: #98A2B3;
  --radius: 14px; --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --shadow: 0 6px 22px -14px rgba(20,16,26,.26); --lift: 0 20px 44px -20px rgba(40,24,54,.26);
}

body { background: var(--bg); font-family: Inter, system-ui, -apple-system, sans-serif; color: var(--ink); transition: background-color .35s ease, color .35s ease; }
h1, h2, h3, h4 { font-family: "Plus Jakarta Sans", Inter, sans-serif; letter-spacing: -.02em; color: var(--ink); }
.eyebrow { color: var(--brand); letter-spacing: .1em; font-weight: 700; font-size: 12px; text-transform: uppercase; }
.section-title { font-weight: 800; letter-spacing: -.025em; }
.lead { color: var(--muted); }

/* header */
.site-header { background: #fff; border-bottom: 1px solid var(--line); transition: border-color .35s ease; }
.site-header a.logo, .site-header .brand-name { font-family: "Plus Jakarta Sans"; color: var(--ink); }
.site-header .accent { color: var(--brand); }
.site-header nav a, .site-header .nav a { color: #475467; }
.site-header nav a:hover, .site-header .nav a:hover { color: var(--brand); }
.site-header .btn-primary { background: var(--brand); color: #fff; }
.site-header .btn-primary:hover { background: var(--brand-dark); }
.mega, .mobile-nav, .dropdown { background: #fff; border-color: var(--line); }
.mega a, .mobile-nav a { color: #475467; }
.mega a:hover, .mobile-nav a:hover { color: var(--brand); background: var(--brand-light); }

/* buttons + chips */
.btn-primary { background: var(--brand); color: #fff; font-weight: 700; transition: background-color .25s ease; }
.btn-primary:hover { background: var(--brand-dark); color: #fff; }
.btn-ghost { border-color: var(--line); color: var(--ink); }
.btn-ghost:hover { border-color: var(--brand); color: var(--brand); }
.btn-white { background: #fff; color: var(--brand-dark); }
.btn-white:hover { background: var(--brand-light); }
.chip:hover { border-color: var(--brand); color: var(--brand); }

/* HERO - skins by mode */
.hero { background-image: var(--hero-grad); background-color: var(--soft); }
.hero .media { opacity: var(--hero-media-op); transition: opacity .35s ease; }
.hero-overlay { background: var(--hero-overlay); transition: background .35s ease; }
.hero-content { text-align: left; padding: 78px 0 84px; }
.hero h1 { font-size: clamp(38px, 6vw, 70px); font-weight: 800; letter-spacing: -.03em; line-height: 1.02; color: var(--hero-text); transition: color .35s ease; }
.hero h1 .accent { color: var(--hero-accent); }
.hero-sub { margin: 16px 0 0; max-width: 566px; color: var(--hero-sub); text-align: left; }
.hero .searchbar { margin: 24px 0 0; box-shadow: var(--lift); }
.hero .searchbar .btn, .searchbar button[type="submit"] { background: var(--brand); color: #fff; }
.hero-chips { justify-content: flex-start; }
.hero-chips a { background: rgba(255,255,255,.9); color: var(--brand-dark); border-color: var(--line); }
.hero-chips a:hover { background: var(--brand); color: #fff; border-color: var(--brand); }
.live-line { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 3px; font-family: var(--mono); font-size: 12.5px; letter-spacing: .03em; color: var(--ink); background: #fff; border: 1px solid var(--line); border-radius: 999px; padding: 8px 15px; margin-bottom: 18px; box-shadow: var(--shadow); }
body[data-mode="explore"] .live-line { color: #fff; background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.28); }
.live-line b { color: var(--brand); font-weight: 700; padding: 0 2px; }
body[data-mode="explore"] .live-line b { color: #ffd0d3; }
.live-line .dot { width: 9px; height: 9px; border-radius: 999px; background: var(--live); margin-right: 8px; box-shadow: 0 0 0 0 rgba(30,158,106,.6); animation: hkpulse 2.4s infinite; }
@keyframes hkpulse { 0% { box-shadow: 0 0 0 0 rgba(30,158,106,.5); } 70% { box-shadow: 0 0 0 7px rgba(30,158,106,0); } 100% { box-shadow: 0 0 0 0 rgba(30,158,106,0); } }

/* stats */
.stats { border-color: var(--line); }
.stats .n { font-family: "Plus Jakarta Sans"; color: var(--brand-dark); font-weight: 800; }
.stats .l { color: var(--muted); font-size: 13px; }

/* CARDS */
.card { border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); background: var(--card); overflow: hidden; transition: box-shadow .2s ease, transform .2s ease, border-color .35s ease; }
.card::before { content: ""; position: absolute; left: 0; top: 0; height: 3px; width: 100%; background: var(--cat, var(--brand)); opacity: 0; transition: opacity .2s; z-index: 4; }
.card:hover { box-shadow: var(--lift); transform: translateY(-4px); }
.card:hover::before { opacity: 1; }
.card .tag-cat { background: #fff; color: var(--brand-dark); border: 1px solid var(--line); font-size: 11px; letter-spacing: .01em; font-weight: 700; }
.card-title, .card-title a { font-family: "Plus Jakarta Sans"; color: var(--ink); }
.card-flags { display: flex; flex-wrap: wrap; gap: 6px; }
.flag { font-family: var(--mono); font-size: 11px; letter-spacing: .02em; font-weight: 700; }
.flag-open { background: #E7F6EF; color: var(--live-ink); }
.flag-open::before { content: "\25CF "; }
.flag-closed { background: #F1EEF4; color: var(--closed); }
.flag-dist { background: var(--brand-light); color: var(--brand-dark); }
.fav { background: rgba(255,255,255,.95); color: #9A93A3; }
.fav:hover, .fav[aria-pressed="true"] { color: var(--brand); }
.price { color: var(--brand-dark); font-weight: 700; }

/* CATEGORY TILES */
.cat-tile { border-radius: var(--radius); box-shadow: var(--shadow); position: relative; overflow: hidden; transition: box-shadow .2s ease, transform .2s ease; }
.cat-tile::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: var(--cat, var(--brand)); z-index: 3; }
.cat-tile:hover { box-shadow: var(--lift); transform: translateY(-4px); }
.cat-tile .label h3 { font-family: "Plus Jakarta Sans"; }
.cat-tile .label > span:last-child { font-size: 12px; color: rgba(255,255,255,.9); }
.cat-tile .label .ic { color: #fff; }

/* SECTIONS */
.section.soft { background: var(--soft); }
.section.dark { background: var(--surface); transition: background-color .35s ease; }
.section.dark .eyebrow { color: #fff; opacity: .85; }
.section.dark .section-title { color: #fff; }
.review { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.15); }
.review blockquote { color: #F1ECF4; }
.review .who b { color: #fff; }
.review .who a { color: #fff; opacity: .85; }

/* CTA */
.cta { background: var(--surface); transition: background-color .35s ease; }
.cta h2 { font-family: "Plus Jakarta Sans"; color: #fff; }
.cta p { color: rgba(255,255,255,.85); }
.cta .btn-white { background: #fff; color: var(--brand-dark); }

/* LOCATOR strip */
.locator { background: #fff; border-bottom: 1px solid var(--line); }
.locator .loc-msg { color: var(--ink); font-size: 13.5px; font-weight: 500; }
.locator .loc-msg svg { color: var(--brand); }
.loc-btn { border-color: var(--brand); color: var(--brand); }
.loc-btn:hover { background: var(--brand); color: #fff; }
.mode-switch { border-color: var(--line); }
.mode-switch button { color: var(--muted); font-size: 13px; }
.mode-switch button[aria-pressed="true"] { background: var(--brand); color: #fff; }
.saved-pill { color: var(--muted); font-size: 13px; }
.saved-pill svg { color: var(--brand); }
[data-clock] { font-family: var(--mono); font-weight: 700; color: var(--brand-dark); }

/* TOOLBAR */
.toolbar .tgl { font-size: 13.5px; font-weight: 600; }
.toolbar .tgl[aria-pressed="true"] { background: var(--brand-dark); border-color: var(--brand-dark); color: #fff; }
.toolbar .tgl[data-tgl="open"][aria-pressed="true"] { background: var(--live); border-color: var(--live); color: #fff; }
.toolbar .tgl[data-tgl="near"][aria-pressed="true"] { background: var(--brand); border-color: var(--brand); color: #fff; }
.toolbar select { font-size: 13.5px; color: var(--ink); }
.toolbar .count { color: var(--muted); }
.toolbar .count strong { color: var(--ink); }
.toolbar .clearf { color: var(--brand); font-weight: 600; }

/* inner page hero + place */
.page-hero { background: var(--soft); border-bottom: 1px solid var(--line); }
.page-hero h1 { font-family: "Plus Jakarta Sans"; }
.breadcrumb, .breadcrumb a { font-size: 13px; }
.info-card { border: 1px solid var(--line); border-radius: var(--radius); }
.badge-verified, .verified { color: var(--live); }

/* FOOTER */
.site-footer { background: var(--surface); transition: background-color .35s ease; }

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  .live-line .dot { animation: none; }
  .card, .cat-tile, body, .hero .media, .hero-overlay, .hero h1, .section.dark, .cta, .site-footer { transition: none; }
}
`;

__ASSETS["dhk.js"] = String.raw`
// Discover Hauz Khas — resident-utility layer.
// Progressive enhancement only: every listing is already in the static HTML.
// Adds: location ask + geofence mode, open-now, near-me distance sort,
// favourites, and category/area/price filtering over server-rendered cards.
(function () {
  var DHK = window.__DHK__ || {};
  var geo = DHK.geofence || { lat: 28.5535, lng: 77.1945, radiusKm: 2.6 };
  function ls(k, v) { try { if (arguments.length > 1) { localStorage.setItem(k, v); return v; } return localStorage.getItem(k); } catch (e) { return null; } }

  function toRad(d) { return (d * Math.PI) / 180; }
  function distKm(la1, lo1, la2, lo2) {
    var R = 6371, dLa = toRad(la2 - la1), dLo = toRad(lo2 - lo1);
    var s = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(toRad(la1)) * Math.cos(toRad(la2)) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
  }
  function nowMin() { var n = new Date(); return n.getHours() * 60 + n.getMinutes(); }
  function openState(card) {
    var raw = card.getAttribute("data-open");
    if (!raw) return null;
    var ranges; try { ranges = JSON.parse(raw); } catch (e) { return null; }
    if (!ranges.length) return null;
    var m = nowMin();
    for (var i = 0; i < ranges.length; i++) {
      var o = ranges[i][0], c = ranges[i][1];
      if (m >= o && m < c) return true;
      if (m + 1440 >= o && m + 1440 < c) return true;
    }
    return false;
  }

  // ---------- favourites ----------
  function favs() { try { return JSON.parse(ls("dhk:favs") || "[]"); } catch (e) { return []; } }
  function toggleFav(slug) {
    var f = favs(), i = f.indexOf(slug);
    if (i >= 0) f.splice(i, 1); else f.push(slug);
    ls("dhk:favs", JSON.stringify(f));
    paintFavs(); updateSavedCount(); applyAll();
  }
  function paintFavs() {
    var f = favs();
    [].forEach.call(document.querySelectorAll(".fav"), function (b) {
      var on = f.indexOf(b.getAttribute("data-slug")) >= 0;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      b.setAttribute("aria-label", (on ? "Remove " : "Save ") + (b.getAttribute("data-name") || "place"));
    });
  }
  function updateSavedCount() {
    var n = favs().length;
    [].forEach.call(document.querySelectorAll("[data-saved-count]"), function (el) { el.textContent = n; });
  }

  // ---------- state ----------
  var S = { mode: ls("dhk:mode") || "local", coords: null, openOnly: false, nearOnly: false, savedOnly: false, cat: "", area: "", price: "" };
  try { var c = JSON.parse(ls("dhk:coords") || "null"); if (c && c.lat) S.coords = c; } catch (e) {}

  // ---------- filtering / sorting over server-rendered grids ----------
  function grids() { return [].slice.call(document.querySelectorAll("[data-listing-grid]")); }
  function cards(g) { return [].slice.call(g.querySelectorAll("article.card")); }

  function decorate(card) {
    // open-now + distance chips
    var flags = card.querySelector(".card-flags");
    if (!flags) return;
    var os = openState(card), bits = "";
    if (os === true) bits += '<span class="flag flag-open">\u25CF Open now</span>';
    else if (os === false) bits += '<span class="flag flag-closed">Closed now</span>';
    if (S.coords) {
      var la = parseFloat(card.getAttribute("data-lat")), lo = parseFloat(card.getAttribute("data-lng"));
      if (!isNaN(la) && !isNaN(lo)) {
        var d = distKm(S.coords.lat, S.coords.lng, la, lo);
        var txt = d < 1 ? Math.round(d * 1000) + " m" : d.toFixed(1) + " km";
        bits += '<span class="flag flag-dist">\u2316 ' + txt + " away</span>";
        card.setAttribute("data-dist", d.toFixed(4));
      }
    }
    flags.innerHTML = bits;
  }

  function applyAll() {
    var f = favs();
    [].forEach.call(document.querySelectorAll("article.card"), decorate);
    grids().forEach(function (g) {
      var cs = cards(g), shown = 0;
      cs.forEach(function (card) {
        var ok = true;
        if (S.openOnly && openState(card) !== true) ok = false;
        if (S.savedOnly && f.indexOf(card.getAttribute("data-slug")) < 0) ok = false;
        if (S.cat && card.getAttribute("data-cat") !== S.cat) ok = false;
        if (S.area && card.getAttribute("data-area") !== S.area) ok = false;
        if (S.price && String(card.getAttribute("data-price")) !== S.price) ok = false;
        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (S.nearOnly && S.coords) {
        var vis = cs.filter(function (c) { return c.style.display !== "none"; });
        vis.sort(function (a, b) { return (parseFloat(a.getAttribute("data-dist")) || 9999) - (parseFloat(b.getAttribute("data-dist")) || 9999); });
        vis.forEach(function (c) { g.appendChild(c); });
      }
      var cap = parseInt(g.getAttribute("data-cap") || "0", 10);
      if (cap > 0) {
        var vis2 = cs.filter(function (c) { return c.style.display !== "none"; });
        vis2.forEach(function (c, i) { if (i >= cap) c.style.display = "none"; });
        shown = Math.min(shown, cap);
      }
      var cnt = g.parentNode.querySelector("[data-grid-count]");
      if (cnt) cnt.textContent = shown;
      var empty = g.parentNode.querySelector(".near-empty");
      if (empty) empty.style.display = shown ? "none" : "block";
    });
    paintFavs();
  }

  // ---------- mode ----------
  function setMode(m, persist) {
    S.mode = m;
    document.body.setAttribute("data-mode", m);
    if (persist) ls("dhk:mode", m);
    [].forEach.call(document.querySelectorAll("[data-mode-btn]"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode-btn") === m ? "true" : "false");
    });
    [].forEach.call(document.querySelectorAll("[data-local][data-explore]"), function (el) {
      var v = el.getAttribute("data-" + m); if (v) el.textContent = v;
    });
  }
  function setLocMsg(html) { var el = document.getElementById("loc-msg"); if (el) el.innerHTML = html; }
  var PIN = '<svg viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/></svg>';

  function askLocation() {
    if (!navigator.geolocation) { setLocMsg(PIN + " Location isn't available on this device \u2014 use the toggle to explore."); return; }
    setLocMsg(PIN + " Getting your location\u2026");
    navigator.geolocation.getCurrentPosition(function (pos) {
      var la = pos.coords.latitude, lo = pos.coords.longitude;
      S.coords = { lat: la, lng: lo };
      ls("dhk:coords", JSON.stringify(S.coords));
      var d = distKm(la, lo, geo.lat, geo.lng);
      var inside = d <= geo.radiusKm;
      setMode(inside ? "local" : "explore", true);
      if (inside) setLocMsg(PIN + " You're in Hauz Khas \u2014 showing what's <strong>open near you</strong> first.");
      else setLocMsg(PIN + " You're about " + d.toFixed(1) + " km away \u2014 <strong>exploring</strong> mode. Switch to \u201cI\u2019m here\u201d anytime.");
      S.nearOnly = true;
      var nb = document.querySelector('[data-tgl="near"]'); if (nb) nb.setAttribute("aria-pressed", "true");
      applyAll();
    }, function () {
      setLocMsg(PIN + " Couldn't get your location \u2014 you can still browse, or use the toggle.");
    }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 });
  }

  // ---------- wire up ----------
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!t) {
      var fav = e.target.closest ? e.target.closest(".fav") : null;
      if (fav) { e.preventDefault(); toggleFav(fav.getAttribute("data-slug")); }
      return;
    }
    var act = t.getAttribute("data-act");
    if (act === "locate") askLocation();
    else if (act === "mode") { setMode(t.getAttribute("data-mode-btn"), true); applyAll(); }
    else if (act === "tgl") {
      var key = t.getAttribute("data-tgl");
      var map = { open: "openOnly", near: "nearOnly", saved: "savedOnly" };
      if (key === "near" && !S.coords) { askLocation(); }
      S[map[key]] = !S[map[key]];
      t.setAttribute("aria-pressed", S[map[key]] ? "true" : "false");
      applyAll();
    } else if (act === "clear") {
      S.openOnly = S.nearOnly = S.savedOnly = false; S.cat = S.area = S.price = "";
      [].forEach.call(document.querySelectorAll("[data-tgl]"), function (b) { b.setAttribute("aria-pressed", "false"); });
      [].forEach.call(document.querySelectorAll("[data-filter]"), function (s) { s.value = ""; });
      applyAll();
    }
  });
  document.addEventListener("change", function (e) {
    var s = e.target.closest ? e.target.closest("[data-filter]") : null;
    if (!s) return;
    S[s.getAttribute("data-filter")] = s.value;
    applyAll();
  });

  // ---------- live board: open-now count + clock ----------
  function updateLive() {
    var open = 0;
    [].forEach.call(document.querySelectorAll("article.card"), function (c) { if (openState(c) === true) open++; });
    [].forEach.call(document.querySelectorAll("[data-open-count]"), function (e) { e.textContent = open; });
    var n = new Date();
    var hh = ("0" + n.getHours()).slice(-2), mm = ("0" + n.getMinutes()).slice(-2);
    [].forEach.call(document.querySelectorAll("[data-clock]"), function (e) { e.textContent = hh + ":" + mm; });
  }

  // init
  setMode(S.mode, false);
  updateSavedCount();
  applyAll();
  updateLive();
  setInterval(updateLive, 30000);
  // Gentle prompt: if we've never asked and geolocation exists, invite (don't force).
  if (!ls("dhk:coords") && document.getElementById("loc-msg")) {
    setLocMsg(PIN + " In Hauz Khas right now? <button class=\"loc-btn\" data-act=\"locate\" style=\"margin-left:6px\">Use my location</button> to see what\u2019s open near you.");
  } else if (S.coords) {
    // returning visitor with saved coords: recompute status quietly
    var d0 = distKm(S.coords.lat, S.coords.lng, geo.lat, geo.lng);
    if (document.getElementById("loc-msg")) setLocMsg(PIN + (d0 <= geo.radiusKm ? " You're in Hauz Khas \u2014 showing what's <strong>open near you</strong>." : " Exploring Hauz Khas from " + d0.toFixed(1) + " km away."));
    applyAll();
  }
})();
`;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "dist");
const SITE = D.siteConfig.url.replace(/\/$/, "");
const abs = (p) => SITE + p;

// ---------- helpers ----------
const esc = (s = "") =>
  String(s)
    .replace(/—/g, ", ")
    .replace(/–/g, "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const money = (p) => "₹".repeat(p);
const k = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));
const cat = (slug) => D.getCategory(slug);

const pinSvg =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="2"/></svg>';

// ---------- consistent line-icon set (replaces emoji) ----------
const ICONS = {
  coffee: '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2a2 2 0 0 0 2-2V2"/><path d="M5 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/><path d="M21 15v7"/>',
  martini: '<path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8Z"/>',
  palette: '<circle cx="13.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r=".8" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r=".8" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r=".8" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16c3.3 0 6-2.7 6-6 0-4.9-4.5-8.7-10-8.7Z"/>',
  shirt: '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
  cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  star: '<path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
};
const icon = (name, cls = "") =>
  '<svg class="ic-svg ' + cls + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  (ICONS[name] || "") + "</svg>";
const CAT_ICON = {
  cafes: "coffee", restaurants: "utensils", "bars-nightlife": "martini",
  "art-galleries": "palette", boutiques: "shirt", "salons-spas": "scissors",
  fitness: "activity", coworking: "laptop", health: "cross", shopping: "bag",
};
const catIcon = (slug, cls = "") => icon(CAT_ICON[slug] || "pin", cls);

function stars(value, reviews) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  let s = '<span class="stars" role="img" aria-label="Rated ' + value + ' out of 5">';
  for (let i = 0; i < 5; i++) {
    const fill = i < full ? "#f59e0b" : i === full && half ? "url(#half)" : "#e2e8f0";
    s +=
      '<svg width="15" height="15" viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" fill="' +
      fill +
      '"/></svg>';
  }
  s += "</span>";
  const cnt = reviews != null ? '<span class="cnt">(' + k(reviews) + ")</span>" : "";
  return '<span class="rating">' + s + '<span class="val">' + value.toFixed(1) + "</span>" + cnt + "</span>";
}

const favicon =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#e23744"/><path d="M12 20s-5-4.4-5-8a5 5 0 1110 0c0 3.6-5 8-5 8z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="1.7" fill="#fff"/></svg>'
  );

// ---------- structured data (JSON-LD) ----------
const ldOrganization = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: D.siteConfig.name,
  url: SITE,
  email: D.siteConfig.email,
  description: D.siteConfig.description,
  areaServed: { "@type": "Place", name: "Hauz Khas, New Delhi" },
  sameAs: Object.values(D.siteConfig.social),
});
const ldWebsite = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: D.siteConfig.name,
  url: SITE,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: SITE + "/search/?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
});
const ldBreadcrumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: abs(it.path),
  })),
});
const ldLocalBusiness = (l) => {
  const c = cat(l.category);
  const o = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: l.name,
    image: l.image,
    url: abs("/place/" + l.slug + "/"),
    priceRange: money(l.price),
    address: {
      "@type": "PostalAddress",
      streetAddress: l.address,
      addressLocality: "Hauz Khas",
      addressRegion: "Delhi",
      postalCode: "110016",
      addressCountry: "IN",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: l.rating, reviewCount: l.reviews },
    hasMap: D.mapsUrl(l),
  };
  if (l.phoneVerified && l.phone) o.telephone = l.phone;
  if (l.hours) o.openingHours = l.hours;
  if (c) o.additionalType = c.name;
  return o;
};
const ldItemList = (list, c) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: c.name + " in Hauz Khas",
  numberOfItems: list.length,
  itemListElement: list.map((l, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: abs("/place/" + l.slug + "/"),
    name: l.name,
  })),
});
const ldArticle = (p) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: p.title,
  description: p.metaDescription,
  image: p.image,
  datePublished: p.date,
  dateModified: p.date,
  author: { "@type": "Organization", name: D.siteConfig.name },
  publisher: { "@type": "Organization", name: D.siteConfig.name, url: SITE },
  mainEntityOfPage: abs("/blog/" + p.slug + "/"),
});
const ldFaq = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

// ---------- shared layout ----------
function header() {
  const mega = D.categories
    .map(
      (c) =>
        '<a class="mega-item" href="/category/' +
        c.slug +
        '/"><span class="ic">' +
        catIcon(c.slug) +
        "</span><span><b>" +
        esc(c.name) +
        "</b><span>" +
        esc(c.blurb) +
        "</span></span></a>"
    )
    .join("");
  const mobileCats = D.categories
    .map((c) => '<a href="/category/' + c.slug + '/">' + catIcon(c.slug) + " " + esc(c.name) + "</a>")
    .join("");
  return `<header class="site-header"><div class="container header-inner">
  <a class="brand" href="/" aria-label="${esc(D.siteConfig.name)} home">
    <span class="brand-badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/></svg></span>
    <span class="brand-name">Discover <span class="accent">Hauz Khas</span></span>
  </a>
  <nav class="nav" aria-label="Primary">
    <a href="/">Home</a>
    <span class="has-menu"><a class="menu-trigger" href="/category/">Categories <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/></svg></a>
      <span class="mega"><span class="mega-inner">${mega}</span></span>
    </span>
    <a href="/blog/">Blog</a>
    <a href="/about/">About</a>
    <a href="/contact/">Contact</a>
  </nav>
  <span class="header-cta"><a class="btn btn-primary" href="/add-listing/">Add your business</a></span>
  <input type="checkbox" id="nav-toggle" aria-hidden="true">
  <label class="menu-btn" for="nav-toggle" aria-label="Toggle menu"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></label>
  <div class="mobile-nav"><a href="/">Home</a>${mobileCats}<a href="/blog/">Blog</a><a href="/about/">About</a><a href="/contact/">Contact</a><a class="btn btn-primary" href="/add-listing/">Add your business</a></div>
</div></header>`;
}

function footer() {
  const catLinks = D.categories
    .slice(0, 6)
    .map((c) => '<li><a href="/category/' + c.slug + '/">' + esc(c.name) + "</a></li>")
    .join("");
  const topLinks = D.getFeatured()
    .slice(0, 5)
    .map((l) => '<li><a href="/place/' + l.slug + '/">' + esc(l.name) + "</a></li>")
    .join("");
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-about">
      <a class="brand" href="/"><span class="brand-badge"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.4" fill="currentColor"/></svg></span><span class="brand-name" style="color:#fff">Discover <span class="accent">Hauz Khas</span></span></a>
      <p>${esc(D.siteConfig.description)}</p>
      <div class="newsletter">
        <h2>Get the Hauz Khas weekly</h2>
        <p style="color:#94a3b8;font-size:14px;margin-top:6px">New openings, offers and guides — straight to your inbox.</p>
        <form class="js-form"><input type="email" required placeholder="you@email.com" aria-label="Email address"><button class="btn btn-primary" type="submit">Subscribe</button></form>
        <p class="form-success" style="display:none;color:#fff;background:rgba(255,255,255,.1);padding:10px 14px;border-radius:10px;margin-top:10px;font-size:14px">You&#39;re on the list. Check your inbox to confirm.</p>
      </div>
    </div>
    <div><h2>Categories</h2><ul>${catLinks}</ul></div>
    <div><h2>Top Places</h2><ul>${topLinks}</ul></div>
    <div><h2>Company</h2><ul>
      <li><a href="/about/">About</a></li>
      <li><a href="/blog/">Blog &amp; Guides</a></li>
      <li><a href="/add-listing/">Add your business</a></li>
      <li><a href="/contact/">Contact</a></li>
      <li><a href="/privacy/">Privacy Policy</a></li>
    </ul></div>
  </div>
  <div class="footer-bottom"><div class="container">
    <p>© ${new Date().getFullYear()} ${esc(D.siteConfig.name)}. Made in New Delhi.</p>
    <span class="socials"><a href="${esc(D.siteConfig.social.instagram)}">Instagram</a><a href="${esc(D.siteConfig.social.facebook)}">Facebook</a><a href="${esc(D.siteConfig.social.twitter)}">Twitter</a></span>
  </div>
  <div class="container credit-row">Hero photo: Feroz Shah&#39;s Madrasa, Hauz Khas &middot; Wikimedia Commons (CC BY-SA)</div>
  </div>
</footer>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="half"><stop offset="50%" stop-color="#f59e0b"/><stop offset="50%" stop-color="#e2e8f0"/></linearGradient></defs></svg>
<script src="/app.js" defer></script>
<script src="/dhk.js" defer></script>`;
}

function layout({ title, description, canonical, jsonld = [], ogImage, extraHead = "", bodyEnd = "" }, content) {
  const ld = jsonld.map((o) => '<script type="application/ld+json">' + JSON.stringify(o) + "</script>").join("\n");
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="${esc(D.siteConfig.name)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(D.siteConfig.name)}">
<meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ""}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
${ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}">` : ""}
<meta name="theme-color" content="#7B2D6E">
<link rel="icon" href="${favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/dhk.css">
<script>window.__DHK__=${JSON.stringify({ geofence: GEOFENCE })};</script>
${extraHead}
${ld}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header()}
<main id="main">${content}</main>
${footer()}
${bodyEnd}
</body>
</html>`;
}

// ---------- reusable UI ----------
function searchBar() {
  const opts = D.categories.map((c) => '<option value="' + c.slug + '">' + esc(c.name) + "</option>").join("");
  return `<form class="searchbar" action="/search/" method="get" role="search" aria-label="Search Hauz Khas businesses">
  <div class="field">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:#64748b"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    <label for="q" class="sr-only">What are you looking for?</label>
    <input id="q" name="q" type="text" placeholder="Search cafés, bars, salons, coworking…">
  </div>
  <div class="field divider" style="flex:0 0 auto">
    <label for="category" class="sr-only">Category</label>
    <select id="category" name="category"><option value="">All categories</option>${opts}</select>
  </div>
  <button class="btn btn-primary" type="submit">Search</button>
</form>`;
}

const heartSvg =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20s-7-4.6-9.2-9C1.4 8 3 4.5 6.3 4.5c1.9 0 3.1 1 3.7 2 .6-1 1.8-2 3.7-2C17 4.5 18.6 8 21.2 11 19 15.4 12 20 12 20z"/></svg>';

function listingCard(l, priority = false) {
  const c = cat(l.category);
  const co = coordFor(l);
  const ranges = JSON.stringify(parseHoursRanges(l.hours));
  const data =
    `data-slug="${l.slug}" data-name="${esc(l.name)}" data-cat="${l.category}" data-area="${esc(l.area)}" ` +
    `data-price="${l.price}" data-rating="${l.rating}" data-lat="${co.lat}" data-lng="${co.lng}" ` +
    `data-everyday="${isEveryday(l.category) ? 1 : 0}" data-open='${ranges}'`;
  return `<article class="card" style="--cat:${catColor(l.category)}" ${data}>
  <div class="media ratio-43">
    <a href="/place/${l.slug}/"><img class="cover" src="${esc(l.image)}" alt="${esc(
    l.name + " — " + (c ? c.singular : "place") + " in " + l.area + ", Hauz Khas"
  )}" ${priority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} width="900" height="675"></a>
    <span class="tag-cat">${c ? catIcon(c.slug) : ""} ${c ? esc(c.singular) : ""}</span>
    <button class="fav" data-slug="${l.slug}" data-name="${esc(l.name)}" aria-pressed="false" aria-label="Save ${esc(l.name)}" type="button">${heartSvg}</button>
  </div>
  <div class="card-body">
    <div class="row-between"><h3 class="card-title"><a href="/place/${l.slug}/">${esc(l.name)}</a></h3><span class="price">${money(
    l.price
  )}</span></div>
    <p class="place-area">${pinSvg} ${esc(l.area)}</p>
    <div class="card-flags"></div>
    <p class="card-desc">${esc(l.short)}</p>
    <div class="row-between" style="margin-top:auto">${stars(l.rating, l.reviews)}<a class="view-link" href="/place/${l.slug}/">View →</a></div>
  </div>
</article>`;
}

// ---------- locator strip + filter toolbar (resident-utility controls) ----------
function locatorStrip() {
  return `<section class="locator" aria-label="Your location and view mode"><div class="container">
  <span class="loc-msg" id="loc-msg">${pinSvg} Detecting whether you're in Hauz Khas\u2026</span>
  <span class="spacer"></span>
  <span class="loc-actions">
    <span class="saved-pill">${heartSvg}<span data-saved-count>0</span> saved</span>
    <span class="mode-switch" role="group" aria-label="View mode">
      <button type="button" data-act="mode" data-mode-btn="local" aria-pressed="true">I'm here</button>
      <button type="button" data-act="mode" data-mode-btn="explore" aria-pressed="false">Exploring</button>
    </span>
  </span>
</div></section>`;
}

function filterToolbar({ area = false, category = false } = {}) {
  const clock =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  const near =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>';
  const heart = heartSvg;
  const areaSel = area
    ? `<select data-filter="area" aria-label="Filter by area"><option value="">All areas</option>${Object.keys(AREA_COORDS)
        .map((a) => `<option value="${esc(a)}">${esc(a)}</option>`)
        .join("")}</select>`
    : "";
  const catSel = category
    ? `<select data-filter="cat" aria-label="Filter by category"><option value="">All categories</option>${residentCategories()
        .map((c) => `<option value="${c.slug}">${esc(c.name)}</option>`)
        .join("")}</select>`
    : "";
  return `<div class="toolbar" role="group" aria-label="Filter listings">
  <button class="tgl" type="button" data-act="tgl" data-tgl="open" aria-pressed="false">${clock} Open now</button>
  <button class="tgl" type="button" data-act="tgl" data-tgl="near" aria-pressed="false">${near} Near me</button>
  <button class="tgl" type="button" data-act="tgl" data-tgl="saved" aria-pressed="false">${heart} Saved</button>
  ${catSel}${areaSel}
  <select data-filter="price" aria-label="Filter by price"><option value="">Any price</option><option value="1">₹</option><option value="2">₹₹</option><option value="3">₹₹₹</option><option value="4">₹₹₹₹</option></select>
  <button class="clearf" type="button" data-act="clear">Reset</button>
  <span class="count"><strong data-grid-count>0</strong> places</span>
</div>`;
}

function categoryTile(c) {
  const count = D.categoryCount(c.slug);
  return `<a class="cat-tile" style="--cat:${catColor(c.slug)}" href="/category/${c.slug}/">
  <div class="media ratio-45"><img class="cover" loading="lazy" src="${esc(c.image)}" alt="${esc(
    c.name + " in Hauz Khas"
  )}" width="800" height="1000"></div>
  <span class="overlay"></span>
  <span class="label"><span class="ic">${catIcon(c.slug)}</span><h3>${esc(c.name)}</h3><span>${count} ${
    count === 1 ? "place" : "places"
  }</span></span>
</a>`;
}

function breadcrumb(items) {
  const li = items
    .map((it, i) => {
      const last = i === items.length - 1;
      const sep = last ? "" : '<li class="sep" aria-hidden="true">/</li>';
      return last
        ? '<li aria-current="page">' + esc(it.name) + "</li>" + sep
        : '<li><a href="' + it.path + '">' + esc(it.name) + "</a></li>" + sep;
    })
    .join("");
  return '<nav class="breadcrumb" aria-label="Breadcrumb"><ol>' + li + "</ol></nav>";
}

// =====================================================================
// PAGES
// =====================================================================
function pageHome() {
  const heroImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Feroz_Shah%27s_Madrasa.JPG/1280px-Feroz_Shah%27s_Madrasa.JPG";
  const featured = D.getFeatured();
  const posts = D.blogPosts.slice(0, 3);
  const faqs = [
    { q: "What is Hauz Khas known for?", a: "Hauz Khas — and especially Hauz Khas Village — is known for its historic lake and fort ruins, contemporary art galleries, designer boutiques, and a dense cluster of cafés, rooftop bars and restaurants in South Delhi." },
    { q: "What are the best cafés and restaurants in Hauz Khas?", a: "Popular picks include Coast Café and The Tea Room for coffee, Yeti and Mia Bella for dining, and Hauz Khas Social for a rooftop bar with a lake view. Browse the full sortable list on Discover Hauz Khas." },
    { q: "Is Discover Hauz Khas free to use?", a: "Yes. Discover Hauz Khas is a free hyperlocal directory. Browse every café, restaurant, bar, salon, gym, coworking space and store by category with addresses, ratings and directions." },
  ];
  faqs.push({
    q: "How do I find what's open near me in Hauz Khas right now?",
    a: "Allow location on Discover Hauz Khas and turn on 'Open now' and 'Near me'. The directory sorts pharmacies, clinics, salons, gyms, coworking spaces, cafés and restaurants by how close they are and shows which are open at this moment, with one-tap call and directions.",
  });
  const stat = [
    { n: String(D.listings.length), l: "Local places" },
    { n: String(D.categories.length), l: "Everyday categories" },
    { n: "1 tap", l: "To call or get directions" },
  ];
  const services = residentCategories().filter((c) => isEveryday(c.slug));
  const goOut = residentCategories().filter((c) => !isEveryday(c.slug));
  // Diverse, lightweight pool for the homepage "open near you" grid:
  // up to 4 per everyday category (services first). Full lists live on category pages.
  const everydayListings = services.flatMap((c) => D.getListingsByCategory(c.slug).slice(0, 4));

  const content = `
${locatorStrip()}
<section class="hero">
  <div class="media"><img class="cover" src="${heroImg}" alt="Hauz Khas, New Delhi — the neighbourhood at golden hour" loading="eager" fetchpriority="high"></div>
  <div class="hero-overlay"></div>
  <div class="container hero-content">
    <p class="live-line"><span class="dot"></span><b data-open-count>—</b>&nbsp;open now near you&nbsp;·&nbsp;<span data-clock>--:--</span>&nbsp;· Hauz Khas, New Delhi</p>
    <h1>Everything around you in <span class="accent">Hauz Khas</span></h1>
    <p class="hero-sub" id="hero-sub"
       data-local="Live in Hauz Khas? Find what's open right now, near you — a chemist, a salon slot, a quiet desk, a late dinner — with live hours, distance and one-tap directions."
       data-explore="Coming to Hauz Khas? Explore the Village's cafés, rooftop bars, galleries and boutiques, plus the best-of guides locals swear by.">Live in Hauz Khas? Find what's open right now, near you — a chemist, a salon slot, a quiet desk, a late dinner — with live hours, distance and one-tap directions.</p>
    ${searchBar()}
    <div class="hero-chips">${services
      .concat(goOut.slice(0, 2))
      .slice(0, 6)
      .map((c) => '<a href="/category/' + c.slug + '/">' + catIcon(c.slug) + " " + esc(c.singular) + "</a>")
      .join("")}</div>
  </div>
</section>

<section class="container"><div class="stats">${stat
    .map((s) => '<div><p class="n">' + s.n + '</p><p class="l">' + s.l + "</p></div>")
    .join("")}</div></section>

<!-- ============ RESIDENT CORE: open now / near you ============ -->
<section class="section"><div class="container for-local-primary">
  <div class="section-head"><div><p class="eyebrow">Right now</p><h2 class="section-title">Open near you in Hauz Khas</h2><p class="lead">Everyday services first. Turn on <strong>Near me</strong> for distance, or <strong>Open now</strong> to hide anything that's shut.</p></div><a class="link-all" href="/category/">All categories →</a></div>
  ${filterToolbar({ category: true, area: true })}
  <div class="grid grid-3" data-listing-grid data-cap="9">${everydayListings.map((l, i) => listingCard(l, i < 3)).join("")}</div>
  <div class="near-empty"><p style="font-size:17px;font-weight:600">Nothing matches those filters right now.</p><p>Try turning off “Open now”, or reset the filters to see everything nearby.</p></div>
  <p class="mt-6"><a class="btn btn-ghost" href="/category/">Browse all ${D.listings.length} places →</a></p>
</div></section>

<!-- ============ Everyday services (resident) ============ -->
<section class="section soft"><div class="container">
  <div class="section-head center"><p class="eyebrow">Everyday</p><h2 class="section-title">Services that keep you going</h2><p class="lead">Chemists, clinics, salons, gyms, desks and stores — the things you actually need day to day in Hauz Khas.</p></div>
  <div class="grid grid-cats">${services.map(categoryTile).join("")}</div>
</div></section>

<!-- ============ Go out / explore ============ -->
<section class="section"><div class="container">
  <div class="section-head center"><p class="eyebrow">When you're free</p><h2 class="section-title">Eat, drink &amp; go out</h2><p class="lead">Cafés, restaurants, rooftop bars, galleries and boutiques around the corner — for a break or a night out.</p></div>
  <div class="grid grid-cats">${goOut.map(categoryTile).join("")}</div>
</div></section>

<!-- ============ Explore Hauz Khas (visitor value; highlighted in Exploring mode) ============ -->
<section class="section soft"><div class="container">
  <div class="section-head"><div><p class="eyebrow">Explore Hauz Khas</p><h2 class="section-title">Local favourites</h2></div><a class="link-all" href="/category/">Browse all →</a></div>
  <div class="grid grid-3">${featured.map((l) => listingCard(l)).join("")}</div>
</div></section>

<section class="section dark"><div class="container">
  <div class="section-head center"><p class="eyebrow">From your neighbours</p><h2 class="section-title">Why locals use it</h2></div>
  <div class="reviews">${D.reviews
    .map((r) => {
      const place = D.getListing(r.place);
      return (
        '<figure class="review">' +
        stars(r.rating) +
        "<blockquote>&ldquo;" +
        esc(r.text) +
        "&rdquo;</blockquote>" +
        '<figcaption><img src="' +
        esc(r.avatar) +
        '" alt="' +
        esc(r.name) +
        '" width="40" height="40" loading="lazy"><span class="who"><b>' +
        esc(r.name) +
        "</b>" +
        (place ? '<a href="/place/' + place.slug + '/">review for ' + esc(place.name) + "</a>" : "") +
        "</span></figcaption></figure>"
      );
    })
    .join("")}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head"><div><p class="eyebrow">Guides &amp; tips</p><h2 class="section-title">Get to know the neighbourhood</h2></div><a class="link-all" href="/blog/">All guides →</a></div>
  <div class="grid grid-3">${posts.map(blogCard).join("")}</div>
</div></section>

<section class="container" style="padding-bottom:80px"><div class="cta">
  <h2>Run a business in Hauz Khas?</h2>
  <p>List your shop, clinic, studio or service so neighbours find you when they search for exactly what you offer — with your hours, location and phone.</p>
  <a class="btn btn-white" href="/add-listing/">Add your business — it&#39;s free</a>
</div></section>`;

  return layout(
    {
      title: "Discover Hauz Khas — What's Open Near You in Hauz Khas",
      description: D.siteConfig.description,
      canonical: abs("/"),
      ogImage: heroImg,
      jsonld: [ldOrganization(), ldWebsite(), ldFaq(faqs)],
    },
    content
  );
}

function blogCard(p) {
  return `<article class="card">
  <a href="/blog/${p.slug}/"><div class="media ratio-1610"><img class="cover" loading="lazy" src="${esc(
    p.image
  )}" alt="${esc(p.title)}" width="1200" height="750"></div></a>
  <div class="card-body">
    <p style="color:var(--brand);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">${esc(
      p.category
    )} · ${p.readMins} min read</p>
    <h3 class="card-title" style="font-size:17px"><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3>
    <p class="card-desc">${esc(p.excerpt)}</p>
  </div>
</article>`;
}

function pageCategoryIndex() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/category/" },
  ];
  const content = `
<section class="page-hero"><div class="container">
  ${breadcrumb(crumbs)}
  <h1>Browse Hauz Khas by category</h1>
  <p class="lead">Ten curated categories covering the best of Hauz Khas — food and nightlife, art and shopping, plus the everyday services that keep the neighbourhood running.</p>
</div></section>
<section class="section"><div class="container">
  <div class="grid grid-cats">${D.categories.map(categoryTile).join("")}</div>
</div></section>`;
  return layout(
    {
      title: "All Categories — Browse Hauz Khas",
      description:
        "Browse every category on Discover Hauz Khas — cafés, restaurants, bars, art galleries, boutiques, salons, gyms, coworking, clinics and stores in Hauz Khas, New Delhi.",
      canonical: abs("/category/"),
      jsonld: [ldBreadcrumb(crumbs)],
    },
    content
  );
}

function pageCategory(c) {
  const list = D.getListingsByCategory(c.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/category/" },
    { name: c.name, path: "/category/" + c.slug + "/" },
  ];
  const others = D.categories.filter((x) => x.slug !== c.slug).slice(0, 6);
  const content = `
${locatorStrip()}
<section class="page-hero"><div class="container">
  ${breadcrumb(crumbs)}
  <h1>${esc(c.name)} in Hauz Khas</h1>
  <p class="lead">${esc(c.metaDescription)}</p>
</div></section>
<section class="section"><div class="container">
  <p style="color:#475569;max-width:760px;margin-bottom:20px">${esc(c.name)} in and around Hauz Khas, New Delhi — with live hours, distance from you, and one-tap call or directions. Turn on <strong>Open now</strong> or <strong>Near me</strong> to narrow it down.</p>
  ${filterToolbar({ area: true })}
  <div class="grid grid-3" data-listing-grid>${list.map((l, i) => listingCard(l, i < 3)).join("")}</div>
  <div class="near-empty"><p style="font-size:17px;font-weight:600">Nothing matches those filters.</p><p>Try turning off “Open now”, or reset to see all ${list.length} ${list.length === 1 ? "place" : "places"}.</p></div>

  <div style="margin-top:48px">
    <h2 class="section-title" style="font-size:22px;margin-bottom:16px">Explore more categories</h2>
    <div style="display:flex;flex-wrap:wrap;gap:10px">${others
      .map((o) => '<a class="chip" href="/category/' + o.slug + '/">' + catIcon(o.slug) + " " + esc(o.name) + "</a>")
      .join("")}</div>
  </div>
</div></section>`;
  return layout(
    {
      title: c.name + " in Hauz Khas — " + list.length + " Best Places",
      description: c.metaDescription,
      canonical: abs("/category/" + c.slug + "/"),
      ogImage: c.image,
      jsonld: [ldBreadcrumb(crumbs), ldItemList(list, c)],
    },
    content
  );
}

function pagePlace(l) {
  const c = cat(l.category);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: c.name, path: "/category/" + c.slug + "/" },
    { name: l.name, path: "/place/" + l.slug + "/" },
  ];
  const related = D.getListingsByCategory(l.category)
    .filter((x) => x.slug !== l.slug)
    .slice(0, 3);
  const phoneRow =
    l.phoneVerified && l.phone
      ? `<div class="info-row"><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5c0 8.3 6.7 15 15 15v-3.5l-4-1.5-2 2a12 12 0 01-6-6l2-2L7 5H4z" stroke="currentColor" stroke-width="1.8"/></svg></span><span><span class="k">Phone</span><span class="v"><a href="tel:${l.phone.replace(
          /\s/g,
          ""
        )}">${esc(l.phone)}</a> <span class="badge-verified">✓ verified</span></span></span></div>`
      : `<div class="info-row"><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5c0 8.3 6.7 15 15 15v-3.5l-4-1.5-2 2a12 12 0 01-6-6l2-2L7 5H4z" stroke="currentColor" stroke-width="1.8"/></svg></span><span><span class="k">Phone</span><span class="v"><a href="${esc(
          D.mapsUrl(l)
        )}" target="_blank" rel="noopener">Find contact on Google →</a></span></span></div>`;
  const content = `
<section class="page-hero"><div class="container">${breadcrumb(crumbs)}</div></section>
<section class="section" style="padding-top:36px"><div class="container">
  <div class="detail-grid">
    <div>
      <div class="detail-media media ratio-169"><img class="cover" src="${esc(l.image)}" alt="${esc(
    l.name + " — " + c.singular + " in " + l.area + ", Hauz Khas"
  )}" loading="eager" fetchpriority="high" width="1200" height="675"></div>
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-top:20px">
        <span class="tag-cat" style="position:static;background:var(--brand-light);color:var(--brand)">${catIcon(c.slug)} ${esc(
    c.name
  )}</span>
        ${stars(l.rating, l.reviews)}
        <span class="price">${money(l.price)}</span>
      </div>
      <h1 style="font-size:clamp(28px,4vw,40px);font-weight:800;margin-top:14px">${esc(l.name)}</h1>
      <p class="place-area" style="margin-top:8px">${pinSvg} ${esc(l.area)}, Hauz Khas, New Delhi</p>
      <p style="color:#334155;font-size:17px;line-height:1.75;margin-top:18px">${esc(l.description)}</p>
      <div class="detail-tags">${l.tags.map((t) => "<span>" + esc(t) + "</span>").join("")}</div>
    </div>
    <aside>
      <div class="info-card">
        <div class="place-actions">
          <a class="btn btn-primary" href="${esc(D.mapsUrl(l))}" target="_blank" rel="noopener">Directions</a>
          ${l.phone ? `<a class="btn btn-ghost" href="tel:${l.phone.replace(/\s/g, "")}">Call</a>` : ""}
          ${l.phone ? `<a class="btn btn-ghost" href="https://wa.me/${l.phone.replace(/[^0-9]/g, "")}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
        </div>
        <button class="btn btn-ghost fav" data-slug="${l.slug}" data-name="${esc(l.name)}" aria-pressed="false" type="button" style="position:static;width:100%;height:auto;margin-bottom:8px">${heartSvg} Save this place</button>
        <div class="info-row"><span class="ic">${pinSvg}</span><span><span class="k">Address</span><span class="v">${esc(
    l.address
  )}</span></span></div>
        ${phoneRow}
        ${
          l.hours
            ? `<div class="info-row"><span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span><span><span class="k">Hours</span><span class="v">${esc(
                l.hours
              )}</span></span></div>`
            : ""
        }
        <div class="info-row"><span class="ic">${icon("grid")}</span><span><span class="k">Category</span><span class="v"><a href="/category/${
    c.slug
  }/">${esc(c.name)}</a></span></span></div>
        ${
          !l.phoneVerified
            ? '<p class="verify-note" style="margin-top:10px">Phone number to be verified from the official Google listing.</p>'
            : ""
        }
      </div>
    </aside>
  </div>

  <div class="map-embed">
    <div class="map-head">${icon("pin")} Find ${esc(l.name)} on the map</div>
    <iframe title="Map of ${esc(l.name)} in Hauz Khas" src="https://www.google.com/maps?q=${encodeURIComponent(
    l.name + ", " + l.address
  )}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
  </div>

  ${
    related.length
      ? `<div style="margin-top:56px"><h2 class="section-title" style="font-size:24px;margin-bottom:20px">More ${esc(
          c.name.toLowerCase()
        )} in Hauz Khas</h2><div class="grid grid-3">${related.map((r) => listingCard(r)).join("")}</div></div>`
      : ""
  }
</div></section>`;
  return layout(
    {
      title: l.name + " — " + c.singular + " in " + l.area + ", Hauz Khas",
      description:
        l.short + " " + l.name + " in " + l.area + ", Hauz Khas — rating " + l.rating + "★, address, timings and directions.",
      canonical: abs("/place/" + l.slug + "/"),
      ogImage: l.image,
      jsonld: [ldBreadcrumb(crumbs), ldLocalBusiness(l)],
    },
    content
  );
}

function pageBlogIndex() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
  ];
  const content = `
<section class="page-hero"><div class="container">${breadcrumb(crumbs)}
  <h1>Hauz Khas guides &amp; tips</h1>
  <p class="lead">Local guides to eating, drinking, working and wandering in Hauz Khas — written to help you make the most of the neighbourhood.</p>
</div></section>
<section class="section"><div class="container"><div class="grid grid-3">${D.blogPosts
    .map(blogCard)
    .join("")}</div></div></section>`;
  return layout(
    {
      title: "Blog — Hauz Khas Guides & Tips",
      description:
        "Local guides to Hauz Khas — the best cafés, nightlife, coworking spaces and things to do, written by Discover Hauz Khas.",
      canonical: abs("/blog/"),
      jsonld: [ldBreadcrumb(crumbs)],
    },
    content
  );
}

function pageBlogPost(p) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
    { name: p.title, path: "/blog/" + p.slug + "/" },
  ];
  const rc = p.relatedCategory ? cat(p.relatedCategory) : null;
  const bodyHtml = p.body
    .map((b) => (b.type === "h2" ? "<h2>" + esc(b.text) + "</h2>" : "<p>" + esc(b.text) + "</p>"))
    .join("");
  const dateStr = new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const content = `
<section class="page-hero"><div class="container">${breadcrumb(crumbs)}
  <h1 style="max-width:820px">${esc(p.title)}</h1>
  <p class="post-meta" style="margin-top:12px">${esc(p.category)} · ${p.readMins} min read · ${dateStr}</p>
</div></section>
<section class="section"><div class="container">
  <div class="detail-media media ratio-169" style="max-width:900px;margin:0 auto 34px"><img class="cover" src="${esc(
    p.image
  )}" alt="${esc(p.title)}" loading="eager" width="1200" height="675"></div>
  <article class="prose">
    ${bodyHtml}
    ${
      rc
        ? '<p style="background:var(--soft);border:1px solid var(--line);border-radius:14px;padding:16px 18px;font-size:15px"><strong>Explore next:</strong> browse all <a href="/category/' +
          rc.slug +
          '/">' +
          esc(rc.name.toLowerCase()) +
          " in Hauz Khas</a>.</p>"
        : ""
    }
    <p style="margin-top:28px"><a class="btn btn-ghost" href="/blog/">← All guides</a></p>
  </article>
</div></section>`;
  return layout(
    {
      title: p.title,
      description: p.metaDescription,
      canonical: abs("/blog/" + p.slug + "/"),
      ogImage: p.image,
      jsonld: [ldBreadcrumb(crumbs), ldArticle(p)],
    },
    content
  );
}

function simplePage({ slug, h1, lead, bodyHtml, title, description, crumbsName }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: crumbsName, path: "/" + slug + "/" },
  ];
  const content = `
<section class="page-hero"><div class="container">${breadcrumb(crumbs)}
  <h1>${esc(h1)}</h1>
  ${lead ? '<p class="lead">' + esc(lead) + "</p>" : ""}
</div></section>
<section class="section"><div class="container">${bodyHtml}</div></section>`;
  return layout(
    { title, description, canonical: abs("/" + slug + "/"), jsonld: [ldBreadcrumb(crumbs)] },
    content
  );
}

function pageAbout() {
  const body = `<div class="prose" style="max-width:760px">
  <p>Discover Hauz Khas is a hyperlocal directory dedicated to one of Delhi&#39;s most loved neighbourhoods. From the 14th-century lake and fort ruins to the winding lanes packed with cafés, rooftop bars, art galleries and designer boutiques, Hauz Khas has more going on per square metre than almost anywhere in the city — and it can be hard to keep track of.</p>
  <h2>Why we built this</h2>
  <p>Existing listings for Hauz Khas are scattered across generic city-wide apps that bury the neighbourhood&#39;s best spots under ads and irrelevant results. We wanted a single, fast, mobile-friendly place that covers Hauz Khas properly — not just the famous restaurants, but the everyday services locals actually need: salons, gyms, coworking spaces, clinics, pharmacies and stores.</p>
  <h2>What you&#39;ll find</h2>
  <p>Every listing is organised into ten clear categories with ratings, price levels, timings, tags and the exact address with one-tap Google Maps directions. Our guides go deeper, mapping out the best cafés, nightlife and work spots so you can plan a morning, an evening or a whole day.</p>
  <h2>For businesses</h2>
  <p>If you run a business in Hauz Khas, you can <a href="/add-listing/">add your listing</a> for free and reach locals and visitors searching for exactly what you offer.</p>
</div>`;
  return simplePage({
    slug: "about",
    crumbsName: "About",
    h1: "About Discover Hauz Khas",
    lead: "The hyperlocal directory for Hauz Khas, New Delhi.",
    bodyHtml: body,
    title: "About — Discover Hauz Khas",
    description:
      "About Discover Hauz Khas — a hyperlocal directory covering cafés, restaurants, bars, boutiques, salons, fitness, coworking and services in Hauz Khas, New Delhi.",
  });
}

function pageContact() {
  const body = `<div style="display:grid;gap:40px;grid-template-columns:1fr" >
  <div>
    <div style="position:relative">
      <form class="js-form form">
        <div class="two"><div><label for="cname">Name</label><input id="cname" name="name" required></div><div><label for="cemail">Email</label><input id="cemail" type="email" name="email" required></div></div>
        <div><label for="cmsg">Message</label><textarea id="cmsg" name="message" rows="5" required></textarea></div>
        <button class="btn btn-primary" type="submit" style="justify-self:start">Send message</button>
      </form>
      <p class="form-success note" style="display:none">Thanks! Your message has been noted. We&#39;ll get back to you at the email you provided.</p>
    </div>
    <p style="color:var(--muted);font-size:14px;margin-top:16px">Prefer email? Write to <a href="mailto:${esc(
      D.siteConfig.email
    )}" style="color:var(--brand)">${esc(D.siteConfig.email)}</a>.</p>
  </div>
</div>`;
  return simplePage({
    slug: "contact",
    crumbsName: "Contact",
    h1: "Contact us",
    lead: "Questions, corrections or partnership ideas? We&#39;d love to hear from you.",
    bodyHtml: body,
    title: "Contact — Discover Hauz Khas",
    description: "Get in touch with Discover Hauz Khas — questions, listing corrections or partnership ideas.",
  });
}

function pageAddListing() {
  const opts = D.categories.map((c) => '<option value="' + esc(c.name) + '">' + esc(c.name) + "</option>").join("");
  const body = `<div style="position:relative;max-width:640px">
  <div class="note" style="background:var(--brand-light);border-color:#f7d4d6;color:#9b2c34;margin-bottom:20px">Listing on Discover Hauz Khas is <strong>100% free</strong>. Tell us about your business and we&#39;ll add it to the directory.</div>
  <form class="js-form form">
    <div><label for="bname">Business name</label><input id="bname" name="business" required></div>
    <div class="two"><div><label for="bcat">Category</label><select id="bcat" name="category">${opts}</select></div><div><label for="bphone">Phone</label><input id="bphone" name="phone" placeholder="+91 …"></div></div>
    <div><label for="baddr">Address</label><input id="baddr" name="address" placeholder="Shop / floor, market, Hauz Khas" required></div>
    <div class="two"><div><label for="bweb">Website / Instagram</label><input id="bweb" name="website"></div><div><label for="bemail">Your email</label><input id="bemail" type="email" name="email" required></div></div>
    <div><label for="bdesc">Short description</label><textarea id="bdesc" name="description" rows="4"></textarea></div>
    <button class="btn btn-primary" type="submit" style="justify-self:start">Submit listing</button>
  </form>
  <p class="form-success note" style="display:none;background:#ecfdf5;border-color:#a7f3d0;color:#065f46">Thanks! Your business has been submitted for review. We&#39;ll email you once it&#39;s live.</p>
</div>`;
  return simplePage({
    slug: "add-listing",
    crumbsName: "Add your business",
    h1: "Add your business",
    lead: "Reach locals and visitors searching for places in Hauz Khas — for free.",
    bodyHtml: body,
    title: "Add your business — Discover Hauz Khas",
    description: "List your Hauz Khas business for free on Discover Hauz Khas and reach locals searching for what you offer.",
  });
}

function pagePrivacy() {
  const body = `<div class="prose" style="max-width:760px">
  <p>This Privacy Policy explains how Discover Hauz Khas (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles information when you use this website. This is a student-built local directory created for educational purposes.</p>
  <h2>Information we collect</h2>
  <p>We only collect information you choose to give us — for example, your email address when you subscribe to our newsletter, or the details you submit through the contact and &ldquo;add your business&rdquo; forms.</p>
  <h2>How we use it</h2>
  <p>We use your email to send the newsletter you signed up for, and form submissions to respond to your request or review a business listing. We do not sell your personal data.</p>
  <h2>Cookies &amp; analytics</h2>
  <p>We may use privacy-friendly analytics to understand which pages are popular so we can improve the directory. You can block cookies in your browser settings at any time.</p>
  <h2>Third-party links</h2>
  <p>Listings link out to Google Maps and business websites. Those third parties have their own privacy policies, which we don&#39;t control.</p>
  <h2>Contact</h2>
  <p>Questions about this policy? Email <a href="mailto:${esc(D.siteConfig.email)}">${esc(D.siteConfig.email)}</a>.</p>
</div>`;
  return simplePage({
    slug: "privacy",
    crumbsName: "Privacy",
    h1: "Privacy Policy",
    lead: "",
    bodyHtml: body,
    title: "Privacy Policy — Discover Hauz Khas",
    description: "How Discover Hauz Khas handles your information — newsletter emails, form submissions, cookies and third-party links.",
  });
}

function pageSearch() {
  const index = D.listings.map((l) => {
    const c = cat(l.category);
    return {
      slug: l.slug,
      name: l.name,
      category: l.category,
      categoryName: c.name,
      categorySingular: c.singular,
      icon: catIcon(l.category),
      area: l.area,
      tags: l.tags,
      short: l.short,
      image: l.image,
      rating: l.rating,
      reviews: l.reviews,
      price: l.price,
    };
  });
  const catNames = Object.fromEntries(D.categories.map((c) => [c.slug, c.name]));
  const content = `
<section class="page-hero"><div class="container">
  ${breadcrumb([{ name: "Home", path: "/" }, { name: "Search", path: "/search/" }])}
  <h1>Search results</h1>
  <p class="lead"><span id="search-count">0</span> results for <strong id="search-term">…</strong> in Hauz Khas.</p>
  <div style="max-width:660px;margin-top:18px">${searchBar()}</div>
</div></section>
<section class="section"><div class="container">
  <div id="search-results" class="grid grid-3"></div>
  <div id="search-empty" class="result-empty" style="display:none">
    <p style="font-size:18px;font-weight:600">No matches found.</p>
    <p>Try a different keyword, or <a href="/category/" style="color:var(--brand)">browse all categories</a>.</p>
  </div>
</div></section>`;
  return layout(
    {
      title: "Search — Discover Hauz Khas",
      description: "Search cafés, restaurants, bars, salons, gyms, coworking and stores across Hauz Khas, New Delhi.",
      canonical: abs("/search/"),
      extraHead: '<meta name="robots" content="noindex, follow">',
      jsonld: [],
      bodyEnd:
        "<script>window.__LISTINGS__=" +
        JSON.stringify(index) +
        ";window.__CATNAMES__=" +
        JSON.stringify(catNames) +
        ';</script><script src="/search.js" defer></script>',
    },
    content
  );
}

function page404() {
  const content = `<section class="section" style="text-align:center;padding:100px 0"><div class="container">
  <p class="eyebrow">404</p>
  <h1 class="section-title" style="margin-top:10px">This page wandered off into the Village</h1>
  <p style="color:var(--muted);margin-top:12px">The page you&#39;re looking for doesn&#39;t exist. Let&#39;s get you back on track.</p>
  <p style="margin-top:24px"><a class="btn btn-primary" href="/">Back to home</a> <a class="btn btn-ghost" href="/category/">Browse categories</a></p>
</div></section>`;
  return layout(
    {
      title: "Page not found — Discover Hauz Khas",
      description: "The page you were looking for could not be found.",
      canonical: abs("/404/"),
      extraHead: '<meta name="robots" content="noindex">',
    },
    content
  );
}

// ---------- sitemap & robots ----------
function sitemap() {
  const urls = ["/", "/category/", "/blog/", "/about/", "/contact/", "/add-listing/", "/privacy/"];
  D.categories.forEach((c) => urls.push("/category/" + c.slug + "/"));
  D.listings.forEach((l) => urls.push("/place/" + l.slug + "/"));
  D.blogPosts.forEach((p) => urls.push("/blog/" + p.slug + "/"));
  const today = new Date().toISOString().slice(0, 10);
  const body = urls
    .map((u) => {
      const pr = u === "/" ? "1.0" : u.startsWith("/place/") || u.startsWith("/category/") ? "0.8" : "0.6";
      return `  <url><loc>${abs(u)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${pr}</priority></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
function robots() {
  return `User-agent: *\nAllow: /\nDisallow: /search/\n\nSitemap: ${abs("/sitemap.xml")}\n`;
}

// =====================================================================
// WRITE
// =====================================================================
function writePage(routePath, html) {
  const rel = routePath === "/" ? "index.html" : routePath.replace(/^\/|\/$/g, "") + "/index.html";
  const file = join(OUT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  return rel;
}

function run() {
  // Clean previous build contents (best-effort; some mounts block rmdir of OUT itself).
  mkdirSync(OUT, { recursive: true });
  try {
    for (const entry of readdirSync(OUT)) {
      try { rmSync(join(OUT, entry), { recursive: true, force: true }); } catch {}
    }
  } catch {}

  let n = 0;
  const w = (p, h) => {
    writePage(p, h);
    n++;
  };

  w("/", pageHome());
  w("/category/", pageCategoryIndex());
  D.categories.forEach((c) => w("/category/" + c.slug + "/", pageCategory(c)));
  D.listings.forEach((l) => w("/place/" + l.slug + "/", pagePlace(l)));
  w("/blog/", pageBlogIndex());
  D.blogPosts.forEach((p) => w("/blog/" + p.slug + "/", pageBlogPost(p)));
  w("/about/", pageAbout());
  w("/contact/", pageContact());
  w("/add-listing/", pageAddListing());
  w("/privacy/", pagePrivacy());
  w("/search/", pageSearch());

  // 404 at dist/404.html (Vercel serves this for unknown routes)
  writeFileSync(join(OUT, "404.html"), page404());
  n++;

  // static assets (write-based copy; robust on mounts that block unlink)
  for (const f of ["styles.css", "app.js", "search.js", "dhk.css", "dhk.js"]) {
    writeFileSync(join(OUT, f), __ASSETS[f]);
  }

  // sitemap + robots
  writeFileSync(join(OUT, "sitemap.xml"), sitemap());
  writeFileSync(join(OUT, "robots.txt"), robots());

  console.log("✓ Built " + n + " pages + sitemap.xml + robots.txt into /dist");
  console.log("  Categories: " + D.categories.length + " | Listings: " + D.listings.length + " | Posts: " + D.blogPosts.length);
}

run();
