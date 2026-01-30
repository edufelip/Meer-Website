# Domain: User, Profile & Notifications

## Purpose
Manage user identity, personalization, and proactive engagement via push notifications.

## Core Entities

### 1. `User` / `AuthUser`
- **Identity**: Email, unique ID.
- **Account Status**: Active or Deleted.

### 2. `Profile`
- **Personalization**: Avatar, Display Name, Bio.
- **Preferences**: Notification settings, cached data.

### 3. `PushNotification`
- **Payload**: Title, body, and navigation data (deep links).
- **Status**: Received, Opened.

## Primary Use Cases

### 1. Account Management
- **GetCurrentUser / GetProfile**: Retrieval of identity and personal data.
- **UpdateProfile**: Editing name and avatar.
- **DeleteAccount**: Compliance with privacy regulations (Right to be Forgotten).

### 2. Push Notifications
- **RegisterPushToken**: Link a device to a user account for notifications.
- **UnregisterPushToken**: Cleanup on logout.
- **ObservePushTokenRefresh**: Ensure the device token is always up to date.
- **SyncPushTopics**: Manage subscription to categories or news.
- **ObserveNotificationOpen**: Track engagement and handle navigation when a user taps a notification.

## Invariants
- A push token must be unique per device.
- Sensitive user data (like passwords) is handled by the `AuthRepository` and never exposed via `Profile`.
- Account deletion must trigger the cleanup of push tokens and personal identifiers.

## Push Notification Strategy
- The system supports both Firebase Cloud Messaging (FCM) and Apple Push Notification service (APNs), typically abstracted by a service like Expo Notifications or Supabase.
