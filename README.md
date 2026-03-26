# UpNews Frontend

A Netflix-style dark theme React SPA for consuming uplifting news from the upnews-api REST API. Built with Vite, React 18, TailwindCSS, and modern frontend patterns.

## 📋 Project Description

UpNews Frontend is a modern, responsive single-page application that delivers positive, uplifting news stories in an elegant dark theme inspired by Netflix's UI. The app features infinite scroll, category browsing, search, bookmarks, and a mobile-first responsive design.

### Key Features
- **Netflix-style Hero Carousel** — Auto-rotating featured articles with gradient overlays
- **Category Swimlanes** — Horizontal scrolling rows of articles by category
- **Full-Text Search** — Debounced search with keyboard shortcuts
- **Bookmarks** — Save and manage favorite articles
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Offline Support** — PWA with service worker for offline reading
- **Dark Theme** — Netflix noir aesthetic with accent colors

## 📸 Screenshots

[Screenshots to be added during implementation]

- Hero carousel view
- Category swimlane section
- Article detail modal
- Search overlay
- Bookmarks page
- Mobile bottom navigation

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | TailwindCSS v4 |
| **Animations** | Framer Motion |
| **State Management** | Tanstack Query (React Query) |
| **Routing** | React Router v6 |
| **Icons** | Lucide React |
| **HTTP Client** | Fetch API (via React Query) |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 7+

### Installation

```bash
# Clone the repository
git clone https://github.com/News-Uplifters/upnews-frontend.git
cd upnews-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your API configuration
# VITE_API_URL=http://localhost:8000
```

### Development

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting (when configured)
npm run lint
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# API Configuration
VITE_API_URL=http://localhost:8000
```

The development server includes a proxy that automatically forwards API requests to the backend.

## 🎨 Design System

### Color Palette

The design system uses a Netflix-inspired dark theme with carefully chosen colors for accessibility and visual hierarchy.

#### Primary Colors
- **Background**: `#121212` — Main background color
- **Surface**: `#1E1E1E` — Cards, containers, elevated surfaces
- **Surface Secondary**: `#282828` — Secondary elevated surfaces
- **On Surface**: `#E8E8E8` — Primary text color
- **On Surface Variant**: `#B3B3B3` — Secondary text (labels, helper text)
- **Outline**: `#646464` — Borders and dividers

#### Accent Colors
- **Primary**: `#E50914` — Netflix red, used for call-to-action buttons, active states
- **Primary Container**: `#8C0000` — Dark variant of primary
- **On Primary**: `#FFFFFF` — Text on primary background
- **Secondary**: `#00D4FF` — Cyan accent for highlights
- **Secondary Container**: `#005A73` — Dark cyan

#### Semantic Colors
- **Success**: `#4CAF50` — Success states, positive feedback
- **Warning**: `#FF9800` — Warnings, caution
- **Error**: `#F44336` — Errors, destructive actions
- **Info**: `#2196F3` — Informational messages

#### Typography Colors
- **Text Primary**: `#E8E8E8` — Main content text
- **Text Secondary**: `#B3B3B3` — Secondary content, metadata
- **Text Tertiary**: `#808080` — Disabled state, inactive elements
- **Text Inverse**: `#121212` — Text on light backgrounds

### Typography
- **Display Font**: Manrope (headings, brand)
- **Body Font**: Inter (body text, UI)
- **Monospace**: SF Mono or Menlo (code blocks)

