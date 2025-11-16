# Design Guidelines: Arabic-First Real Estate SaaS Platform

## Design Approach

**Hybrid Strategy**: Combine Airbnb's property showcase aesthetics with Linear's dashboard precision for analytics interfaces. This platform requires dual excellence: inspiring trust through visual richness in buyer-facing views while delivering data clarity in professional dashboards.

**Arabic-First RTL Foundation**: All layouts, navigation, and reading flows designed primarily for RTL, with LTR as adaptation—not afterthought.

## Typography System

**Primary Font**: IBM Plex Sans Arabic (via Google Fonts CDN) for comprehensive Arabic support with matching Latin characters
**Secondary Font**: Inter (for data tables, metrics, technical content)

**Hierarchy**:
- Hero Headlines: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-bold
- Property Titles: text-2xl md:text-3xl, font-semibold
- Body Text: text-base md:text-lg, font-normal
- Captions/Metadata: text-sm, font-medium
- Data Labels: text-xs uppercase tracking-wide

## Layout & Spacing System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16, 24
- Tight spacing: p-3, gap-4 (cards, form fields)
- Standard spacing: p-6, gap-6 (sections, containers)
- Generous spacing: p-12, py-16, py-24 (page sections)

**Grid Systems**:
- Property Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Dashboard Metrics: grid-cols-2 md:grid-cols-4 gap-4
- Match Scores: grid-cols-1 lg:grid-cols-2 gap-8

**Container Strategy**:
- Marketing pages: max-w-7xl mx-auto px-6
- Property listings: max-w-screen-2xl mx-auto px-4
- Dashboards: max-w-screen-xl mx-auto px-6
- Forms & wizards: max-w-2xl mx-auto

## Core Components

### Navigation
**Buyer Navigation**: Horizontal nav with mega-menu for property filters, sticky on scroll, includes language toggle and profile dropdown
**Dashboard Navigation**: Side navigation (right-aligned for RTL) with collapsible menu, role-based items, trust score indicator

### Property Cards
- Large image (aspect-ratio-4/3)
- Developer trust badge (top-start corner overlay)
- Price prominently displayed (text-2xl font-bold)
- Key specs in horizontal pill badges
- Match score progress ring (if logged in)
- Subtle hover elevation

### Trust Score Indicators
- Circular progress indicator (0-100 scale)
- Color-neutral presentation (no red/green, use gradients)
- Breakdown tooltip on hover
- Historical trend micro-chart

### AI Chat Interface
- Fixed bottom-right (bottom-left in LTR) floating widget
- Expandable panel: collapsed (80x80), expanded (400x600)
- Message bubbles: buyer (end-aligned), AI (start-aligned)
- Purchase probability meter at top
- Typing indicators and timestamps

### Dashboard Cards
- Bordered cards with subtle shadow
- Header with metric name + info tooltip
- Large number display (text-4xl font-bold)
- Trend indicator (↑↓ with percentage)
- Mini sparkline chart where relevant

### Forms & Wizards
- Multi-step progress indicator at top
- Generous field spacing (space-y-6)
- Inline validation with clear messaging
- CTAs: Primary full-width, Secondary outline
- Profile Builder: Card-based selection for psychological attributes

### Match Dashboard
- Split layout: Filters sidebar (300px) + Main content
- Score explanation accordions
- Comparison view toggle (grid vs list)
- Detailed rationale modal

## Page-Specific Layouts

### Buyer Homepage
- Hero: Full-width search bar with city selector, overlaid on property montage (h-[70vh])
- Featured Properties: 3-column grid
- Trust Explainer: 2-column split (visual + content)
- AI Closer Demo: Centered with animated chat preview
- CTA Section: py-24 with generous whitespace

### Property Detail Page
- Image gallery: Main hero (h-[60vh]) + thumbnail strip
- Two-column: Property info (8/12) + Booking card (4/12, sticky)
- Developer profile card with trust breakdown
- Match score callout (if logged in)
- Similar properties grid

### Developer Dashboard
- Stats overview: 4-column metric cards
- Lead pipeline: Kanban-style columns
- Trust score: Large circular gauge + breakdown table
- Match optimization: Tabbed interface (Profile, Properties, Insights)
- A/B testing results: Comparison cards

### Admin Analytics
- Full-width time range selector
- Multi-metric overview: 6-column compact cards
- Behavioral funnel: Horizontal stepped visualization
- AI session performance: Tabbed charts (Effectiveness, Conversion, Objections)
- Developer monitoring: Sortable table with inline charts

## Images

**Hero Section**: Yes - Large hero image on buyer homepage showing premium Arabic real estate (modern villas, luxury apartments in Dubai/Riyadh aesthetic). Image should convey trust and aspiration. Use subtle overlay gradient for text readability.

**Property Listings**: Multiple property images per listing (minimum 5-8 photos per property). Hero image in 4:3 aspect ratio, professional architectural photography style.

**Developer Profiles**: Headshot/logo for each developer, company office photos where available.

**Trust Indicators**: Icon-based visualizations (checkmarks, shields, certificates) for trust score breakdowns.

**AI Chat Widget**: Avatar for AI assistant (friendly, professional icon).

**Empty States**: Illustration-based empty states for no properties, no matches, no data scenarios.

**All images with button overlays**: Implement backdrop-blur-md on button backgrounds for glass-morphism effect.

## RTL-Specific Considerations

- All directional utilities reverse: ml→mr, left→right, rounded-l→rounded-r
- Icons maintain LTR orientation (don't mirror arrows, chevrons)
- Form layouts: Labels on right, inputs extend left
- Charts/graphs: Maintain standard left-to-right data flow
- Navigation: Menu items flow right-to-left
- Breadcrumbs: Separator direction reverses (← instead of →)

## Interaction Patterns

**Minimal Animation**: Subtle hover elevations, smooth transitions (transition-all duration-200), no scroll-triggered effects except sticky navigation.

**Loading States**: Skeleton screens for property cards, shimmer effect for dashboard metrics.

**Micro-interactions**: Success checkmarks, error shakes, form field focus rings (ring-2).

**Responsive Behavior**: Mobile-first collapsible navigation, stacked layouts on small screens, touch-friendly tap targets (min 44x44px).