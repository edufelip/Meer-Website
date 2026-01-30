# Deep Linking Fallbacks & UI Spec

## Purpose
Define the behavior when a user visits a deep-link-enabled URL but does not have the mobile application installed.

## Expected Behavior

### 1. Automatic Redirection (Content Pages Only)
When a user lands on `/content/[id]`:
- The page displays a "Redirecting" card.
- A timer is started (`REDIRECT_DELAY_MS = 1800`).
- After the timer expires, the browser attempts to redirect the user to the platform-specific app store.
- **Cancellation**: The user can manually cancel the automatic redirection by clicking "Ficar no site".
- **Note**: This behavior is **NOT** present on `/store/[id]` pages. Store pages require a manual click to redirect.

### 2. Manual Trigger ("Open in App")
The `OpenInAppButton` component provides a way to manually attempt opening the app.
- **Input**: `deepLink` (e.g., `meer://content/123`).
- **Logic**:
    1. Browser attempts to navigate to the `meer://` custom scheme.
    2. A secondary timer is started (`2500ms`).
    3. If the page is still visible (`!document.hidden`) after the timer, it assumes the app is not installed.
    4. Browser redirects to the platform-specific app store.

### 3. Technical Header Requirements
To ensure OSs correctly parse the deep linking configuration, the following headers must be set by the server (configured in `next.config.js`):
- `/.well-known/apple-app-site-association`: `Content-Type: application/json`
- `/.well-known/assetlinks.json`: `Content-Type: application/json`

## Store Detection Logic
The system identifies the user's platform via the `User-Agent` string:
- **Android**: Redirects to `https://play.google.com/store/apps/details?id=com.edufelip.meer`.
- **iOS (iPhone/iPad/iPod)**: Redirects to `https://apps.apple.com/us/app/id6756424043`.
- **Desktop/Other**: No automatic redirection occurs; only manual buttons are available.

## Constraints
- Automatic redirection must not occur if the user has explicitly cancelled it.
- Redirection delay must be long enough for the OS to attempt opening the app first, but short enough to not annoy users.

## Edge Cases
- **User returns to browser from App Store**: The timer/redirect logic should not trigger again or cause a loop if the user navigates back. (Currently handled by basic state in the component).
- **In-app browsers (Instagram, Facebook)**: Often block custom scheme redirection or automatic store redirects. Behavior may vary.

## Invariants
- `deepLink` URLs must use the `meer://` scheme.
- App store IDs and package names must be kept in sync with `src/urls.ts`.
