# Domain: Content & Community

## Purpose
Define the system for curated and user-generated content related to the thrift store ecosystem.

## Core Entities

### 1. `GuideContent`
A blog-style article or tip.
- **Content**: Title, body text, and images.
- **Engagement**: Like count, comment count.
- **Status**: Published, draft, or deleted.

### 2. `ContentComment`
User feedback on a specific piece of content.
- **Relationship**: Belongs to a `GuideContent`.
- **Author**: Links to a `User` profile.
- **Text**: Content of the comment.

## Primary Use Cases

### 1. Consumption
- **GetHomeUseCase**: Aggregates featured content and stores for the initial app view.
- **GetGuideContentById**: Detailed retrieval for the content reader view.
- **GetContentComments**: Paginated retrieval of comments for an article.

### 2. Engagement
- **LikeContent / UnlikeContent**: User sentiment tracking.
- **CreateContentComment**: Allows users to participate in the community.
- **DeleteContentComment**: Moderation or user-led removal of their own contributions.

### 3. Creation (Curators)
- **CreateContent / UpdateContent**: Management of the guide articles.
- **RequestContentImageUpload**: Infrastructure for attaching media to articles.

## Invariants
- Content must be "Published" to be visible to standard users.
- A user cannot like the same piece of content multiple times.
- Comments must be associated with a valid user and a valid content ID.
