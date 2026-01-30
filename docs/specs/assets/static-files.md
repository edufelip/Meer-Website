# Static Assets Specification

## Purpose
Define the static resources required for the application's visual identity and external references.

## Images & Icons

| File | Purpose | Resolution/Format |
| :--- | :--- | :--- |
| `/assets/images/app-icon.png` | Main brand icon used on the Landing Page. | PNG (64x64 displayed) |
| `/badges/app-store.svg` | Official Apple App Store download badge. | SVG |
| `/badges/google-play.png` | Official Google Play Store download badge. | PNG |

## Documents
- **Privacy Policy**: `/assets/documents/privacy_policy.pdf`
    - Must be updated in sync with mobile app requirements.

## Technical Rules
- All assets must be optimized for web delivery.
- SVG is preferred for icons to ensure sharpness across all screen densities (Retina/High-DPI).
- The directory structure in `public/` must be preserved to prevent broken links in external marketing materials.
