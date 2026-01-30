# Deep Linking Routing Spec

## Purpose
Establish the configuration and endpoints required for the mobile application to intercept web URLs and open corresponding content natively.

## Scope
- iOS Universal Links configuration (`apple-app-site-association`)
- Android App Links configuration (`assetlinks.json`)
- Supported URL patterns

## Definitions
- **Universal Links (iOS)**: Apple's standard for connecting a website to an app.
- **App Links (Android)**: Google's standard for connecting a website to an app.

## Supported Routes
The following paths are designated for deep linking:

| Web Path | Mobile Deep Link | Description |
| :--- | :--- | :--- |
| `/content/[id]` | `meer://content/[id]` | Direct access to a specific content/article |
| `/store/[id]` | `meer://store/[id]` | Direct access to a specific store profile |

## Configuration

### 1. Browser/OS Discovery (Meta Tags)
The application includes metadata in the root layout to help browsers and OSs discover the mobile app counterparts.

- **iOS Smart App Banner**: Facilitates discovery when viewing the site in Safari.
- **App Links Meta**: Standard metadata for app association.

**Invariants**:
- `app_store_id`: `6756424043`
- `package`: `com.edufelip.meer`
- `app_name`: `Guia Brechó`

### 2. iOS (Apple App Site Association)
**File**: `public/.well-known/apple-app-site-association`
**MIME Type**: `application/json`

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "L4N9Z3Z82V.com.edufelip.meer",
        "paths": ["/content/*", "/store/*"]
      }
    ]
  }
}
```

### Android (Asset Links)
**File**: `public/.well-known/assetlinks.json`
**MIME Type**: `application/json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.edufelip.meer",
      "sha256_cert_fingerprints": [
        "D9:E4:1E:44:31:35:61:0B:CB:84:94:EC:09:19:71:17:74:2A:0B:60:78:35:8A:2B:16:68:E8:2F:9B:5B:8C:AC",
        "7E:4A:73:D5:6F:C9:2E:F9:EC:DB:E6:A4:F1:F8:DF:66:C9:A9:89:10:B4:B1:6C:85:32:B9:93:DC:38:FD:FB:40"
      ]
    }
  }
]
```

## Constraints
- The files must be served over HTTPS.
- The files must be located in the `.well-known` directory.
- For iOS, the `appID` must match the `TeamID.BundleID`.
- For Android, the `sha256_cert_fingerprints` must match the production signing key and/or Google Play App Signing key.

## Invariants
- Any change to the mobile app's bundle ID or package name must be reflected here immediately to prevent link breakage.
