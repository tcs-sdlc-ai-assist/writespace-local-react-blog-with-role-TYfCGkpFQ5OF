# WriteSpace Blog

A minimal blogging platform where your words take center stage. Write, share, and discover stories that matter.

## Tech Stack

- **React 18** — UI library
- **React Router DOM 6** — Client-side routing
- **Vite 6** — Build tool and dev server
- **Tailwind CSS 3** — Utility-first styling
- **PostCSS + Autoprefixer** — CSS processing
- **localStorage** — Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` by default.

### Production Build

```bash
npm run build
```

Outputs optimized static files to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Folder Structure

```
writespace-blog/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration with React plugin
├── tailwind.config.js          # Tailwind CSS theme and content paths
├── postcss.config.js           # PostCSS plugins (Tailwind, Autoprefixer)
├── vercel.json                 # Vercel SPA rewrite rules
├── CHANGELOG.md                # Version history
├── README.md                   # Project documentation
├── public/
│   └── vite.svg                # Favicon
└── src/
    ├── main.jsx                # React DOM root render
    ├── App.jsx                 # Router and route definitions
    ├── index.css               # Tailwind directives
    ├── components/
    │   ├── Avatar.jsx          # Emoji-based role avatar (admin/user)
    │   ├── BlogCard.jsx        # Post preview card with accent colors
    │   ├── Navbar.jsx          # Authenticated navigation bar
    │   ├── ProtectedRoute.jsx  # Auth and role guard wrapper
    │   ├── PublicNavbar.jsx    # Unauthenticated navigation bar
    │   ├── StatCard.jsx        # Dashboard statistic display card
    │   └── UserRow.jsx         # User list item with delete action
    ├── pages/
    │   ├── AdminDashboard.jsx  # Admin overview with stats and recent posts
    │   ├── Home.jsx            # All blogs listing page
    │   ├── LandingPage.jsx     # Public landing with hero and features
    │   ├── LoginPage.jsx       # User login form
    │   ├── ReadBlog.jsx        # Full blog post view
    │   ├── RegisterPage.jsx    # User registration form
    │   ├── UserManagement.jsx  # Admin user CRUD interface
    │   └── WriteBlog.jsx       # Create and edit blog post form
    └── utils/
        ├── auth.js             # Authentication logic (login, register, logout)
        └── storage.js          # localStorage read/write helpers
```

## Features

- **Public Landing Page** — Hero section, feature highlights, and latest posts preview
- **Authentication** — Login and registration with session persistence
- **Role-Based Access Control** — Admin and user roles with protected routes
- **Blog CRUD** — Create, read, edit, and delete blog posts with ownership enforcement
- **Admin Dashboard** — Platform stats, recent posts management, and quick actions
- **User Management** — Admin-only user creation, listing, and deletion with cascading post removal
- **Avatar System** — Emoji-based avatars with role-aware theming (👑 admin, 📖 user)
- **Responsive Design** — Mobile-first layout with Tailwind CSS

## Route Map

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/blogs` | Authenticated | All blog posts listing |
| `/blog/:id` | Authenticated | Single blog post view |
| `/write` | Authenticated | Create new blog post |
| `/edit/:id` | Authenticated | Edit existing blog post |
| `/admin` | Admin only | Admin dashboard |
| `/users` | Admin only | User management |

## localStorage Schema

All data is persisted in the browser's localStorage under the following keys:

### `writespace_posts`

```json
[
  {
    "id": "uuid",
    "title": "Post Title",
    "content": "Post content text...",
    "createdAt": "2024-12-01T00:00:00.000Z",
    "authorId": "uuid | admin",
    "authorName": "Display Name"
  }
]
```

### `writespace_users`

```json
[
  {
    "id": "uuid",
    "displayName": "Display Name",
    "username": "username",
    "password": "plaintext",
    "role": "user | admin",
    "createdAt": "2024-12-01T00:00:00.000Z"
  }
]
```

### `writespace_session`

```json
{
  "userId": "uuid | admin",
  "username": "username",
  "displayName": "Display Name",
  "role": "user | admin"
}
```

> **Note:** A hard-coded admin account (`admin` / `admin123`) is always available and does not appear in the `writespace_users` array. It is merged into the user list at runtime in the admin dashboard and user management pages.

## Deployment

The project includes a `vercel.json` configuration for deployment on [Vercel](https://vercel.com):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all routes are rewritten to `index.html` for client-side routing support.

To deploy:

1. Push the repository to GitHub
2. Import the project in Vercel
3. Vercel auto-detects the Vite framework and applies the correct build settings
4. The `vercel.json` rewrite rule handles SPA routing

## License

Private — All rights reserved.