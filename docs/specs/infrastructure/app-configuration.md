# Infrastructure: Mobile App Configuration

## Purpose
Document the dynamic configuration of the mobile application across different environments and platforms.

## Build Environments

The app distinguishes between **Production** and **Development/Staging** builds using the `EXPO_PUBLIC_ENV` environment variable.

| Property | Development (`non-prod`) | Production (`prod`) |
| :--- | :--- | :--- |
| **App Name** | `Guia Brechó Dev` | `Guia Brechó` |
| **Package / Bundle ID** | `com.edufelip.meer.dev` | `com.edufelip.meer` |
| **API Base URL** | `devApiBaseUrl` | `prodApiBaseUrl` |

## Dynamic Configuration (`app.config.js`)
The `app.config.js` script dynamically modifies the base `app.json` during the build process:

### 1. Intent Filters (Android)
Automatically generates intent filters for the following domains to support App Links:
- `https://[webBaseUrl]/`
- `https://[webBaseUrl]/store/*`
- `https://[webBaseUrl]/content/*`
- Includes `www.` variants of the above.

### 2. Associated Domains (iOS)
Injects `applinks:[hostname]` into the iOS entitlements to support Universal Links.

### 3. Native Plugins
- **Firebase Crashlytics**: Configured for both platforms with `SYMBOL_TABLE` debug level on Android.
- **Expo Build Properties**: Enables Proguard and resource shrinking for Android release builds.
- **Expo Location**: Configures the permission message for accessing user location.
- **Google Sign-In**: Integrated via `@react-native-google-signin/google-signin`.

## Invariants
- Production builds must use a real API host. A safety check in `app.config.js` throws an error if `prodApiBaseUrl` points to `localhost` in a production build unless `EXPO_PUBLIC_ALLOW_LOCAL_API` is set.
- The `scheme` for deep linking is hardcoded as `meer://`.
