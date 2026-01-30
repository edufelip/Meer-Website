# UI System & Design Tokens

## Purpose
Define the visual language, typography, and reusable UI patterns used across the Guia Brechó web application to ensure consistency with the brand.

## Design Tokens

### Colors (CSS Variables)
| Token | Value | Description |
| :--- | :--- | :--- |
| `--bg` | `#fff7ed` | Primary background (warm white) |
| `--bg-2` | `#fdebd3` | Secondary background / Gradient end |
| `--ink` | `#1f2937` | Primary text color (dark gray) |
| `--ink-soft` | `#4b5563` | Secondary/Helper text |
| `--accent` | `#b45309` | Primary brand color (amber) |
| `--accent-2` | `#f59e0b` | Secondary brand color |
| `--card` | `#ffffff` | Surface color for cards |
| `--border` | `#f3e3cc` | Border color for inputs and cards |

### Typography
- **Display Font**: `Space Grotesk` (Variable)
    - Used for headings (`h1`, `h3`).
- **Body Font**: `Lexend` (Variable)
    - Used for paragraph text, labels, and UI elements.
- **Fallback**: `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.

## UI Components & Patterns

### 1. The "Page" Layout
- **Gradient Background**: A radial gradient from top-left to bottom-right.
- **Decorative Elements**: Pseudo-elements (`::before`, `::after`) create soft amber glows in the background corners.
- **Responsive Padding**: Uses `clamp(24px, 5vw, 64px)` for flexible spacing.

### 2. Buttons
- **Primary**: Gradient background (`--accent` to `--accent-2`), rounded (pill), white text, shadow.
- **Secondary**: White background, `--accent` text, `--border` border.
- **Hover State**: Elevates slightly (`translateY(-1px)`) and increases shadow depth.

### 3. Cards
- Rounded corners (`20px`).
- Subtle border and soft shadow.
- Background set to `--card`.

### 4. Forms
- **Inputs**: Rounded corners (`14px`), white background, `--border` border.
- **Focus State**: Amber outline with 35% opacity.
- **Strength Bar**: Dynamic width and color based on password complexity (Orange -> Amber -> Green).

## Responsive Constraints
- **Breakpoints**: 
    - Mobile: `< 600px` (Actions stack vertically, inputs take full width).
- **Spacing**: Uses `clamp` functions for fluid typography and gaps.