### Spacing Scale
- `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `56px`, `64px`

### Component Sizes
- **Icon**: 16px, 20px, 24px, 32px
- **Button Height**: 40px (standard), 36px (compact)
- **Input Height**: 40px
- **Card Border Radius**: 8px
- **Modal Border Radius**: 12px

## 📋 TODO Task List for Contributors

This task list is organized in dependency order. Start with TASK 1 and progress sequentially for best results.

### TASK 1: Set up Vite + React + TailwindCSS + React Router project
**Status**: Scaffold in place
**Description**: Initialize Vite project with React, install and configure TailwindCSS v4 with the dark theme palette defined in `tailwind.config.js`, set up React Router, and configure path aliases (`@/components`, `@/hooks`, etc.).
**Dependencies**: None
**Acceptance Criteria**:
- `npm run dev` starts development server on port 5173
- TailwindCSS dark theme colors are available in templates
- Path aliases work for imports
- Router is configured with initial route structure
- All dependencies listed in package.json are installed without errors

**Files to create/modify**:
- `tailwind.config.js` — Dark theme palette configuration
- `vite.config.js` — React plugin, path aliases, API proxy
- `src/main.jsx` — React entry point
- `src/App.jsx` — Router setup
- `jsconfig.json` — Path alias configuration

---

### TASK 2: Create layout components — Navbar, MobileNav, Footer
**Status**: Stubs created
**Description**: Build responsive header/navigation components. Desktop navbar with logo, category links (All, Technology, Health, Environment, Science, Inspiring Stories), search icon, and user menu dropdown. Mobile nav with bottom tab bar (Home, Search, Bookmarks, Profile). Footer with links, about, social.
**Dependencies**: TASK 1
**Acceptance Criteria**:
- Navbar displays logo (left), category links (center), search icon + user menu (right)
- Category links highlight current category
- Search icon opens search overlay on click
- User menu has dropdown with options (Settings, About, Logout)
- MobileNav is sticky bottom bar (Home, Search, Bookmarks, User) with active indicator
- Footer displays copyright, links, social icons
- Responsive: navbar stacks on mobile, bottom nav hidden on desktop
- Tailwind classes follow dark theme

**Files to create/modify**:
- `src/components/layout/Navbar.jsx`
- `src/components/layout/MobileNav.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/layout/Layout.jsx` — Main layout wrapper

---

### TASK 3: Build HeroCarousel component — Auto-rotating featured articles
**Status**: Stub created
**Description**: Full-bleed carousel of top 5 featured articles. Each slide has thumbnail background (darkened with gradient overlay), article title, source, time ago. Auto-rotates every 5 seconds. Framer Motion crossfade transition. Progress dots at bottom show current slide + remaining auto-rotate time. Prev/next arrow buttons (desktop only). Swipe gestures on mobile. Click to navigate to article detail.
**Dependencies**: TASK 1, Framer Motion
**Acceptance Criteria**:
- Carousel renders 5 articles in full-bleed container
- Background images have dark gradient overlay for text readability
- Auto-rotates every 5 seconds
- Progress dots show current position and countdown
- Prev/next arrows functional on desktop
- Swipe to change slide on mobile
- Framer Motion crossfade transition smooth
- Clicking slide navigates to article detail page
- Responsive: full width, maintains aspect ratio on all screens
- Pauses auto-rotate on hover (desktop)

**Files to create/modify**:
- `src/components/articles/HeroCarousel.jsx`

---

### TASK 4: Build CategorySwimlane component — Horizontal scroll row per category
**Status**: Stub created
**Description**: Reusable horizontal scrolling row of articles for each category. Shows "Category Name" + "See All" link as header. Grid of article cards (4-6 visible depending on screen size) with snap points. Left/right arrow buttons on desktop to scroll (hidden on mobile). Lazy-load images as they enter viewport. "See All" link navigates to category page with all articles.
**Dependencies**: TASK 1, TASK 5 (ArticleCard)
**Acceptance Criteria**:
- Renders horizontal scrollable container with smooth snap
- Shows category name as header
- "See All" link navigates to /category/:name
- Article cards lazy-load images
- Arrow buttons scroll container (desktop only, hidden on mobile)
- Scroll follows momentum/inertia on mobile
- Responsive: shows 2 cards on mobile, 4 on tablet, 6 on desktop
- Utilizes Intersection Observer for lazy loading

**Files to create/modify**:
- `src/components/categories/CategorySwimlane.jsx`

---

### TASK 5: Build ArticleCard component — Clickable card with preview
**Status**: Stub created
**Description**: Reusable article card component. Displays thumbnail image (16:9 aspect), title (1-2 lines), source, publication time (e.g., "2 hours ago"). On hover: scale up slightly (105%), show summary text overlay with gradient background. Click to navigate to article detail. Include skeleton loading variant for loading state.
**Dependencies**: TASK 1
**Acceptance Criteria**:
- Thumbnail image renders with 16:9 aspect ratio
- Title, source, time ago displayed below image
- Hover state: card scales to 105%, summary overlay appears
- Summary text is readable with dark gradient background
- Click navigates to `/article/:id`
- Skeleton variant shows placeholder while loading
- Responsive text sizing
- Image lazy-loads

**Files to create/modify**:
- `src/components/articles/ArticleCard.jsx`
- `src/components/articles/ArticleCardSkeleton.jsx`

---

### TASK 6: Build ArticleDetail page/modal — Full article view
**Status**: Plan
**Description**: Route `/article/:id` displays full article. Shows large thumbnail image, article title, source + publication time, full summary text, "Read Full Article" button (external link), related articles (3-4 cards below), share buttons (Twitter, Facebook, LinkedIn, copy link), bookmark toggle button. Can be modal overlay or full page. Modal variant closes with X button or backdrop click.
**Dependencies**: TASK 1, TASK 5 (ArticleCard for related articles)
**Acceptance Criteria**:
- Route `/article/:id` loads and displays article data
- Large hero image with title overlay
- Full summary text readable with proper typography
- "Read Full Article" button opens external link in new tab
- Bookmark button toggles saved state, updates UI
- Share buttons open social media share dialogs (or copy link)
- Related articles section shows 3-4 similar articles as cards
- Loading state while fetching article
- 404 state if article not found
- Mobile: full page, close with back button
- Desktop: optional modal mode with backdrop

**Files to create/modify**:
- `src/pages/ArticleDetail.jsx`
- `src/components/articles/ShareButtons.jsx`

---

### TASK 7: Build SearchOverlay — Full-screen search interface
**Status**: Plan
**Description**: Full-screen search interface opens with "/" key or search icon click. Large search input with clear button. Debounced API search as user types (300ms delay). Results show as article cards grid. Keyboard navigation: arrow keys to move between results, Enter to select, Esc to close. Recent searches shown when input is empty. No results state. Search analytics.
**Dependencies**: TASK 1, TASK 5 (ArticleCard), Tanstack Query
**Acceptance Criteria**:
- Opens with "/" keystroke or search icon click
- Large, focused search input
- Debounced search (300ms) as user types
- Results grid updates in real-time
- Keyboard navigation (arrows, enter, esc)
- Shows recent searches when empty
- "No results" message if search yields nothing
- Close with Esc or backdrop click
- Mobile: full screen, closes properly
- Search term highlighting in results

**Files to create/modify**:
- `src/components/search/SearchOverlay.jsx`
- `src/hooks/useSearch.js`

---

### TASK 8: Build BookmarksPage — Saved articles grid
**Status**: Plan
**Description**: Route `/bookmarks` displays grid of all bookmarked articles. Uses same ArticleCard component. Remove button on each card with confirmation dialog. Empty state with message and link to home. Sort options (newest, oldest, alphabetical). Can be paginated or infinite scroll.
**Dependencies**: TASK 1, TASK 5 (ArticleCard), Tanstack Query
**Acceptance Criteria**:
- Route `/bookmarks` renders grid of saved articles
- Uses ArticleCard component for consistency
- Remove button on each card with confirmation
- Empty state displayed when no bookmarks
- Sort dropdown (newest saved, oldest saved, alphabetical)
- Grid responsive (1 col mobile, 2 col tablet, 3+ col desktop)
- LocalStorage or API-backed bookmarks
- Persists across sessions

**Files to create/modify**:
- `src/pages/BookmarksPage.jsx`
- `src/hooks/useBookmarks.js`

---

### TASK 9: API client layer — Tanstack Query hooks
**Status**: Stubs created
**Description**: Build API client and custom hooks for all data fetching. Use Tanstack Query (React Query) for caching, pagination, and state management. Hooks: `useArticles(category, page)`, `useArticle(id)`, `useCategories()`, `useBookmarks()`, `useSearch(query)`. Error handling, loading states. Configure API base URL from environment.
**Dependencies**: TASK 1, Tanstack Query installed
**Acceptance Criteria**:
- API client configured with VITE_API_URL
- All hooks use Tanstack Query for caching
- Error states handled gracefully
- Loading states available in components
- Pagination support for articles
- Search hook with debounce
- Bookmarks hook with mutation support (add/remove)
- Retry logic for failed requests
- Cache invalidation on mutations

**Files to create/modify**:
- `src/api/client.js` — HTTP client setup
- `src/hooks/useArticles.js`
- `src/hooks/useArticle.js`
- `src/hooks/useCategories.js`
- `src/hooks/useBookmarks.js`
- `src/hooks/useSearch.js`
- `src/api/queryClient.js` — Tanstack Query configuration

---

### TASK 10: Infinite scroll / pagination on category pages
**Status**: Plan
**Description**: Build category page (`/category/:name`) with all articles in that category. Implement infinite scroll using Intersection Observer. Load next page when user scrolls near bottom. Loading skeleton shown while fetching. Maintain scroll position on navigation. Support filter options (sort by date, popularity).
**Dependencies**: TASK 1, TASK 5 (ArticleCard), TASK 9 (API hooks)
**Acceptance Criteria**:
- Route `/category/:name` loads all articles in category
- Grid layout with ArticleCard components
- Infinite scroll triggers at bottom
- Loading skeletons appear while fetching next page
- Smooth scrolling behavior
- Sort/filter options available
- Maintains scroll position on back navigation
- Mobile responsive (1-3 columns based on screen)
- No duplicate articles loaded

**Files to create/modify**:
- `src/pages/CategoryPage.jsx`
- `src/hooks/useInfiniteArticles.js`

---

### TASK 11: Skeleton loading states for all components
**Status**: Plan
**Description**: Create skeleton/placeholder components for all major components to show during loading. ArticleCard, HeroCarousel, CategorySwimlane, article detail page. Use TailwindCSS for shimmer/pulse animations. Apply skeleton variant of components in loading state.
**Dependencies**: TASK 1
**Acceptance Criteria**:
- Skeleton components for: ArticleCard, HeroCarousel, CategorySwimlane
- Shimmer or pulse animation for skeletons
- Proper aspect ratios match real components
- Loading state triggered by isLoading from Tanstack Query
- Smooth transition from skeleton to real content

**Files to create/modify**:
- `src/components/articles/ArticleCardSkeleton.jsx`
- `src/components/articles/HeroCarouselSkeleton.jsx`
- `src/components/categories/CategorySwimllaneSkeleton.jsx`
- `src/components/common/SkeletonLoader.jsx`

---

### TASK 12: Dark/light theme toggle with persistence
**Status**: Plan
**Description**: Add theme toggle button in user menu. Switch between dark and light themes. Persist selection to localStorage. Update Tailwind `dark:` classes dynamically. Light theme should invert color palette appropriately.
**Dependencies**: TASK 1, TASK 2 (Navbar/Menu)
**Acceptance Criteria**:
- Theme toggle in user menu dropdown
- Saves preference to localStorage
- Persists across sessions
- Smooth transition between themes
- Light theme is properly inverted
- All components styled for both themes
- System preference detection on first visit

**Files to create/modify**:
- `src/hooks/useTheme.js`
- `src/contexts/ThemeContext.jsx`
- Update all theme-dependent components

---

### TASK 13: PWA support — Service worker, manifest, offline
**Status**: Plan
**Description**: Configure Progressive Web App features. Create `manifest.json` with app metadata. Implement service worker for offline support, caching strategy (cache-first for images, network-first for API). Install prompt. Add to home screen on mobile.
**Dependencies**: TASK 1, build tools configured
**Acceptance Criteria**:
- `manifest.json` created with app name, icons, theme colors
- Service worker registered and functional
- App installable on mobile (install prompt)
- Works offline with cached content
- Cache strategy: cache images, network-first for API
- Service worker version/update handling
- App icon displays on home screen
- Splash screen displays on mobile

**Files to create/modify**:
- `public/manifest.json`
- `src/service-worker.js`
- `src/registerServiceWorker.js`
- Update `index.html` with manifest and service worker

---

## 📁 Component Hierarchy

```
App
├── Layout
│   ├── Navbar (Desktop)
│   │   ├── Logo
│   │   ├── CategoryLinks
│   │   ├── SearchIcon
│   │   └── UserMenu
│   ├── MobileNav (Mobile)
│   │   ├── HomeIcon
│   │   ├── SearchIcon
│   │   ├── BookmarksIcon
│   │   └── ProfileIcon
│   ├── Routes
│   │   ├── Home
│   │   │   ├── HeroCarousel
│   │   │   ├── CategorySwimlane (x multiple)
│   │   │   └── Footer
│   │   ├── ArticleDetail
│   │   │   ├── ArticleCard (hero)
│   │   │   ├── ShareButtons
│   │   │   ├── RelatedArticles
│   │   │   └── BookmarkButton
│   │   ├── CategoryPage
│   │   │   ├── ArticleCard Grid
│   │   │   └── Pagination/InfiniteScroll
│   │   ├── BookmarksPage
│   │   │   └── ArticleCard Grid
│   │   ├── SearchOverlay
│   │   │   ├── SearchInput
│   │   │   ├── RecentSearches
│   │   │   └── Results Grid
│   │   └── NotFound
│   └── Footer (Desktop)
└── SearchOverlay (Portal)

