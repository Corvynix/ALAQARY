# Design Guidelines: Arabic-First Real Estate Consultancy SaaS Platform

## Design Approach

**Reference-Based Strategy:** Drawing inspiration from premium financial platforms (Stripe, Revolut) combined with luxury real estate sites (Sotheby's International Realty) and Arabic design excellence (Careem, Souq). Focus on authority, trust, and sophisticated data presentation.

**Core Principles:**
- Authority First: Every design decision reinforces expertise and credibility
- Behavioral Optimization: Layouts guide users toward desired actions
- Data Clarity: Complex information presented with elegant simplicity
- Cultural Authenticity: Arabic-first with genuine RTL design, not mirrored LTR

---

## Color Strategy (User-Specified)

**Primary Palette:**
- **Deep Blue:** Primary brand color, conveys trust and professionalism
- **Gold/Amber:** Accent for premium features, CTAs, and value highlights
- **White:** Clean backgrounds, breathing room, modern sophistication
- **Supporting Grays:** Slate-600 to Slate-100 for hierarchy and subtlety

**Application:**
- Navigation/Headers: Deep blue backgrounds with white/gold accents
- CTAs: Gold backgrounds with white text for primary actions
- Data Cards: White backgrounds with deep blue headers
- Trust Badges: Gold borders and icons
- Dashboards: Light gray backgrounds (Slate-50) with white cards

---

## Typography

**Arabic Typography (Primary):**
- **Headers:** Tajawal Bold (Google Fonts), weights 700-800
- **Body:** Tajawal Regular/Medium, weights 400-500
- **Data/Numbers:** IBM Plex Sans Arabic for clarity

**English Typography (Secondary):**
- **Headers:** Inter Bold, weights 600-700
- **Body:** Inter Regular, weight 400-500

**Hierarchy:**
- Hero Headlines: text-5xl md:text-6xl lg:text-7xl
- Section Headers: text-3xl md:text-4xl lg:text-5xl
- Card Titles: text-xl md:text-2xl
- Body Text: text-base md:text-lg
- Captions/Meta: text-sm

---

## Layout System

**Spacing Units:** Tailwind units of 4, 6, 8, 12, 16, 24
- Card padding: p-6 md:p-8
- Section spacing: py-16 md:py-24
- Component gaps: gap-6 or gap-8
- Grid gutters: gap-4 md:gap-6

**Container Strategy:**
- Marketing pages: max-w-7xl mx-auto px-4 md:px-6
- Dashboards: max-w-screen-2xl mx-auto px-4 md:px-8
- Forms/Content: max-w-2xl mx-auto

**Grid Patterns:**
- Feature grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard widgets: grid-cols-1 lg:grid-cols-2 xl:grid-cols-3
- Stat displays: grid-cols-2 md:grid-cols-4

---

## RTL & Bilingual Implementation

**Critical RTL Considerations:**
- Use `dir="rtl"` attribute on Arabic pages
- Tailwind RTL utilities: rtl:text-right, rtl:space-x-reverse
- Flip navigation: Right-aligned menus for Arabic
- Icons: Mirror directional icons (arrows, chevrons)
- Number formatting: Maintain Arabic numerals (١٢٣) for authenticity

**Language Toggle:**
- Persistent language switcher in top-right (LTR) / top-left (RTL)
- Smooth transition between languages without page reload
- Store preference in localStorage

---

## Component Library

**Navigation:**
- Sticky header with deep blue background, white/gold text
- Language toggle + role indicator (Client/Admin/Developer)
- Mobile: Hamburger menu with slide-in drawer

**Hero Section (Landing Page):**
- Large hero with background image (luxury property or Dubai skyline)
- Overlay gradient (deep blue to transparent)
- Centered Arabic headline with gold accent underline
- Dual CTA buttons: Gold "ابدأ الاستشارة" (Start Consultation - 200 EGP) + Outlined white "تعرف أكثر"
- Trust indicators below: "أكثر من 500 عميل راضي" with checkmark icons

**Dashboard Cards:**
- White background with subtle shadow (shadow-md)
- Deep blue header bar with gold icon
- Data visualization areas with clean spacing
- Hover state: shadow-lg transition

**Forms:**
- Large, generous input fields (h-12 md:h-14)
- Gold focus rings (focus:ring-2 focus:ring-gold-500)
- Inline validation with gentle feedback
- Progress indicators for multi-step forms

**Data Tables:**
- Striped rows for readability (alternate white/slate-50)
- Deep blue header row with white text
- Gold highlights for key metrics
- Responsive: Card view on mobile, table on desktop

**CTAs & Buttons:**
- Primary: Gold background, white text, rounded-lg, px-8 py-4
- Secondary: Deep blue border, deep blue text, bg-white
- Hover: Subtle scale (hover:scale-105) + shadow increase

**Trust Elements:**
- Verification badges: Gold border circles with checkmarks
- Client testimonials: White cards with gold quotation marks
- Security indicators: Lock icons with "معاملات آمنة 100%"

---

## Neuro-Marketing Elements

**Scarcity Triggers:**
- Red countdown timers for limited opportunities: "تبقى 48 ساعة فقط"
- "فرصة حصرية" badges in gold

**Social Proof:**
- Recent activity feed: "محمد أتم صفقة بنجاح منذ ساعتين"
- Trust score displays with star ratings
- Client count animations (counting up)

**Progress & Commitment:**
- Multi-step form progress bars (5 steps max)
- "أنت على بُعد خطوة واحدة من توصيتك الشخصية"
- Completion percentages for profiles

**Authority Signals:**
- Credentials display: "معتمد من..." with logos
- Market data citations with timestamps
- Expert headshots with credentials

---

## Page-Specific Layouts

**Landing Page:**
1. Hero with large image, dual CTAs
2. Trust indicators bar (3-4 metrics)
3. "كيف يعمل النظام" - 3-column process grid
4. Featured properties grid (2x3 cards)
5. Testimonials carousel (3 visible)
6. Pricing transparency section
7. Final CTA with scarcity timer
8. Footer with quick links, social proof

**Client Dashboard:**
- Left sidebar navigation (right sidebar in RTL)
- Top stats bar: Consultations, Saved Properties, Profile Completion
- 2-column grid: Recommendations + Recent Activity
- AI Chat widget (bottom-right in LTR, bottom-left in RTL)

**Admin Dashboard:**
- 4-column stats grid
- Market data upload area (drag-and-drop)
- Behavioral analytics charts (line/bar graphs)
- Developer performance table
- Recent client activity feed

---

## Images

**Required Images:**
1. **Hero Image:** Luxury Dubai property or skyline at sunset (full-width, min 1920px)
2. **Feature Icons:** Custom gold-colored icons for services (consultation, analysis, matching)
3. **Trust Badges:** Partner logos, certification marks (place in trust bar)
4. **Property Placeholders:** High-quality property images for cards (16:9 ratio)
5. **Team/Expert Photos:** Professional headshots for authority (circular crop)
6. **Background Patterns:** Subtle Arabic geometric patterns for section dividers

**Placement:**
- Hero: Full-width with gradient overlay
- Feature sections: Icons left/right of text (flipped in RTL)
- Property cards: Top of card, 16:9 aspect ratio
- Testimonials: Circular user photos

---

## Animations (Minimal)

- Fade-in on scroll for section reveals
- Number count-up for statistics
- Smooth language transition (200ms ease)
- Button scale on hover (scale-105)
- Card shadow transitions