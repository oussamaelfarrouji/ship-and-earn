# Ship & Earn — Bilingual (EN / AR) AI App & Revenue Course

A bilingual (English & Arabic), SEO-engineered course landing site and organic traffic hub teaching builders how to architect, build, launch, and monetize real apps with AI step by step.

- **English Flagship**: `https://oussamaelfarrouji.github.io/ship-and-earn/`
- **Arabic Flagship (RTL)**: `https://oussamaelfarrouji.github.io/ship-and-earn/ar/`

## Highlights
- **True Bilingual SEO Architecture**: Dedicated English (`/`) and Arabic (`/ar/`) canonical entry points + 6 standalone field guides (3 EN + 3 AR) with reciprocal `hreflang`, JSON-LD (`Course`, `Offer`, `VideoObject`, `FAQPage`, `Article`, `BreadcrumbList`), `sitemap.xml`, and `robots.txt`.
- **Single Logical-CSS Stylesheet**: Built with CSS Logical Properties (`margin-inline`, `padding-inline`, `border-inline-start`, `text-align: start`) so LTR and RTL render seamlessly with zero layout drift.
- **Native Media**: Editorial photography, product showcase graphics, and 3 self-hosted HD H.264 `.mp4` course preview videos with interactive chapter switching.
- **Interactive Organic Link Magnet**: Built-in 12-month Organic Traffic & AI App Revenue Simulator (`#simulator`) with locale-aware `Intl.NumberFormat` formatting.
- **Three Pricing Packages + Subscribe Capture**: Billing toggle (One-Time vs. 3 Monthly Payments) and enrollment drawer ready for live payment links.

## Connecting Live Payment & Email Providers
Open `assets/js/app.js` and edit `SITE_CONFIG`:
- Add your Stripe Payment Links, Lemon Squeezy, or Gumroad checkout URLs in `SITE_CONFIG.checkoutUrls`.
- Add your Formspree, ConvertKit, or Beehiiv endpoint in `SITE_CONFIG.subscribeEndpoint`.
