# Infrastructure: Testing Strategy

## Purpose
Define the multi-layered testing approach used to ensure the reliability and quality of the Guia Brechó ecosystem.

## Testing Layers

### 1. Unit & Integration Tests (Jest)
- **Scope**: Domain logic, use cases, utility functions, and shared components.
- **Location**: Adjacent to modules (`*.test.ts`) or in `__tests__/` directories.
- **Framework**: Jest with `jest-expo` and `react-test-renderer`.
- **Coverage**: Includes domain entities, network clients, and storage wrappers.

### 2. End-to-End (E2E) Tests (Detox)
- **Scope**: Critical user flows in the mobile application (iOS/Android).
- **Location**: `/e2e/`.
- **Framework**: Detox.
- **Key Flows Tested**:
    - **Smoke Test**: Basic app launch and navigation.
    - **Auth Flows**: Login, signup, and profile setup.
    - **Search & Discovery**: Searching for stores and browsing categories.
    - **Favorites**: Toggling store favorites and viewing the favorites tab.
    - **Content**: Reading articles and navigating deep links.

### 3. Web Testing
- **Scope**: Companion web apps (`/web` and `/site`).
- **Status**: Basic linting and build checks are configured.

## Mocking Strategy

### Local Mock Server (`/mock-server`)
A custom Express-based server used to simulate the backend API during development and E2E testing.
- **Usage**: Allows testing without a live Internet connection or a staging backend.
- **Commands**: `npm run mock:server`.
- **Scripts**: `run-e2e-mock.js` automates the process of starting the mock server before running Detox tests.

### API Base URL Injection
A utility script `scripts/with-api-base-url.js` is used to dynamically inject the mock server URL into the build environment for E2E tests:
- Example: `node scripts/with-api-base-url.js --base-url http://localhost:4010 -- npm run e2e:build:ios`
