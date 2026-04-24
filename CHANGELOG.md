# Changelog

All notable changes to the WriteSpace Blog project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-01

### Added

- **Public Landing Page**
  - Hero section with gradient banner introducing WriteSpace
  - Feature highlights showcasing writing, sharing, and security capabilities
  - Latest posts preview section displaying up to three recent blog entries
  - Responsive footer with navigation links

- **Authentication System**
  - Login page with username and password validation
  - Registration page with display name, username, password, and confirm password fields
  - Hard-coded admin account (`admin` / `admin123`) for initial platform access
  - Session management via localStorage with login, logout, and session persistence
  - Automatic redirect for authenticated users away from login and register pages

- **Role-Based Access Control**
  - Two roles supported: `admin` and `user`
  - Protected route component restricting access to authenticated users
  - Admin-only route protection for dashboard and user management pages
  - Role-aware navigation displaying admin-specific links when applicable

- **Blog CRUD Operations**
  - Create new blog posts with title (100 character max) and content (2000 character max)
  - Read individual blog posts with full content display and author attribution
  - Edit existing posts with pre-populated form fields
  - Delete posts with confirmation dialog to prevent accidental removal
  - Post ownership enforcement allowing edits and deletes by author or admin
  - Character count indicators on title and content fields

- **Admin Dashboard**
  - Gradient banner with personalized admin greeting
  - Stat cards displaying total posts, total users, admin count, and user count
  - Quick action buttons for writing new posts and managing users
  - Recent posts list with edit and delete actions
  - Empty state with call-to-action when no posts exist

- **User Management**
  - Admin-only user listing with all registered users and the hard-coded admin
  - Create new users with display name, username, password, and role selection
  - Delete users with confirmation dialog and cascading deletion of their posts
  - Protection against deleting the default admin account or the current user
  - User count display in the page header

- **Avatar System**
  - Emoji-based avatars differentiating admin (👑) and user (📖) roles
  - Three size variants: small, medium, and large
  - Role-aware color theming with violet for admins and indigo for users

- **Blog Card Component**
  - Rotating accent color borders for visual variety
  - Content excerpt truncation at 120 characters
  - Author avatar, name, and formatted publication date
  - Edit indicator icon for posts the current user can modify
  - Click-through navigation to full blog post view

- **Navigation**
  - Authenticated navbar with links to All Blogs, Write, and Users (admin only)
  - User avatar chip with dropdown menu containing logout action
  - Mobile-responsive hamburger menu with full navigation and user info
  - Public navbar for unauthenticated pages with Login and Register links
  - Active route highlighting on navigation links

- **localStorage Persistence**
  - Posts stored under `writespace_posts` key
  - Users stored under `writespace_users` key
  - Session stored under `writespace_session` key
  - Graceful error handling with console warnings on read/write failures

- **Responsive Tailwind UI**
  - Mobile-first responsive design using Tailwind CSS v3
  - Custom color palette extending indigo, violet, pink, teal, and slate scales
  - Consistent design system with rounded corners, shadow levels, and spacing
  - PostCSS and Autoprefixer integration for cross-browser compatibility

- **Vercel Deployment**
  - SPA rewrite configuration in `vercel.json` for client-side routing support
  - Vite build setup with React plugin for optimized production builds