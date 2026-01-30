# Navigation: Mobile App Structure

## Purpose
Define the navigation hierarchy and routing architecture of the Guia Brechó mobile application.

## Routing Engine
The mobile app uses **Expo Router (File-based routing)**, located in the `app/` directory (root).

## Navigation Hierarchy

### 1. Root Layout (`app/_layout.tsx`)
- Provides the global context (Providers, Theme, Notifications).
- Orchestrates the transition between Auth and Main App states.
- Handles top-level Modals.

### 2. Main Tab Navigation (`app/(tabs)/`)
The primary user interface is organized into a Bottom Tab Bar:
- **Home**: Featured content, nearby stores, and search bar.
- **Categories**: Browse stores filtered by niche (Vintage, Luxury, etc.).
- **Favorites**: List of stores saved by the user.
- **Profile**: Account management, settings, and support.

### 3. Modal Routes (`app/modal.tsx`)
Used for focused, temporary interactions that overlap the main navigation (e.g., specific filters or settings).

## Deep Link Integration
The mobile navigation structure mirrors the web structure to support seamless deep linking:
- `meer://store/[id]` maps to the Store details screen.
- `meer://content/[id]` maps to the Content reader screen.

## Invariants
- Tab navigation is only accessible to authenticated users (or anonymous users with limited features).
- The `Home` tab serves as the "Default" landing state when the app is opened without a deep link.
- State persistence is handled via `zustand` or `AsyncStorage`, ensuring the user returns to their previous context if the app is backgrounded.
