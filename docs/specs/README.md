# Guia Brechó Web Specifications

This directory contains the formal specifications for the Guia Brechó web application. This application serves as the web companion to the Guia Brechó mobile app, providing deep linking support, authentication flows (password reset), and a landing page.

## System Architecture

The application is built with Next.js (App Router) and serves as a bridge between the web and the mobile ecosystem.

### Major Domains

1.  **[Deep Linking](./deep-linking/routing.md)**: Handling Universal Links (iOS) and App Links (Android) for content and store pages, including fallback mechanisms to app stores.
2.  **[Authentication](./auth/password-reset.md)**: Web-based password reset flow triggered by email links.
3.  **[Landing Page](./landing/home.md)**: Primary entry point for web users, facilitating mobile app discovery and downloads.
4.  **[Infrastructure](./infrastructure/api-selection.md)**: Environment-aware configuration and API communication logic.
5.  **[UI System](./ui/design-system.md)**: Design tokens, typography, and reusable visual patterns.
6.  **[Legal](./legal/privacy-policy.md)**: Access to privacy policy and static legal documents.
7.  **[SEO & Metadata](./seo/metadata.md)**: Dynamic page titles, descriptions, and search engine optimization.
8.  **[Static Assets](./assets/static-files.md)**: Management of icons, badges, and documents.
9.  **[Localization & Accessibility](./localization/language.md)**: Language support and accessibility standards.
10. **[Pending Decisions](./pending-decisions.md)**: Identified TODOs, technical debt, and open questions.

## Source of Truth

These specifications are derived from the existing implementation in the `site/` repository and shared constants/logic in the parent repository structure.

- **Mobile App Identifiers**:
    - **iOS App ID**: `L4N9Z3Z82V.com.edufelip.meer`
    - **Android Package**: `com.edufelip.meer`
    - **URL Scheme**: `meer://`
- **Official Domains**:
    - `guiabrecho.com.br`
    - `api.guiabrecho.com.br`
