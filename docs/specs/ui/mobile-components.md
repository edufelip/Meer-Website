# UI: Mobile Component Architecture

## Purpose
Define the organization and responsibility of UI components within the mobile application.

## Component Categories

The mobile UI is split into two distinct tiers to balance reusability and business logic.

### 1. Base UI Primitives (`/components/`)
Highly reusable, generic components that form the "UI Kit" of the app.
- **Theming**: Components like `themed-text.tsx` and `themed-view.tsx` automatically adapt to Light/Dark modes.
- **Interactions**: `external-link.tsx` (browser integration), `haptic-tab.tsx` (sensory feedback).
- **Layout Patterns**: `parallax-scroll-view.tsx`.
- **Atomic UI**: The `/components/ui/` directory contains standard elements (buttons, inputs, etc.) styled with NativeWind.

### 2. Feature Components (`/src/presentation/components/`)
Business-aware components that represent specific entities or complex app-specific layouts.
- **Store UI**: `NearbyThriftListItem.tsx`, `FavoriteThriftCard.tsx`, `ThriftAvatar.tsx`.
- **Discovery**: `FeaturedThriftCarousel.tsx`, `FilterChips.tsx`, `NearbyMapCard.tsx`.
- **Content**: `GuideContentCard.tsx`.
- **Layout**: `AppHeader.tsx`, `SectionTitle.tsx`.

## Presentation Logic
- **State Integration**: Components in `src/presentation` typically consume domain data or global state via hooks.
- **Atomic Design**: The app follows a simplified atomic design, where components in the root `components/` are "Atoms/Molecules" and `src/presentation/components` are "Organisms".

## Invariants
- Base components (`/components`) must NOT depend on domain logic or specific repositories.
- Custom fonts and styles defined in `global.css` must be applied consistently via NativeWind classes.