ArticleCard
├── Image
├── Title
├── Source
├── TimeAgo
└── SummaryOverlay (Hover)
```

## 🔗 API Endpoints

The frontend consumes the upnews-api REST API:

- `GET /api/articles` — List articles (pagination)
- `GET /api/articles/:id` — Article detail
- `GET /api/articles/category/:category` — Articles by category
- `GET /api/categories` — List all categories
- `GET /api/search?q=query` — Search articles
- `POST /api/bookmarks` — Create bookmark
- `DELETE /api/bookmarks/:id` — Remove bookmark
- `GET /api/bookmarks` — List user bookmarks

See upnews-api documentation for full endpoint specs.

## 📱 Responsive Breakpoints

- **Mobile**: 0–639px (1 column, full width)
- **Tablet**: 640–1023px (2 columns, constrained width)
- **Desktop**: 1024px+ (3–6 columns, container max-width)

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

Outputs optimized bundle to `dist/`.

### Environment
- Development: `.env.local`
- Production: Set `VITE_API_URL` environment variable

## 📝 License

MIT — See LICENSE file

## 🤝 Contributing

See CONTRIBUTING.md for development guidelines.

## 📞 Support

For issues, feature requests, or questions:
- GitHub Issues: [upnews-frontend/issues](https://github.com/News-Uplifters/upnews-frontend/issues)
- Discord: [News Uplifters Community](https://discord.gg/newsuplifters)
