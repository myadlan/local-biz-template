/**
 * ============================================================
 *  TRACKER.JS — Unified Tracking Layer
 *  Fires: Facebook Pixel · Google Analytics 4 · Google Ads
 *  All IDs, labels & event names come from config.js
 * ============================================================
 */

const Tracker = (() => {

  /* ── Initialise Facebook Pixel ── */
  function initFacebook(pixelId) {
    if (!pixelId || pixelId.startsWith("YOUR")) return;
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', pixelId);
    console.log('[Tracker] FB Pixel initialised:', pixelId);
  }

  /* ── Initialise Google Tag (GA4 + Google Ads) ── */
  function initGoogle(measurementId, conversionId) {
    const ids = [measurementId, conversionId].filter(id => id && !id.includes("XXXX"));
    if (!ids.length) return;

    const primaryId = ids[0];
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());

    ids.forEach(id => {
      gtag('config', id, { send_page_view: false });
      console.log('[Tracker] Google Tag configured:', id);
    });
  }

  /* ── Public: Boot tracking on page load ── */
  function init() {
    const fb = CONFIG.tracking.facebook;
    const ga = CONFIG.tracking.googleAnalytics;
    const aw = CONFIG.tracking.googleAds;

    initFacebook(fb.pixelId);
    initGoogle(ga.measurementId, aw.conversionId);

    // Page view events (fire once on load)
    fireAll('pageview');
  }

  /* ── Fire all platforms for a given action key ── */
  function fireAll(action, extraParams = {}) {
    fireFacebook(action, extraParams);
    fireGA4(action, extraParams);
    fireGoogleAds(action, extraParams);
  }

  /* ── Facebook Pixel ── */
  function fireFacebook(action, extraParams = {}) {
    const cfg = CONFIG.tracking.facebook;
    const ev  = cfg.events[action];
    if (!ev || typeof fbq === 'undefined') return;

    const params = Object.assign({}, ev.params, extraParams, {
      business_name: CONFIG.business.name,
    });

    fbq('track', ev.event, params);
    console.log(`[FB Pixel] ${ev.event}`, params);
  }

  /* ── Google Analytics 4 ── */
  function fireGA4(action, extraParams = {}) {
    const cfg = CONFIG.tracking.googleAnalytics;
    const ev  = cfg.events[action];
    if (!ev || typeof gtag === 'undefined') return;

    const params = Object.assign({}, ev.params, extraParams);
    gtag('event', ev.name, params);
    console.log(`[GA4] ${ev.name}`, params);
  }

  /* ── Google Ads Conversion ── */
  function fireGoogleAds(action, extraParams = {}) {
    const cfg = CONFIG.tracking.googleAds;
    const conv = cfg.conversions[action];
    if (!conv || typeof gtag === 'undefined') return;

    const sendTo = `${cfg.conversionId}/${conv.label}`;
    gtag('event', 'conversion', Object.assign({ send_to: sendTo }, extraParams));
    console.log(`[Google Ads] conversion`, sendTo);
  }

  /* ── Public API ── */
  return { init, fireAll, fireFacebook, fireGA4, fireGoogleAds };

})();
