# Data & Persistence Specification

## Purpose
Define the strategies and technologies for data retrieval, caching, and local storage.

## Data Source Architecture

The system employs a dual-datasource strategy for high performance and offline capability.

### 1. Remote Data (REST API)
- **Engine**: Custom `HttpClient` (using `axios` or `fetch`).
- **Endpoint Discovery**: Centrally managed in `src/network/endpoints.ts`.
- **Implementation**: `Http[Entity]RemoteDataSource.ts` files handle API interaction, mapping raw JSON to Domain Entities.

### 2. Local Persistence (AsyncStorage)
Used for session management and performance caching.
- **Technology**: `@react-native-async-storage/async-storage`.
- **Stored Data**:
    - **User Identity**: Cached in `AsyncStorageUserLocalDataSource`.
    - **Profiles**: Personal details stored in `AsyncStorageProfileLocalDataSource`.
    - **Categories**: Store niche categories are cached to allow instant browsing.
    - **Home Cache**: Recent featured content and stores.
    - **Push Tokens**: Persisted locally to handle refresh and unregistration.

## Session Management
- **Auth Token**: Stored securely in `authStorage.ts`.
- **Validation**: On app launch, the system verifies the token via `useValidateToken` hook.

## Network Reliability
- **NetInfo**: The app monitors network connectivity via `@react-native-community/netinfo`.
- **Caching Policy**: The `AsyncStorageHomeCache` allows the app to display content even when offline, updating the UI once the network becomes available.

## Invariants
- Local cache must be cleared on logout to prevent data leakage between user sessions.
- Domain Repositories are responsible for orchestrating the choice between Local and Remote data sources.
