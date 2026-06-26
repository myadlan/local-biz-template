# Local Business Profile Template
### Google Business Profile-style mobile web page

---

## File Structure

```
local-biz-template/
├── index.html      ← Template shell (do not edit)
├── style.css       ← All CSS with CSS variable theming
├── config.js       ← ★ EDIT THIS FILE ONLY
├── tracker.js      ← FB Pixel + GA4 + Google Ads logic
└── app.js          ← Carousel, lazy load, UI render
```

---

## Quick Setup (5 steps)

### 1. Open `config.js`

All customisation lives here. Touch nothing else.

---

### 2. Fill in Business Info

```js
business: {
  name:     "Your Business Name",
  category: "Petrol Station",
  phone:    "03-XXXX XXXX",
  address:  "Your full address",
  mapEmbed: "https://maps.google.com/?q=Your+Business+Name",
  facebookPage: "https://www.facebook.com/YourPage",
  whatsapp: "60123456789",   // Leave "" to hide
  website:  "https://example.com",
}
```

---

### 3. Set Theme

```js
theme: {
  mode:   "dark",      // "light" or "dark"
  accent: "#E31837",   // Any HEX color
}
```

**Mode examples:**
- Dark + Red → Caltex, TM, Celcom
- Light + Blue → Healthcare, government
- Dark + Green → Eco, food & beverage
- Light + Orange → F&B, hospitality

---

### 4. Add Cloudinary Images

```js
cloudinary: {
  cloud: "your_cloud_name",
  images: [
    { id: "folder/your-image-public-id", caption: "Main Entrance" },
    { id: "folder/another-image",        caption: "Interior" },
  ],
}
```

Images are auto-transformed to WebP, auto quality, correct size.  
First image loads eagerly (no delay). Others lazy-load on scroll.

---

### 5. Add Tracking IDs

```js
tracking: {
  facebook: {
    pixelId: "YOUR_PIXEL_ID",
  },
  googleAnalytics: {
    measurementId: "G-XXXXXXXXXX",
  },
  googleAds: {
    conversionId: "AW-XXXXXXXXX",
    conversions: {
      directions: { label: "YOUR_LABEL_HERE" },
      call:       { label: "YOUR_LABEL_HERE" },
      whatsapp:   { label: "YOUR_LABEL_HERE" },
      website:    { label: "YOUR_LABEL_HERE" },
    },
  },
}
```

---

## Events Fired

| Button       | FB Pixel Event       | GA4 Event        | Google Ads Conv. |
|--------------|----------------------|------------------|------------------|
| Get Directions | FindLocation       | generate_lead    | LABEL_DIRECTIONS |
| Call Now     | Contact              | generate_lead    | LABEL_CALL       |
| WhatsApp     | Contact              | generate_lead    | LABEL_WHATSAPP   |
| Website      | ViewContent          | select_content   | LABEL_WEBSITE    |
| Facebook     | ViewContent          | select_content   | —                |
| Save         | CustomizeProduct     | save_listing     | —                |
| Carousel     | ViewContent          | view_item        | —                |
| Page Load    | PageView             | page_view        | —                |

---

## Theme Colors Reference

| Brand          | Mode  | Accent   |
|----------------|-------|----------|
| Caltex         | dark  | #E31837  |
| Petronas       | dark  | #00A551  |
| Shell          | light | #FFCC00  |
| Hospital/Clinic| light | #1976D2  |
| F&B / Café     | dark  | #FF6F00  |
| Real Estate    | light | #2D3748  |

---

## Deployment

Upload all 5 files to the same folder on any web server or hosting:
- Cloudflare Pages (free)
- Netlify (free)
- cPanel file manager → public_html/business-name/
- WordPress page using iframe or direct link

**No build step, no npm, no framework required.**

---

## Customisation Notes

- **Hide a button:** Set `visible: false` in the buttons array in `config.js`
- **Add services:** Append items to the `services` array
- **Add reviews:** Append to `reviews` array (max 3 recommended)
- **Disable WhatsApp:** Leave `whatsapp: ""`
- **Custom CSS:** Add rules to `style.css` using the CSS variables

---

Built by Dezeek Digital · dezeek.com
