/* ==========================================================================
   Ship & Earn — Interactive Course Experience, Revenue Simulator & Checkout
   ========================================================================== */

(() => {
  'use strict';

  /**
   * Payment & Newsletter Configuration
   * Replace any URL below with your live Stripe Payment Link, Lemon Squeezy,
   * Gumroad, or ConvertKit/Formspree endpoint whenever you are ready to collect
   * live payments or emails externally.
   */
  const SITE_CONFIG = {
    checkoutUrls: {
      foundation_once: '',
      foundation_plan: '',
      builder_once: '',
      builder_plan: '',
      studio_once: '',
      studio_plan: '',
    },
    subscribeEndpoint: '',
    contactEmail: 'support@callernamedetector.app',
  };

  const docEl = document.documentElement;
  const lang = docEl.lang === 'ar' ? 'ar' : 'en';
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';

  const I18N = {
    en: {
      onceSuffix: 'one-time payment · lifetime access',
      planSuffix: '3 monthly payments · lifetime access',
      perMonth: '/mo',
      monthsUnit: (n) => (n === 1 ? '1 month' : `${n} months`),
      visitorsUnit: (n) => `${n} / mo`,
      emailInvalid: 'Please enter a valid email address.',
      subscribedOk: 'Subscribed. Module 1 + the 2026 AI App Revenue Blueprint have been queued for your inbox.',
      checkoutReady: 'Enrollment reserved! Check your email for your course access link and invoice receipt.',
      checkoutNameRequired: 'Please enter your full name and a valid email address.',
      playingLabel: 'Now playing',
    },
    ar: {
      onceSuffix: 'دفعة واحدة · وصول مدى الحياة',
      planSuffix: '3 دفعات شهرية · وصول مدى الحياة',
      perMonth: ' / شهرياً',
      monthsUnit: (n) => {
        if (n === 1) return 'شهر واحد';
        if (n === 2) return 'شهران';
        if (n >= 3 && n <= 10) return `${n} أشهر`;
        return `${n} شهراً`;
      },
      visitorsUnit: (n) => `${n} / شهر`,
      emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح.',
      subscribedOk: 'تم الاشتراك بنجاح. تم إرسال الوحدة الأولى ودليل عوائد تطبيقات الذكاء الاصطناعي إلى بريدك.',
      checkoutReady: 'تم تسجيل طلب الالتحاق بنجاح! راجع بريدك الإلكتروني لاستلام رابط الدخول والفاتورة.',
      checkoutNameRequired: 'يرجى إدخال الاسم الكامل وبريد إلكتروني صحيح.',
      playingLabel: 'قيد التشغيل الآن',
    },
  };

  const t = I18N[lang];

  const currencyFmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const numberFmt = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });

  const pctFmt = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  /* ------------------------------------------------------------------------
     1. Mobile Navigation Toggle
     ------------------------------------------------------------------------ */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Language Switcher Preference Preservation (anchor-aware)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-lang-switch]').forEach((link) => {
    link.addEventListener('click', () => {
      const targetLang = link.getAttribute('data-lang-switch');
      try {
        localStorage.setItem('ship_earn_lang', targetLang);
      } catch (_) {}
      if (window.location.hash) {
        const base = link.getAttribute('href').split('#')[0];
        link.setAttribute('href', base + window.location.hash);
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. Hero Trailer Video Overlay Play
     ------------------------------------------------------------------------ */
  const heroVideo = document.getElementById('hero-trailer-video');
  const heroPlayBtn = document.getElementById('hero-trailer-play');
  if (heroVideo && heroPlayBtn) {
    heroPlayBtn.addEventListener('click', () => {
      heroPlayBtn.classList.add('is-hidden');
      heroVideo.controls = true;
      heroVideo.play().catch(() => {});
    });
    heroVideo.addEventListener('ended', () => {
      heroPlayBtn.classList.remove('is-hidden');
    });
  }

  /* ------------------------------------------------------------------------
     4. Curriculum & FAQ Accessible Accordions
     ------------------------------------------------------------------------ */
  function initAccordion(selector) {
    document.querySelectorAll(selector).forEach((btn) => {
      btn.addEventListener('click', () => {
        const panelId = btn.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
    });
  }
  initAccordion('.phase-trigger');
  initAccordion('.faq-btn');

  /* ------------------------------------------------------------------------
     5. Video Lesson Showcase Playlist
     ------------------------------------------------------------------------ */
  const stageVideo = document.getElementById('showcase-video');
  const stageTitle = document.getElementById('showcase-video-title');
  const stageMeta = document.getElementById('showcase-video-meta');
  const chapterButtons = document.querySelectorAll('.video-chapter-btn');

  if (stageVideo && chapterButtons.length) {
    chapterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-video-src');
        const poster = btn.getAttribute('data-video-poster');
        const title = btn.getAttribute('data-video-title');
        const duration = btn.getAttribute('data-video-duration');

        chapterButtons.forEach((b) => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        if (src) {
          stageVideo.pause();
          if (poster) stageVideo.poster = poster;
          stageVideo.src = src;
          stageVideo.load();
          stageVideo.play().catch(() => {});
        }
        if (stageTitle && title) stageTitle.textContent = title;
        if (stageMeta && duration) stageMeta.textContent = `${t.playingLabel} · ${duration}`;
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Interactive Organic Traffic & AI App Revenue Simulator
     ------------------------------------------------------------------------ */
  const visitorsInput = document.getElementById('calc-visitors');
  const convInput = document.getElementById('calc-conv');
  const priceInput = document.getElementById('calc-price');
  const churnInput = document.getElementById('calc-churn');

  if (visitorsInput && convInput && priceInput && churnInput) {
    const outVisitors = document.getElementById('val-visitors');
    const outConv = document.getElementById('val-conv');
    const outPrice = document.getElementById('val-price');
    const outChurn = document.getElementById('val-churn');

    const kpiMrr = document.getElementById('kpi-mrr');
    const kpiArr = document.getElementById('kpi-arr');
    const kpiCustomers = document.getElementById('kpi-customers');
    const kpiBreakeven = document.getElementById('kpi-breakeven');
    const chartPath = document.getElementById('calc-chart-line');
    const chartArea = document.getElementById('calc-chart-area');

    function updateCalculator() {
      const monthlyVisitors = Number(visitorsInput.value);
      const convRate = Number(convInput.value) / 100;
      const price = Number(priceInput.value);
      const churnRate = Number(churnInput.value) / 100;

      if (outVisitors) outVisitors.textContent = t.visitorsUnit(numberFmt.format(monthlyVisitors));
      if (outConv) outConv.textContent = pctFmt.format(convRate);
      if (outPrice) outPrice.textContent = currencyFmt.format(price) + t.perMonth;
      if (outChurn) outChurn.textContent = pctFmt.format(churnRate);

      // Simulate 12 months compounding with organic SEO ramp (0.5x month 1 -> 1.35x month 12)
      let activeSubs = 0;
      const mrrSeries = [];
      let cumulativeRev = 0;
      let breakEvenMonth = 12;
      const courseInvestment = 299;
      let foundBreakEven = false;

      for (let month = 1; month <= 12; month++) {
        const organicRamp = 0.55 + (month - 1) * (0.8 / 11);
        const newPaid = monthlyVisitors * organicRamp * convRate;
        activeSubs = activeSubs * (1 - churnRate) + newPaid;
        const mrr = activeSubs * price;
        mrrSeries.push(mrr);
        cumulativeRev += mrr;
        if (!foundBreakEven && cumulativeRev >= courseInvestment) {
          breakEvenMonth = month;
          foundBreakEven = true;
        }
      }

      const month12Mrr = Math.round(mrrSeries[11]);
      const month12Arr = month12Mrr * 12;
      const month12Subs = Math.round(activeSubs);

      if (kpiMrr) kpiMrr.textContent = currencyFmt.format(month12Mrr);
      if (kpiArr) kpiArr.textContent = currencyFmt.format(month12Arr);
      if (kpiCustomers) kpiCustomers.textContent = numberFmt.format(month12Subs);
      if (kpiBreakeven) kpiBreakeven.textContent = t.monthsUnit(breakEvenMonth);

      // Render clean SVG revenue trajectory (viewBox 0 0 360 110)
      if (chartPath && chartArea) {
        const maxVal = Math.max(...mrrSeries, 100);
        const w = 360;
        const h = 104;
        const padTop = 10;
        const points = mrrSeries.map((val, idx) => {
          const x = (idx / 11) * w;
          const y = h - (val / maxVal) * (h - padTop);
          return [x.toFixed(1), y.toFixed(1)];
        });
        const lineD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
        const areaD = `${lineD} L${w},${h} L0,${h} Z`;
        chartPath.setAttribute('d', lineD);
        chartArea.setAttribute('d', areaD);
      }
    }

    [visitorsInput, convInput, priceInput, churnInput].forEach((el) => {
      el.addEventListener('input', updateCalculator);
    });
    updateCalculator();
  }

  /* ------------------------------------------------------------------------
     7. Pricing Billing Toggle (One-Time vs 3 Monthly Payments)
     ------------------------------------------------------------------------ */
  let billingMode = 'once';
  const billingBtns = document.querySelectorAll('[data-billing-mode]');
  const priceNodes = document.querySelectorAll('[data-price-once]');

  function refreshPrices() {
    priceNodes.forEach((node) => {
      const amount = Number(node.getAttribute(billingMode === 'once' ? 'data-price-once' : 'data-price-plan'));
      node.textContent = currencyFmt.format(amount) + (billingMode === 'plan' ? t.perMonth : '');
      const cadenceEl = node.parentElement.querySelector('.tier-cadence');
      if (cadenceEl) {
        cadenceEl.textContent = billingMode === 'once' ? t.onceSuffix : t.planSuffix;
      }
    });
  }

  billingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      billingMode = btn.getAttribute('data-billing-mode') || 'once';
      billingBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      refreshPrices();
    });
  });
  if (priceNodes.length) refreshPrices();

  /* ------------------------------------------------------------------------
     8. Package Enrollment / Checkout Modal
     ------------------------------------------------------------------------ */
  const modal = document.getElementById('checkout-modal');
  const modalClose = document.getElementById('checkout-close');
  const modalPkgName = document.getElementById('checkout-pkg-name');
  const modalPkgPrice = document.getElementById('checkout-pkg-price');
  const modalPkgNote = document.getElementById('checkout-pkg-note');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutStatus = document.getElementById('checkout-status');

  let activeTierKey = 'builder';
  let lastFocusedEl = null;

  function openCheckout(tierKey, tierLabel, priceOnce, pricePlan) {
    if (!modal) return;
    activeTierKey = tierKey;
    lastFocusedEl = document.activeElement;
    const price = billingMode === 'once' ? Number(priceOnce) : Number(pricePlan);

    if (modalPkgName) modalPkgName.textContent = tierLabel;
    if (modalPkgPrice) modalPkgPrice.textContent = currencyFmt.format(price) + (billingMode === 'plan' ? t.perMonth : '');
    if (modalPkgNote) modalPkgNote.textContent = billingMode === 'once' ? t.onceSuffix : t.planSuffix;
    if (checkoutStatus) {
      checkoutStatus.textContent = '';
      checkoutStatus.className = 'form-status';
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  function closeCheckout() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  document.querySelectorAll('[data-select-tier]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tierKey = btn.getAttribute('data-select-tier');
      const tierLabel = btn.getAttribute('data-tier-label');
      const priceOnce = btn.getAttribute('data-tier-once');
      const pricePlan = btn.getAttribute('data-tier-plan');

      const externalKey = `${tierKey}_${billingMode}`;
      const externalUrl = SITE_CONFIG.checkoutUrls[externalKey];
      if (externalUrl) {
        window.open(externalUrl, '_blank', 'noopener,noreferrer');
        return;
      }
      openCheckout(tierKey, tierLabel, priceOnce, pricePlan);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeCheckout);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeCheckout();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeCheckout();
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = (checkoutForm.querySelector('[name="fullName"]')?.value || '').trim();
      const emailVal = (checkoutForm.querySelector('[name="email"]')?.value || '').trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

      if (!nameVal || !emailOk) {
        if (checkoutStatus) {
          checkoutStatus.textContent = t.checkoutNameRequired;
          checkoutStatus.className = 'form-status is-error';
        }
        return;
      }

      try {
        const record = {
          tier: activeTierKey,
          billing: billingMode,
          name: nameVal,
          email: emailVal,
          lang,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('ship_earn_last_enrollment', JSON.stringify(record));
      } catch (_) {}

      if (checkoutStatus) {
        checkoutStatus.textContent = t.checkoutReady;
        checkoutStatus.className = 'form-status is-success';
      }
      checkoutForm.reset();
    });
  }

  /* ------------------------------------------------------------------------
     9. Email Subscribe Forms (Hero + Bottom Newsletter Band)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('[data-subscribe-form]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const statusEl = form.parentElement.querySelector('.form-status');
      const email = (emailInput?.value || '').trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!valid) {
        if (statusEl) {
          statusEl.textContent = t.emailInvalid;
          statusEl.className = 'form-status is-error';
        }
        return;
      }

      if (SITE_CONFIG.subscribeEndpoint) {
        try {
          await fetch(SITE_CONFIG.subscribeEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email, lang, source: form.getAttribute('data-subscribe-form') }),
          });
        } catch (_) {}
      }

      try {
        const existing = JSON.parse(localStorage.getItem('ship_earn_subscribers') || '[]');
        if (!existing.includes(email)) {
          existing.push(email);
          localStorage.setItem('ship_earn_subscribers', JSON.stringify(existing));
        }
      } catch (_) {}

      if (statusEl) {
        statusEl.textContent = t.subscribedOk;
        statusEl.className = 'form-status is-success';
      }
      form.reset();
    });
  });
})();
