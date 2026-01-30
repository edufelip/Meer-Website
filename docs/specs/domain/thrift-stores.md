# Domain: Thrift Stores & Discovery

## Purpose
Define the business rules and data structures for discovering and managing thrift stores (brechós).

## Core Entity: `ThriftStore`
A thrift store is the primary entity of the system.
- **Identity**: Unique ID.
- **Location**: Latitude and longitude for map placement and distance calculation.
- **Metadata**: Name, address, contact info (phone, social), and description.
- **Categorization**: Links to one or more categories (e.g., "Vintage", "Luxury", "Charity").
- **Engagement**: Ratings (average and count), favorite status for the current user.

## Primary Use Cases

### 1. Discovery
- **GetNearbyThriftStores**: Retrieve stores within a specific radius of the user's coordinates.
- **SearchThriftStores**: Text-based search across name and description.
- **GetStoresByCategory**: Filter stores by specific niche or type.
- **GetFeaturedThriftStores**: Curated list of stores for the home screen.

### 2. Interaction
- **GetThriftStoreById**: Detailed view of a specific store.
- **ToggleFavoriteThriftStore**: Add or remove a store from the user's personal favorites.
- **IsFavoriteThriftStore**: Check current status for UI state.

### 3. Management (Admin/Owner)
- **CreateOrUpdateStore**: Logic for adding new stores or updating existing information.
- **ConfirmStorePhotos**: Process for validating and attaching images to a store profile.

## Repository Interface: `ThriftStoreRepository`
Expected methods include:
- `findById(id: string): Promise<ThriftStore | null>`
- `listNearby(params: LocationParams): Promise<ThriftStore[]>`
- `search(query: string): Promise<ThriftStore[]>`
- `save(store: ThriftStore): Promise<void>`

## Invariants
- A store must have valid coordinates to be listed in "Nearby" results.
- Rating average must be recalculated or updated whenever a new rating is submitted.
