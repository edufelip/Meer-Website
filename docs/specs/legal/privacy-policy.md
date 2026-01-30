# Legal & Privacy Specification

## Purpose
Define the availability and accessibility of legal documents within the web application.

## Privacy Policy
The privacy policy is served as a static document to ensure users of both the web and mobile apps can access the terms of data usage.

- **Location**: `/assets/documents/privacy_policy.pdf`
- **Accessibility**: This file must be publicly reachable at `https://guiabrecho.com.br/assets/documents/privacy_policy.pdf`.

## Metadata & SEO
The application includes metadata in `RootLayout` to identify the brand and app purpose:
- **Default Title**: `Guia Brechó`
- **Default Description**: `Guia Brechó. Descubra brechós com calma.`

## Technical Rules
- The static PDF must be included in the `public` directory to be served by Next.js.
- SEO tags must be localized to `pt-BR`.
