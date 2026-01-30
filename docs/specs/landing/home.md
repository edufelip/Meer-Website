# Landing Page Specification

## Purpose
The home page serves as the primary marketing and discovery entry point for the Guia Brechó mobile application.

## Scope
- Branding elements.
- Store download links.
- Responsive design for mobile and desktop.

## Components

### 1. Brand Identity
- **Logo**: Displayed using the app icon (`/assets/images/app-icon.png`).
- **Brand Name**: "Guia Brechó".
- **Tagline**: "Descubra brechós perto de você".

### 2. Store Badges
Two primary call-to-action links are provided:
- **App Store (iOS)**:
    - Link: `https://apps.apple.com/us/app/id6756424043`
    - Icon: `/badges/app-store.svg`
- **Google Play (Android)**:
    - Link: `https://play.google.com/store/apps/details?id=com.edufelip.meer`
    - Icon: `/badges/google-play.png`

## Expected Behavior
- Clicking a store badge opens the respective store in a new tab (`_blank`).
- The layout is centered both vertically and horizontally.
- Modern visual style using Tailwind CSS, with hover animations on buttons.

## Non-Goals
- Providing web-based browsing of brechós. The site is currently a redirector and marketing page, not a full web app version of the mobile app.

## Invariants
- Store links must always be visible and accessible.
- The branding must remain consistent with the mobile application's visual identity.
