/**
 * ============================================================
 *  LOCAL BUSINESS PROFILE — CONFIGURATION FILE
 *  Edit ONLY this file to customise the entire template.
 *  No need to touch HTML, CSS, or other JS files.
 * ============================================================
 */

const CONFIG = {

  /* ----------------------------------------------------------
   *  1. BRAND & BUSINESS INFO
   * ---------------------------------------------------------- */
  business: {
    name:        "Caltex Sungai Besi",
    category:    "Petrol Station",
    tagline:     "Open 24 Hours · Serving You Around the Clock",
    rating:      "5.0",
    reviewCount: "1,900+",
    phone:       "03-8953 9800",
    address:     "Kuala Lumpur–Seremban Expressway, 57000 Kuala Lumpur, Wilayah Persekutuan",
    hours:       "Open 24 Hours",
    website:     "https://www.caltex.com",       // leave "" to hide button
    whatsapp:    "",                              // e.g. "60123456789" or leave ""
    mapEmbed:    "https://maps.google.com/?q=Caltex+Sungai+Besi+Kuala+Lumpur",
    wazeLat:     "3.0499558",
    wazeLng:     "101.7057032",
    wazeName:    "Caltex Sungai Besi",
    facebookPage: "https://www.facebook.com/profile.php?id=61556722739879",
    instagram:    "https://www.instagram.com/caltex.sg.besi/",
    tiktok:       "https://www.tiktok.com/@caltex.sg.besi",
  },

  /* ----------------------------------------------------------
   *  2. THEME — Light / Dark + Accent Color
   * ---------------------------------------------------------- */
  theme: {
    mode:        "light",      // "light" | "dark"
    accent:      "#E31837",    // Primary / brand color (Caltex red)
    accentText:  "#FFFFFF",    // Text on accent background
    /*
     *  Override any CSS variable below (optional).
     *  Leave empty object {} to use defaults derived from mode + accent.
     */
    overrides: {
      // "--color-surface": "#1a1a1a",
      // "--font-body": "'Inter', sans-serif",
    },
  },

  /* ----------------------------------------------------------
   *  3. CLOUDINARY — Image delivery
   * ---------------------------------------------------------- */
  cloudinary: {
    cloud:       "dvnmu1cqd",   // Your Cloudinary cloud name
    quality:     "auto",        // auto | 80 | 60 …
    format:      "auto",        // auto | webp | jpg …
    /*
     *  List image public IDs (in Cloudinary).
     *  The first image is the hero / OG image.
     *  Use full URL if image is NOT on Cloudinary (starts with https://).
     */
    images: [
      { id: "samples/landscapes/nature-mountains", caption: "Caltex Sungai Besi — Main Forecourt" },
      { id: "samples/landscapes/architecture-signs", caption: "Full-Service Pump Area" },
      { id: "samples/food/dessert-on-a-plate", caption: "StarMart Convenience Store" },
      { id: "samples/people/smiling-man",      caption: "Friendly Service, Every Visit" },
    ],
    /*
     *  Carousel image dimensions (pixels)
     *  Width: keep at 720 (max-width of template). Height: adjust to taste.
     */
    imgWidth:  720,
    imgHeight: 400,
  },

  /* ----------------------------------------------------------
   *  4. ACTION BUTTONS
   *  Each button triggers FB, GA4, and Google Ads events.
   *  Set visible: false to hide a button.
   * ---------------------------------------------------------- */
  buttons: [
    {
      id:      "btn_directions",
      label:   "Get Directions",
      icon:    "fa-solid fa-diamond-turn-right",
      action:  "directions",   // "directions" | "call" | "share" | "save" | "whatsapp" | "website" | "facebook"
      visible:  true,
    },
    {
      id:      "btn_call",
      label:   "Call Now",
      icon:    "fa-solid fa-phone",
      action:  "call",
      visible:  true,
    },
    {
      id:      "btn_whatsapp",
      label:   "WhatsApp",
      icon:    "fa-brands fa-whatsapp",
      action:  "whatsapp",
      visible:  false,         // set true if whatsapp number is filled above
    },
    {
      id:      "btn_website",
      label:   "Website",
      icon:    "fa-solid fa-globe",
      action:  "website",
      visible:  true,
    },
    {
      id:      "btn_facebook",
      label:   "Facebook",
      icon:    "fa-brands fa-facebook",
      action:  "facebook",
      visible:  true,
    },
    {
      id:      "btn_save",
      label:   "Save",
      icon:    "fa-solid fa-bookmark",
      action:  "save",
      visible:  true,
    },
  ],

  /* ----------------------------------------------------------
   *  5. SERVICE HIGHLIGHTS — shown in the Services tab
   *  Each card: 16:9 image (Cloudinary public ID) + title + description.
   *  Leave imageId: "" to show a plain colour placeholder.
   * ---------------------------------------------------------- */
  highlights: [
    {
      imageId:     "samples/landscapes/architecture-signs",
      title:       "Spacious & Comfortable Surau",
      description: "Perform your prayers in peace before continuing your journey. Our surau is well-maintained, air-conditioned, and open 24 hours.",
    },
    {
      imageId:     "samples/food/dessert-on-a-plate",
      title:       "Refresh & Restock for the Journey",
      description: "Coffee Bean and Family Mart on-site — grab a hot drink, snacks, and everything you need before hitting the highway.",
    },
    {
      imageId:     "samples/landscapes/nature-mountains",
      title:       "Clean & Well-Maintained Toilets",
      description: "Our restrooms are cleaned regularly and consistently rated among the best on this route. Travel in comfort.",
    },
    {
      imageId:     "samples/people/smiling-man",
      title:       "Full Pump Service",
      description: "Stay in your car while our friendly team fills up your tank and cleans your windscreen — completely free of charge.",
    },
  ],

  /* ----------------------------------------------------------
   *  6. SERVICES / HIGHLIGHTS (legacy chips — kept for reference)
   * ---------------------------------------------------------- */
  services: [
    "Ron 95 · Ron 97 · Diesel",
    "StarMart 24/7",
    "ATM Available",
    "Air & Water Station",
    "Caltex Techron",
    "Fleet Card Accepted",
  ],

  /* ----------------------------------------------------------
   *  6. REVIEWS — show up to 3 featured reviews
   * ---------------------------------------------------------- */
  reviews: [
    { name: "Ahmad Faris", rating: 5, text: "Stesen minyak paling bersih kat kawasan ni. Staffnya peramah, toilet pun terjaga.", time: "2 minggu lalu" },
    { name: "Priya R.",    rating: 5, text: "Best petrol station on the highway. Open 24 hours, very clean and well maintained.", time: "1 bulan lalu" },
    { name: "Kevin Lim",   rating: 5, text: "StarMart is great, good selection of food and drinks. Pumps are fast and never broken.", time: "3 minggu lalu" },
  ],

  /* ----------------------------------------------------------
   *  7. TRACKING — Facebook Pixel, Google Analytics, Google Ads
   * ---------------------------------------------------------- */
  tracking: {

    facebook: {
      pixelId:   "803316744716557",   // Your FB Pixel ID
      /*
       *  Map each button action to a Facebook Standard Event.
       *  Standard events: Contact, FindLocation, Schedule, Lead, etc.
       */
      events: {
        directions: { event: "FindLocation",  params: { content_name: "Get Directions" } },
        call:       { event: "Contact",       params: { content_name: "Call Now" } },
        whatsapp:   { event: "Contact",       params: { content_name: "WhatsApp" } },
        website:    { event: "ViewContent",   params: { content_name: "Visit Website" } },
        facebook:   { event: "ViewContent",   params: { content_name: "Facebook Page" } },
        save:       { event: "CustomizeProduct", params: { content_name: "Save Listing" } },
        carousel:     { event: "ViewContent",     params: { content_name: "Image Carousel"    } },
        promo_banner: { event: "ViewContent",     params: { content_name: "Promo Banner Click"} },
        promo_lead:   { event: "Lead",            params: { content_name: "Promo Lead Form"   } },
        pageview:     { event: "PageView",        params: {} },
      },
    },

    googleAnalytics: {
      measurementId: "G-XXXXXXXXXX",    // e.g. G-ABC123XYZ
      events: {
        directions: { name: "generate_lead",    params: { event_category: "engagement", event_label: "directions" } },
        call:       { name: "generate_lead",    params: { event_category: "engagement", event_label: "call" } },
        whatsapp:   { name: "generate_lead",    params: { event_category: "engagement", event_label: "whatsapp" } },
        website:    { name: "select_content",   params: { event_category: "engagement", event_label: "website" } },
        facebook:   { name: "select_content",   params: { event_category: "engagement", event_label: "facebook" } },
        save:       { name: "save_listing",     params: { event_category: "engagement", event_label: "save" } },
        carousel:     { name: "view_item",        params: { event_category: "engagement", event_label: "carousel_swipe" } },
        promo_banner: { name: "select_promotion", params: { event_category: "promotion",  event_label: "banner_click"    } },
        promo_lead:   { name: "generate_lead",    params: { event_category: "promotion",  event_label: "form_submit"     } },
        pageview:     { name: "page_view",        params: {} },
      },
    },

    googleAds: {
      conversionId: "AW-XXXXXXXXX",    // e.g. AW-123456789
      /*
       *  Map each action to a Google Ads conversion label.
       *  Get labels from: Google Ads > Goals > Conversions > Edit conversion action.
       */
      conversions: {
        directions: { label: "LABEL_DIRECTIONS" },
        call:       { label: "LABEL_CALL" },
        whatsapp:   { label: "LABEL_WHATSAPP" },
        website:    { label: "LABEL_WEBSITE" },
        facebook:     null,   // null = no Google Ads conversion for this action
        save:         null,
        carousel:     null,
        promo_banner: null,
        promo_lead:   { label: "LABEL_PROMO_LEAD" },
      },
    },

  },

  /* ----------------------------------------------------------
   *  8. PROMOTION BANNER + LEAD FORM
   * ---------------------------------------------------------- */
  promotion: {
    /*
     *  Set enabled: false to completely hide the promotion module.
     */
    enabled:     true,

    /*
     *  Banner image — Cloudinary public ID or full URL.
     *  Ratio: 4:3 (e.g. 720 × 540 px recommended).
     *  Leave imageId: "" to use a CSS-only gradient banner instead.
     */
    imageId:     "caltex-cbtl_avfszi",   // Cloudinary public ID — loaded as WebP 4:3
    imageAlt:    "Promosi Eksklusif — Dapatkan Tawaran Istimewa",

    /*
     *  Text overlay on the banner (shown when imageId is "").
     *  If imageId is set, these are hidden (your image carries the message).
     */
    badge:       "TAWARAN TERHAD",
    headline:    "Dapatkan Promosi\nEksklusif Kami",
    subtext:     "Daftar sekarang dan nikmati diskaun istimewa untuk pelanggan baru.",

    /*
     *  Modal / Lead Form copy
     */
    modalTitle:  "Tuntut Promosi Anda",
    modalDesc:   "Isi maklumat di bawah. Kami akan hubungi anda dalam masa 24 jam.",
    buttonLabel: "Get Promotion",   // CTA button text inside modal

    /*
     *  Form fields — set required: false to make optional
     */
    fields: {
      name:  { label: "Nama Penuh",    placeholder: "Contoh: Ahmad Faris", required: true  },
      phone: { label: "No. Telefon",   placeholder: "0123456789",          required: true  },
      email: { label: "E-mel",         placeholder: "email@anda.com",      required: false },
    },

    /*
     *  Success message after form submission
     */
    successTitle:   "Terima kasih!",
    successMessage: "Kami akan menghubungi anda dalam masa 24 jam. Semak WhatsApp anda.",

    /*
     *  Webhook — Google Apps Script Web App URL
     *  Deploy your Apps Script as a Web App (Anyone, even anonymous)
     *  and paste the URL here.
     *  Leave webhookUrl: "" to skip webhook (data just fires tracking events).
     */
    webhookUrl:  "",   // e.g. "https://script.google.com/macros/s/YOUR_ID/exec"

    /*
     *  Tracking events for promotion interactions
     */
    tracking: {
      facebook: {
        bannerClick: { event: "ViewContent",  params: { content_name: "Promo Banner Click" } },
        formSubmit:  { event: "Lead",         params: { content_name: "Promo Lead Form"   } },
      },
      googleAnalytics: {
        bannerClick: { name: "select_promotion", params: { event_category: "promotion", event_label: "banner_click" } },
        formSubmit:  { name: "generate_lead",    params: { event_category: "promotion", event_label: "form_submit"  } },
      },
      googleAds: {
        formSubmit: { label: "LABEL_PROMO_LEAD" },  // set null to skip
      },
    },
  },

  /* ----------------------------------------------------------
   *  9. SEO / META TAGS
   * ---------------------------------------------------------- */
  seo: {
    title:       "Caltex Sungai Besi — Petrol Station Open 24 Hours",
    description: "Caltex Sungai Besi di Lebuhraya KL-Seremban. Terbuka 24 jam, StarMart, ATM, dan perkhidmatan minyak premium.",
    ogImage:     "",   // leave "" to auto-use first Cloudinary image
    canonical:   "",   // leave "" to skip
    locale:      "ms_MY",
  },

};

/* ── Do not edit below this line ── */
if (typeof module !== "undefined") module.exports = CONFIG;
