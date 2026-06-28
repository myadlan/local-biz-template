/**
 * ============================================================
 *  APP.JS — UI Logic
 *  Carousel · Lazy Load · Button Actions · Theme · Render
 * ============================================================
 */

const App = (() => {

  /* ────────────────────────────────
   *  CLOUDINARY URL BUILDER
   * ──────────────────────────────── */
  function buildCloudinaryUrl(imageId, width, height) {
    if (imageId.startsWith('http')) return imageId;
    const { cloud, quality, format, imgWidth, imgHeight } = CONFIG.cloudinary;
    const w = width  || imgWidth;
    const h = height || imgHeight;
    return `https://res.cloudinary.com/${cloud}/image/upload/f_${format},q_${quality},w_${w},h_${h},c_fill,g_auto/${imageId}`;
  }

  /* ────────────────────────────────
   *  THEME INJECTION
   * ──────────────────────────────── */
  function applyTheme() {
    const { mode, accent, accentText, overrides } = CONFIG.theme;
    const root = document.documentElement;

    if (mode === 'dark') {
      root.style.setProperty('--color-bg',        '#121212');
      root.style.setProperty('--color-surface',   '#1E1E1E');
      root.style.setProperty('--color-surface-2', '#2A2A2A');
      root.style.setProperty('--color-border',    '#333333');
      root.style.setProperty('--color-text',      '#F0F0F0');
      root.style.setProperty('--color-text-muted','#9E9E9E');
      root.style.setProperty('--star-color',      '#FFC107');
    } else {
      root.style.setProperty('--color-bg',        '#F5F5F5');
      root.style.setProperty('--color-surface',   '#FFFFFF');
      root.style.setProperty('--color-surface-2', '#F0F0F0');
      root.style.setProperty('--color-border',    '#E0E0E0');
      root.style.setProperty('--color-text',      '#1A1A1A');
      root.style.setProperty('--color-text-muted','#6B6B6B');
      root.style.setProperty('--star-color',      '#F5A623');
    }

    root.style.setProperty('--color-accent',      accent);
    root.style.setProperty('--color-accent-text', accentText);
    root.style.setProperty('--color-accent-soft', hexToRgba(accent, 0.12));
    root.style.setProperty('--color-accent-mid',  hexToRgba(accent, 0.25));

    Object.entries(overrides || {}).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /* ────────────────────────────────
   *  RENDER — Business Header
   * ──────────────────────────────── */
  function renderHeader() {
    const { name, category, rating, reviewCount, hours } = CONFIG.business;
    document.getElementById('biz-name').textContent          = name;
    document.getElementById('biz-category').textContent      = category;
    document.getElementById('biz-rating-num').textContent    = rating;
    document.getElementById('biz-stars').innerHTML           = renderStars(parseFloat(rating));
    document.getElementById('biz-review-count').textContent  = `(${reviewCount})`;
    document.getElementById('biz-open-badge').textContent    = hours === 'Open 24 Hours' ? 'Open 24 Hours' : 'Open Now';
  }

  function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating))    html += '<i class="fa-solid fa-star"></i>';
      else if (i - rating < 1)        html += '<i class="fa-solid fa-star-half-stroke"></i>';
      else                            html += '<i class="fa-regular fa-star"></i>';
    }
    return html;
  }

  /* ────────────────────────────────
   *  RENDER — Social Icons (header row + follow section)
   * ──────────────────────────────── */
  const SOCIAL_PLATFORMS = [
    { key: 'facebookPage', icon: 'fa-brands fa-facebook',  label: 'Facebook', color: '#1877F2' },
    { key: 'instagram',    icon: 'fa-brands fa-instagram', label: 'Instagram', color: '#E1306C' },
    { key: 'tiktok',       icon: 'fa-brands fa-tiktok',    label: 'TikTok',   color: '#010101' },
  ];

  function renderSocialHeader() {
    const container = document.getElementById('biz-social');
    if (!container) return;
    const links = SOCIAL_PLATFORMS.filter(p => CONFIG.business[p.key]);
    if (!links.length) { container.style.display = 'none'; return; }

    container.innerHTML = links.map(p => `
      <a href="${CONFIG.business[p.key]}" target="_blank" rel="noopener"
         class="social-icon-link" aria-label="${p.label}"
         style="--social-color:${p.color}">
        <i class="${p.icon}"></i>
      </a>`).join('');
  }

  function renderSocialFollow() {
    const container = document.getElementById('social-follow');
    if (!container) return;
    const links = SOCIAL_PLATFORMS.filter(p => CONFIG.business[p.key]);
    if (!links.length) { container.style.display = 'none'; return; }

    container.innerHTML = `
      <div class="follow-heading">
        <span class="follow-label">Follow Us on Social Media</span>
      </div>
      <div class="follow-icons">
        ${links.map(p => `
          <a href="${CONFIG.business[p.key]}" target="_blank" rel="noopener"
             class="follow-icon-btn" aria-label="${p.label}"
             style="--social-color:${p.color}">
            <span class="follow-icon-circle"><i class="${p.icon}"></i></span>
            <span class="follow-icon-label">${p.label}</span>
          </a>`).join('')}
      </div>`;
  }

  /* ────────────────────────────────
   *  RENDER — Carousel (2 visible, promo is slide 0)
   *
   *  Layout: each slide is 75% wide with 8px gap → 2 slides peek on screen.
   *  Offset per step = slideWidth + gap (in px), computed at runtime.
   * ──────────────────────────────── */
  let carouselIndex = 0;
  let touchStartX   = 0;
  let touchEndX     = 0;
  let autoplayTimer = null;
  let allSlides     = [];   // [{id, caption, isPromo}]

  function buildSlideList() {
    const promo  = CONFIG.promotion;
    const images = CONFIG.cloudinary.images;
    allSlides = [];

    // Slide 0 — promotion (if enabled)
    if (promo && promo.enabled) {
      allSlides.push({ isPromo: true });
    }

    // Remaining — business images
    images.forEach(img => allSlides.push({ isPromo: false, id: img.id, caption: img.caption }));
  }

  function renderCarousel() {
    buildSlideList();

    const track = document.getElementById('carousel-track');
    const dots  = document.getElementById('carousel-dots');

    track.innerHTML = allSlides.map((slide, i) => {
      if (slide.isPromo) {
        return buildPromoSlide(i);
      }
      const url = buildCloudinaryUrl(slide.id);
      return `
        <div class="carousel-slide" data-index="${i}">
          <img
            ${i === 0 ? `src="${url}"` : `data-src="${url}"`}
            alt="${slide.caption}"
            class="carousel-img${i > 0 ? ' lazy' : ''}"
            width="${CONFIG.cloudinary.imgWidth}"
            height="${CONFIG.cloudinary.imgHeight}"
            loading="${i === 0 ? 'eager' : 'lazy'}"
          />
          <div class="carousel-caption">${slide.caption}</div>
        </div>`;
    }).join('');

    // Dots
    dots.innerHTML = allSlides.map((_, i) =>
      `<button class="carousel-dot${i===0?' active':''}" data-index="${i}" aria-label="Slide ${i+1}"></button>`
    ).join('');

    // Promo CTA button → open modal (button only, not whole slide)
    track.addEventListener('click', e => {
      if (e.target.closest('[data-promo-trigger="1"]')) {
        openPromoModal();
        Tracker.fireAll('promo_banner');
      }
    });

    // Touch swipe
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) goToSlide(diff > 0 ? carouselIndex + 1 : carouselIndex - 1);
    });

    dots.addEventListener('click', e => {
      const btn = e.target.closest('.carousel-dot');
      if (btn) goToSlide(parseInt(btn.dataset.index));
    });

    startAutoplay();
    initLazyLoad();
  }

  function buildPromoSlide(i) {
    const promo = CONFIG.promotion;
    let inner = '';

    if (promo.imageId) {
      const cn  = CONFIG.cloudinary;
      const url = promo.imageId.startsWith('http')
        ? promo.imageId
        : `https://res.cloudinary.com/${cn.cloud}/image/upload/f_webp,q_auto,w_720,h_720,c_fill,g_auto/${promo.imageId}`;
      inner = `<img src="${url}" alt="${promo.imageAlt}" class="carousel-img" width="720" height="720" loading="eager" fetchpriority="high" />`;
    } else {
      inner = `
        <div class="promo-slide-gradient">
          <span class="promo-badge">${promo.badge}</span>
          <div class="promo-headline">${promo.headline}</div>
          <div class="promo-subtext">${promo.subtext}</div>
        </div>`;
    }

    return `
      <div class="carousel-slide promo-slide" data-index="${i}" data-promo="1">
        ${inner}
        <div class="promo-slide-badge-overlay"><i class="fa-solid fa-tag"></i> Promo</div>
        <div class="promo-cta-overlay">
          <button class="promo-cta-btn" data-promo-trigger="1" aria-label="${promo.buttonLabel}">
            <i class="fa-solid fa-gift"></i>
            ${promo.buttonLabel}
          </button>
        </div>
      </div>`;
  }

  /* Compute slide step in px, then translate track */
  function getSlideStep() {
    const track = document.getElementById('carousel-track');
    const slide = track.querySelector('.carousel-slide');
    if (!slide) return 0;
    const style = window.getComputedStyle(slide);
    const gap   = parseFloat(window.getComputedStyle(track).gap) || 10;
    return slide.offsetWidth + gap;
  }

  function goToSlide(index) {
    const max = allSlides.length - 1;
    carouselIndex = Math.max(0, Math.min(index, max));

    const track = document.getElementById('carousel-track');
    const step  = getSlideStep();
    track.style.transform = `translateX(-${carouselIndex * step}px)`;

    document.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === carouselIndex));

    // Lazy load next slide
    const slides = track.querySelectorAll('.carousel-slide');
    [carouselIndex, carouselIndex + 1].forEach(idx => {
      const s = slides[idx];
      if (s) loadLazyImage(s.querySelector('img.lazy'));
    });

    if (index !== carouselIndex) return; // clamped — don't fire tracking at ends
    Tracker.fireAll('carousel', { slide_index: carouselIndex });
    resetAutoplay();
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      const next = carouselIndex + 1 >= allSlides.length ? 0 : carouselIndex + 1;
      goToSlide(next);
    }, 4500);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  /* ────────────────────────────────
   *  LAZY LOAD
   * ──────────────────────────────── */
  function initLazyLoad() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loadLazyImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '200px' });
      document.querySelectorAll('img.lazy').forEach(img => observer.observe(img));
    } else {
      document.querySelectorAll('img.lazy').forEach(loadLazyImage);
    }
  }

  function loadLazyImage(img) {
    if (!img || !img.dataset.src || img.src === img.dataset.src) return;
    img.src = img.dataset.src;
    img.classList.remove('lazy');
  }

  /* ────────────────────────────────
   *  RENDER — 4 Fixed Action Buttons
   *  Call · Directions · WhatsApp · Share
   * ──────────────────────────────── */
  const FIXED_BUTTONS = [
    { action: 'call',       label: 'Call',       icon: 'fa-solid fa-phone'              },
    { action: 'directions', label: 'Directions', icon: 'fa-solid fa-diamond-turn-right' },
    { action: 'whatsapp',   label: 'WhatsApp',   icon: 'fa-brands fa-whatsapp'          },
    { action: 'share',      label: 'Share',      icon: 'fa-solid fa-share-nodes'        },
  ];

  function renderButtons() {
    const container = document.getElementById('action-buttons');
    container.innerHTML = FIXED_BUTTONS.map(btn => `
      <button class="action-btn" data-action="${btn.action}" aria-label="${btn.label}">
        <span class="action-btn-circle"><i class="${btn.icon}"></i></span>
        <span class="action-btn-label">${btn.label}</span>
      </button>
    `).join('');

    container.addEventListener('click', e => {
      const btn = e.target.closest('.action-btn');
      if (!btn) return;
      handleButtonAction(btn.dataset.action);
      Tracker.fireAll(btn.dataset.action);
      btn.classList.add('pressed');
      setTimeout(() => btn.classList.remove('pressed'), 300);
    });
  }

  function handleButtonAction(action) {
    const { phone, whatsapp, website, mapEmbed } = CONFIG.business;
    switch (action) {
      case 'call':
        window.location.href = `tel:${phone.replace(/[\s-]/g, '')}`;
        break;
      case 'directions':
        window.open(mapEmbed, '_blank');
        break;
      case 'whatsapp':
        if (whatsapp) window.open(`https://wa.me/${whatsapp}`, '_blank');
        else showToast('WhatsApp tidak tersedia.');
        break;
      case 'share':
        handleShare();
        break;
    }
  }

  function handleShare() {
    const { name, address } = CONFIG.business;
    if (navigator.share) {
      navigator.share({
        title: name,
        text:  `${name} — ${address}`,
        url:   window.location.href,
      }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard?.writeText(window.location.href)
        .then(() => showToast('Pautan disalin!'))
        .catch(() => showToast('Tidak dapat menyalin pautan.'));
    }
  }

  /* ────────────────────────────────
   *  RENDER — Business Details
   * ──────────────────────────────── */
  function renderDetails() {
    const { phone, address, hours, website } = CONFIG.business;
    const container = document.getElementById('business-details');

    const rows = [
      { icon: 'fa-solid fa-location-dot', text: address, action: 'directions' },
      { icon: 'fa-solid fa-clock',        text: hours,   action: null         },
      { icon: 'fa-solid fa-phone',        text: phone,   action: 'call'       },
    ];
    if (website) rows.push({
      icon: 'fa-solid fa-globe',
      text: website.replace(/^https?:\/\//, ''),
      action: 'website',
    });

    container.innerHTML = rows.map(row => `
      <div class="detail-row${row.action ? ' clickable' : ''}" data-action="${row.action || ''}">
        <span class="detail-icon"><i class="${row.icon}"></i></span>
        <span class="detail-text">${row.text}</span>
        ${row.action ? '<i class="fa-solid fa-chevron-right detail-arrow"></i>' : ''}
      </div>
    `).join('');

    container.addEventListener('click', e => {
      const row = e.target.closest('.clickable');
      if (!row || !row.dataset.action) return;
      const action = row.dataset.action;
      if (action === 'website') window.open(CONFIG.business.website, '_blank');
      else handleButtonAction(action);
      Tracker.fireAll(action);
    });
  }

  /* ────────────────────────────────
   *  RENDER — CaltexGO Loyalty Tab
   * ──────────────────────────────── */
  function renderCaltexGO() {
    const container = document.getElementById('caltexgo-panel');
    if (!container) return;
    const cfg = CONFIG.caltexgo;
    if (!cfg) return;

    const bonusChip = cfg.welcomeBonus
      ? `<span class="cgo-chip"><i class="fa-solid fa-gift"></i> Welcome Bonus ${cfg.welcomeBonus}</span>`
      : '';
    const rateChip = cfg.pointsRate
      ? `<span class="cgo-chip cgo-chip-alt"><i class="fa-solid fa-bolt"></i> ${cfg.pointsRate}</span>`
      : '';

    const benefitCards = (cfg.benefits || []).map(b => `
      <div class="cgo-benefit">
        <div class="cgo-benefit-icon"><i class="${b.icon}"></i></div>
        <div class="cgo-benefit-body">
          <div class="cgo-benefit-title">${b.title}</div>
          <div class="cgo-benefit-desc">${b.desc}</div>
        </div>
      </div>`).join('');

    container.innerHTML = `
      <!-- Hero -->
      <div class="cgo-hero">
        <div class="cgo-logo-row">
          <div class="cgo-logo-icon"><i class="fa-solid fa-circle-nodes"></i></div>
          <div>
            <div class="cgo-hero-title">${cfg.headline}</div>
            <div class="cgo-hero-sub">${cfg.subtext}</div>
          </div>
        </div>
        <div class="cgo-chips">${bonusChip}${rateChip}</div>
      </div>

      <!-- Benefits -->
      <div class="cgo-benefits-list">${benefitCards}</div>

      <!-- Download CTA -->
      <div class="cgo-download-section">
        <div class="cgo-download-label">Download CaltexGO</div>
        <div class="cgo-store-buttons">
          <a href="${cfg.appStoreUrl}" target="_blank" rel="noopener" class="cgo-store-btn" aria-label="Download on App Store">
            <i class="fa-brands fa-apple cgo-store-icon"></i>
            <div class="cgo-store-text">
              <span class="cgo-store-sub">Download on the</span>
              <span class="cgo-store-name">App Store</span>
            </div>
          </a>
          <a href="${cfg.playStoreUrl}" target="_blank" rel="noopener" class="cgo-store-btn" aria-label="Get it on Google Play">
            <i class="fa-brands fa-google-play cgo-store-icon"></i>
            <div class="cgo-store-text">
              <span class="cgo-store-sub">Get it on</span>
              <span class="cgo-store-name">Google Play</span>
            </div>
          </a>
        </div>
        ${cfg.learnMoreUrl ? `<a href="${cfg.learnMoreUrl}" target="_blank" rel="noopener" class="cgo-learn-more">Learn more about Caltex Rewards <i class="fa-solid fa-arrow-right"></i></a>` : ''}
      </div>`;
  }
  function renderHighlights() {
    const container = document.getElementById('highlights-list');
    if (!container) return;
    const items = CONFIG.highlights;
    if (!items?.length) { container.closest('.services-panel')?.remove(); return; }

    container.innerHTML = items.map((item, i) => {
      const cn = CONFIG.cloudinary;
      let imgHtml = '';

      if (item.imageId) {
        // 1:1 square — WebP, w=720 h=720
        const url = item.imageId.startsWith('http')
          ? item.imageId
          : `https://res.cloudinary.com/${cn.cloud}/image/upload/f_webp,q_auto,w_720,h_720,c_fill,g_auto/${item.imageId}`;
        imgHtml = `<img
          ${i === 0 ? `src="${url}"` : `data-src="${url}"`}
          alt="${item.title}"
          class="highlight-img${i > 0 ? ' lazy' : ''}"
          width="720" height="720"
          loading="${i === 0 ? 'eager' : 'lazy'}"
        />`;
      } else {
        imgHtml = `<div class="highlight-img-placeholder"></div>`;
      }

      return `
        <div class="highlight-card">
          <div class="highlight-img-wrap">${imgHtml}</div>
          <div class="highlight-body">
            <div class="highlight-title">${item.title}</div>
            <div class="highlight-desc">${item.description}</div>
          </div>
        </div>`;
    }).join('');
  }

  /* ────────────────────────────────
   *  RENDER — Reviews
   * ──────────────────────────────── */
  function renderReviews() {
    const container = document.getElementById('reviews-list');
    if (!CONFIG.reviews?.length) {
      container.closest('.reviews-section')?.remove();
      return;
    }
    container.innerHTML = CONFIG.reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${r.name.charAt(0)}</div>
          <div class="review-meta">
            <div class="review-name">${r.name}</div>
            <div class="review-stars">${renderStars(r.rating)}</div>
          </div>
          <div class="review-time">${r.time}</div>
        </div>
        <div class="review-text">${r.text}</div>
      </div>
    `).join('');
  }

  /* ────────────────────────────────
   *  SEO META TAGS
   * ──────────────────────────────── */
  function injectMeta() {
    const { title, description, ogImage, canonical, locale } = CONFIG.seo;
    const firstImg = CONFIG.cloudinary.images[0];
    const og = ogImage || (firstImg ? buildCloudinaryUrl(firstImg.id, 1200, 630) : '');

    document.title = title;
    setMeta('description', description);
    setMeta('og:title',       title,            true);
    setMeta('og:description', description,      true);
    setMeta('og:type',        'local.business', true);
    setMeta('og:locale',      locale,           true);
    if (og) setMeta('og:image', og, true);
    if (canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical'; link.href = canonical;
      document.head.appendChild(link);
    }
  }

  function setMeta(name, content, isProperty = false) {
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    const existing = document.querySelector(selector);
    if (existing) { existing.setAttribute('content', content); return; }
    const el = document.createElement('meta');
    el.setAttribute(isProperty ? 'property' : 'name', name);
    el.setAttribute('content', content);
    document.head.appendChild(el);
  }

  /* ────────────────────────────────
   *  TOAST
   * ──────────────────────────────── */
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  /* ────────────────────────────────
   *  TABS
   * ──────────────────────────────── */
  function initTabs() {
    const tabs   = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t   => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected','true');
        document.getElementById(`panel-${tab.dataset.tab}`)?.classList.add('active');
      });
    });
  }

  /* ────────────────────────────────
   *  PROMOTION MODAL
   * ──────────────────────────────── */
  function openPromoModal() {
    const modal = document.getElementById('promo-modal');
    if (!modal) return;
    modal.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('input-name')?.focus(), 360);
  }

  function closePromoModal() {
    const modal = document.getElementById('promo-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => {
      modal.hidden = true;
      resetPromoForm();
    }, 300);
  }

  function resetPromoForm() {
    ['input-name','input-phone','input-email'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    clearPromoErrors();
    document.getElementById('modal-form-state').hidden    = false;
    document.getElementById('modal-success-state').hidden = true;
    const btn = document.getElementById('promo-submit');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span id="submit-label">${CONFIG.promotion.buttonLabel}</span><i class="fa-solid fa-arrow-right"></i>`;
    }
  }

  function clearPromoErrors() {
    ['error-name','error-phone','error-email'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['input-name','input-phone','input-email'].forEach(id =>
      document.getElementById(id)?.classList.remove('is-error'));
    document.querySelector('.input-prefix-wrap')?.classList.remove('is-error');
  }

  function populateModal() {
    const promo  = CONFIG.promotion;
    const fields = promo.fields;

    document.getElementById('modal-title').textContent    = promo.modalTitle;
    document.getElementById('modal-desc').textContent     = promo.modalDesc;
    document.getElementById('submit-label').textContent   = promo.buttonLabel;
    document.getElementById('success-title').textContent   = promo.successTitle;
    document.getElementById('success-message').textContent = promo.successMessage;

    document.querySelector('label[for="input-name"]').textContent  = fields.name.label  + (fields.name.required  ? ' *' : '');
    document.querySelector('label[for="input-phone"]').textContent = fields.phone.label + (fields.phone.required ? ' *' : '');
    document.querySelector('label[for="input-email"]').textContent = fields.email.label + (fields.email.required ? ' *' : '');

    document.getElementById('input-name').placeholder  = fields.name.placeholder;
    document.getElementById('input-phone').placeholder = fields.phone.placeholder;
    document.getElementById('input-email').placeholder = fields.email.placeholder;

    document.getElementById('field-email').style.display = fields.email.required ? '' : 'none';
  }

  function validatePromoForm() {
    const fields = CONFIG.promotion.fields;
    let valid = true;
    clearPromoErrors();

    const name  = document.getElementById('input-name')?.value.trim();
    const phone = document.getElementById('input-phone')?.value.trim();
    const email = document.getElementById('input-email')?.value.trim();

    if (fields.name.required && !name) {
      setFieldError('input-name', 'error-name', 'Sila masukkan nama anda.');
      valid = false;
    }
    if (fields.phone.required && !phone) {
      setFieldError('input-phone', 'error-phone', 'Sila masukkan nombor telefon.', true);
      valid = false;
    } else if (phone && !/^[0-9]{8,11}$/.test(phone)) {
      setFieldError('input-phone', 'error-phone', 'Format: 0123456789 (8–11 digit).', true);
      valid = false;
    }
    if (fields.email.required && !email) {
      setFieldError('input-email', 'error-email', 'Sila masukkan e-mel anda.');
      valid = false;
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('input-email', 'error-email', 'Format e-mel tidak sah.');
      valid = false;
    }
    return valid;
  }

  function setFieldError(inputId, errorId, message, isPhone = false) {
    document.getElementById(errorId).textContent = message;
    if (isPhone) document.querySelector('.input-prefix-wrap')?.classList.add('is-error');
    else document.getElementById(inputId)?.classList.add('is-error');
  }

  async function submitPromoForm() {
    if (!validatePromoForm()) return;

    const btn = document.getElementById('promo-submit');
    btn.disabled = true;
    btn.innerHTML = `<span class="btn-spinner"></span> Menghantar…`;

    const name  = document.getElementById('input-name')?.value.trim();
    const phone = '+60' + document.getElementById('input-phone')?.value.trim();
    const email = document.getElementById('input-email')?.value.trim() || '';

    const payload = {
      timestamp: new Date().toISOString(),
      business:  CONFIG.business.name,
      source:    window.location.href,
      promotion: CONFIG.promotion.modalTitle,
      name, phone, email,
    };

    try {
      // ── Netlify Forms submission ──────────────────────────────
      const formData = new FormData();
      formData.append('form-name', 'promo-lead');
      formData.append('name',      name);
      formData.append('phone',     phone);
      formData.append('email',     email);
      formData.append('business',  CONFIG.business.name);
      formData.append('promotion', CONFIG.promotion.modalTitle);
      formData.append('source',    window.location.href);

      await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    new URLSearchParams(formData).toString(),
      });

      // ── Legacy webhook (optional — set webhookUrl in config) ──
      const webhookUrl = CONFIG.promotion.webhookUrl;
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method:  'POST',
          mode:    'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload),
        });
      }

      Tracker.fireAll('promo_lead', { name, phone });

      document.getElementById('modal-form-state').hidden    = true;
      document.getElementById('modal-success-state').hidden = false;

    } catch (err) {
      console.error('[Promo] Webhook error:', err);
      btn.disabled = false;
      btn.innerHTML = `<span>${CONFIG.promotion.buttonLabel}</span><i class="fa-solid fa-arrow-right"></i>`;
      showToast('Ralat sambungan. Cuba semula.');
    }
  }

  function initPromoModal() {
    const overlay      = document.getElementById('promo-modal');
    const closeBtn     = document.getElementById('modal-close');
    const submitBtn    = document.getElementById('promo-submit');
    const successClose = document.getElementById('modal-success-close');

    overlay?.addEventListener('click', e => { if (e.target === overlay) closePromoModal(); });
    closeBtn?.addEventListener('click', closePromoModal);
    successClose?.addEventListener('click', closePromoModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !overlay?.hidden) closePromoModal();
    });

    submitBtn?.addEventListener('click', submitPromoForm);

    document.getElementById('input-name')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('input-phone')?.focus();
    });
    document.getElementById('input-phone')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const ef = document.getElementById('field-email');
        if (ef && ef.style.display !== 'none') document.getElementById('input-email')?.focus();
        else submitPromoForm();
      }
    });
    document.getElementById('input-email')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitPromoForm();
    });

    ['input-name','input-phone','input-email'].forEach(id =>
      document.getElementById(id)?.addEventListener('input', clearPromoErrors));

    populateModal();
  }

  /* ────────────────────────────────
   *  BOOT
   * ──────────────────────────────── */
  function init() {
    applyTheme();
    injectMeta();
    renderHeader();
    renderSocialHeader();
    renderSocialFollow();
    initPromoModal();
    renderCarousel();
    renderButtons();
    renderDetails();
    renderHighlights();
    renderCaltexGO();
    renderReviews();
    initTabs();
    Tracker.init();
    initLazyLoad();
    console.log('[App] Initialised —', CONFIG.business.name);
  }

  return { init, openPromoModal };

})();

document.addEventListener('DOMContentLoaded', App.init);
