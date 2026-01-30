# Infrastructure: Styling Strategy

## Purpose
Define the styling patterns and technologies used to create the visual interface of the mobile and web applications.

## Mobile Styling: NativeWind
The mobile application uses **NativeWind (Tailwind CSS for React Native)**.

### 1. Global Configuration
- **Entry Point**: `global.css` (root).
- **Architecture**: Utility-first CSS classes that are compiled into React Native `StyleSheet` objects.
- **File Coverage**: The `tailwind.config.js` at the root includes paths for `./app/`, `./components/`, and `./src/`.

### 2. Theming
- **Mode**: Supports `automatic` user interface style (Light/Dark).
- **Navigation Themes**: Integrates with `@react-navigation/native` themes (`DefaultTheme`, `DarkTheme`) via the `ThemeProvider`.

### 3. Visual Primitives
- **Tailwind Classes**: Standard classes like `flex-1`, `bg-white`, `text-neutral-900` are used directly in components.
- **Customizations**: The brand color `accent` is defined in the tailwind config to match the web identity (`#b45309`).

## Web Styling: Tailwind CSS
Both `/site` and `/web` use standard Tailwind CSS.
- **Consistency**: Shared color variables (e.g., `--accent`) ensure that the "amber" brand identity is consistent across platforms, even though the underlying styling engines (PostCSS for web, NativeWind for mobile) differ.

## Invariants
- UI components should prioritize utility classes over inline `style` objects for maintainability.
- Accessibility-related styling (e.g., focus states, high contrast) must be preserved across both platforms.
