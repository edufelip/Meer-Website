# Localization & Accessibility Spec

## Purpose
Define the language support and accessibility standards for the web application.

## Language Support
- **Primary Language**: Portuguese (Brazil) - `pt-BR`.
- **Scope**: All user-facing strings, metadata, and form labels are hardcoded in Portuguese.
- **Dynamic Content**: IDs and names passed via URLs are expected to be compatible with Portuguese naming conventions (accents, etc.).

## Accessibility (a11y)
The application follows basic web accessibility standards:
- **Language Attribute**: `<html lang="pt-BR">` is set globally.
- **ARIA Labels**: Used on store links (e.g., `aria-label="Download Guia Brechó on the App Store"`).
- **Form Labels**: Explicit `<label>` tags linked to input IDs.
- **Alt Text**: Provided for the main brand icon.
- **Keyboard Navigation**: Focus states are clearly defined with an amber outline for interactive elements.

## Constraints
- Multi-language support (i18n) is currently **not** a requirement.
- All technical error messages from the backend should ideally be translated before display (current logic fallbacks to a generic Portuguese message).
