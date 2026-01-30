# System Overview: Guia Brechó Ecosystem

## Purpose
This document provides a high-level architectural map of the Guia Brechó project, which consists of a cross-platform mobile application and a companion web site.

## Repository Structure

The project is organized as a monorepo (or a loosely coupled multi-module project) with the following key areas:

| Directory | Purpose | Technology |
| :--- | :--- | :--- |
| `/` (root) | Mobile Application Core | React Native / Expo |
| `/site` | Companion Web Site | Next.js (App Router) |
| `/src` (root) | Shared Domain & Data Logic | TypeScript (Clean Architecture) |
| `/ios`, `/android` | Native platform projects | Swift / Kotlin (Managed by Expo) |

## Core Architectural Layers (Shared `src`)

The shared logic follows Clean Architecture principles to ensure business rules are decoupled from UI frameworks.

### 1. Domain Layer (`/src/domain`)
The heart of the application, containing:
- **Entities**: Core business objects (e.g., `ThriftStore`, `GuideContent`, `User`, `Category`).
- **Repositories (Interfaces)**: Contracts for data persistence and retrieval.
- **Use Cases**: Specific business actions (e.g., `GetNearbyThriftStores`, `ToggleFavorite`, `RegisterPushToken`).

### 2. Data Layer (`/src/data`)
Implementation of the domain interfaces:
- **Repositories**: Orchestrate data from multiple sources.
- **Data Sources**: Concrete implementations for API (Supabase/REST) and Local Storage (AsyncStorage).

### 3. Presentation Layer (`/src/presentation`)
Platform-specific UI logic (primarily for mobile):
- **State**: Global state management (Zustand/React Query).
- **Hooks**: Reusable UI logic.
- **Components/Screens**: Atomic design units and full-page views.

## Major Functional Domains

1.  **Thrift Store Discovery**: Geolocation-based search, categorization, and store profiles.
2.  **Community Content**: User-generated or curated articles, tips, and trends regarding thrift shopping.
3.  **User Profiles & Engagement**: Favorites, ratings, comments, and account management.
4.  **Notifications**: Push notification registration and handling for updates and engagement.

## Inter-System Communication
- **API**: Both mobile and web share the same backend API (documented in `site/docs/specs/infrastructure/api-selection.md`).
- **Deep Linking**: The web site facilitates navigation into the mobile app (documented in `site/docs/specs/deep-linking/routing.md`).
- **Validation**: Shared logic for complex validations (e.g., `password.ts`) is used across both platforms.
