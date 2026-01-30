# Guia Brechó Specification Index

This document serves as the master entry point for the specifications of the entire Guia Brechó ecosystem.

## 🌍 System-Wide Specifications
- **[System Overview](./system-overview.md)**: Architecture, monorepo structure, and technology stack.
- **[Thrift Stores & Discovery](./domain/thrift-stores.md)**: Business logic for finding and managing stores.
- **[Content & Community](./domain/content-community.md)**: Articles, comments, and engagement logic.
- **[User & Notifications](./domain/user-notifications.md)**: Accounts, profiles, and push notification handling.

## 🛠 Infrastructure & Tooling
- **[Mobile App Configuration](./infrastructure/app-configuration.md)**: Dynamic build environments, App Links, and native plugins.
- **[Testing Strategy](./infrastructure/testing-strategy.md)**: Unit tests, Detox E2E, and the mock server workflow.
- **[Data & Persistence](./infrastructure/data-persistence.md)**: REST API integration, AsyncStorage caching, and session management.
- **[Styling Strategy](./infrastructure/styling.md)**: NativeWind (mobile) and Tailwind (web) implementation.
- **[API Selection](./infrastructure/api-selection.md)**: Environment variables and backend discovery logic.

## 📱 Mobile UI & Navigation
- **[Mobile Structure](./navigation/mobile-structure.md)**: Expo Router, Root Layout, and Tab Navigation.
- **[Component Architecture](./ui/mobile-components.md)**: Base UI primitives vs. Feature-specific components.
