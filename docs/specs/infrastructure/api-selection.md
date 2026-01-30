# Infrastructure: API Selection Spec

## Purpose
Define the logic for determining which backend API environment to communicate with based on the deployment context.

## Environment Variables

The following environment variables are used to configure the application at build/runtime:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SITE_HOST` | The canonical hostname of the web deployment. |
| `NEXT_PUBLIC_API_BASE_URL` | The production API base URL. |
| `NEXT_PUBLIC_DEV_API_BASE_URL` | The development/staging API base URL. |

## External Dependencies

The application relies on a shared directory structure (likely a monorepo) to access common logic and constants:
- **Shared Validation**: `../../src/shared/validation/password.ts`
- **Shared Constants**: `../../constants/urls.json`

## Technical Requirement
- The `next.config.js` must have `experimental.externalDir: true` enabled to allow importing from these directories outside the project root.
- `experimental.typedRoutes: true` is enabled to ensure internal links are type-safe.

## Logic Flow

The application dynamically selects the API base URL based on the hostname where the site is currently being served.

### 1. Hostname Detection
The hostname is determined in order of priority:
1.  Explicitly provided hostname (if any).
2.  `window.location.hostname` (if running in the browser).
3.  `process.env.NEXT_PUBLIC_SITE_HOST` (if running server-side).
4.  `undefined`.

### 2. Environment Classification
A host is considered a **Development Host** if:
- It is `localhost` or `127.0.0.1`.
- It starts with `dev.`.
- It contains `.dev`.

### 3. Base URL Selection
The base URL is selected based on whether the host is a Development Host:

| Environment | Primary Source | Secondary Source (fallback) | Default Fallback |
| :--- | :--- | :--- | :--- |
| **Development** | `process.env.NEXT_PUBLIC_DEV_API_BASE_URL` | `urls.devApiBaseUrl` (from `urls.json`) | `http://localhost:8080` |
| **Production** | `process.env.NEXT_PUBLIC_API_BASE_URL` | `urls.prodApiBaseUrl` (from `urls.json`) | `http://localhost:8080` |

## Constraints
- `NEXT_PUBLIC_` environment variables must be available at build time for client-side use in Next.js.
- `urls.json` is a shared file located in the parent directory (`../constants/urls.json`).

## Invariants
- The API base URL must never be empty; it must fallback to a valid URL.
- Development hostnames must be explicitly checked to avoid accidentally sending dev traffic to production APIs.
