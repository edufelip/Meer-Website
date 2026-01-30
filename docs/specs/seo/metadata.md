# SEO & Metadata Specification

## Purpose
Define how the application presents itself to search engines and social media platforms through static and dynamic metadata.

## Global Metadata
Defined in the root layout, these apply to all pages unless overridden.
- **Title Template**: `Guia Brechó`
- **Description**: `Guia Brechó. Descubra brechós com calma.`
- **Language**: `pt-BR`

## Dynamic Metadata

### Content Pages (`/content/[id]`)
- **Title**: `Guia Brechó - Conteúdo [ID]`
- **Description**: `Abra o Guia Brechó para ver este conteúdo.`
- **Constraint**: The `[ID]` is decoded from the URL parameter for display.

### Store Pages (`/store/[id]`)
- **Title**: `Guia Brechó - Loja [ID]`
- **Description**: `Abra o Guia Brechó para ver esta loja.`
- **Constraint**: The `[ID]` is decoded from the URL parameter for display.

## Open Graph & Social Sharing
While not explicitly configured with `openGraph` objects in the code, the standard `title` and `description` tags are provided which most platforms fallback to.

## Invariants
- Dynamic IDs must be `decodeURIComponent`-ed before being placed in metadata tags to ensure special characters (spaces, accents) are rendered correctly.
