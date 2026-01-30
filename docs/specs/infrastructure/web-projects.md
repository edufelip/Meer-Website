# Infrastructure: Web Projects Comparison

## Purpose
Clarify the coexistence of two distinct web projects in the repository and their respective roles.

## Comparison Overview

The repository contains two Next.js projects: `/site` and `/web`. They serve completely different audience segments and functional requirements.

| Feature | `/site` (Companion) | `/web` (Dashboard) |
| :--- | :--- | :--- |
| **Primary Audience** | Public Users / Mobile Users | Admins / Business Owners |
| **Authentication** | None (Stateless) | Token-based (JWT) |
| **Core Function** | Redirection, Reset Password | Data Management, Analytics |
| **Backend Integration** | Direct Fetch to API | Middleware Proxy (`/api/*`) |
| **Key Technologies** | Next.js (App Router) | Next.js, React Query, Middleware |

## `/site`: The Bridge
- **Role**: Acts as the public identity and deep-link handler for the mobile ecosystem.
- **Critical Flow**: Password Reset. This is the only "write" operation, requiring a valid token from a URL parameter.
- **Deployment**: Typically served at the root domain (`guiabrecho.com.br`).

## `/web`: The Management Suite
- **Role**: A dashboard for managing store data, content, and system configuration.
- **Middleware Proxy**: Uses a `middleware.ts` to rewrite requests starting with `/api/` to the appropriate backend (Development vs. Production).
- **Dashboard logic**:
    - Proxies `/api/dashboard/stores/` to the backend `/stores/` endpoint.
    - Handles token validation and redirects unauthenticated users to `/login`.
- **Deployment**: Likely served at a subdomain (e.g., `admin.guiabrecho.com.br` or `dashboard.guiabrecho.com.br`).

## Shared Logic
- Both projects use Tailwind CSS for styling.
- Both projects utilize the shared `constants/urls.json` for environment-aware routing.
- Both projects implement identical logic for `isDevHost` classification.
