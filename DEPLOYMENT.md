# Deployment Guide

This guide covers deploying the WriteSpace Blog application to [Vercel](https://vercel.com).

## Prerequisites

- A [GitHub](https://github.com), [GitLab](https://gitlab.com), or [Bitbucket](https://bitbucket.org) account with the repository pushed
- A [Vercel](https://vercel.com) account (free tier is sufficient)

## Connecting Your Git Repository

1. Log in to [Vercel](https://vercel.com/login)
2. Click **"Add New…"** → **"Project"** from the dashboard
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Vercel to access your repositories if prompted
5. Find and select the **writespace-blog** repository
6. Click **"Import"**

## Build Configuration

Vercel auto-detects the Vite framework and applies the correct settings. Verify the following values on the import screen:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x (or later) |

These match the scripts defined in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## SPA Rewrite Configuration

The project includes a `vercel.json` file at the repository root that configures Vercel to rewrite all routes to `index.html`. This is required for client-side routing with React Router DOM to work correctly on production:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Without this rewrite rule, navigating directly to a route like `/blogs` or `/blog/:id` would return a 404 error because Vercel would look for a static file at that path. The rewrite ensures all requests are served by `index.html`, allowing React Router to handle routing on the client side.

> **Note:** This file is already included in the repository. No additional configuration is needed.

## Environment Variables

WriteSpace Blog does **not** require any environment variables. All data is persisted in the browser's `localStorage`, and there are no external API calls, database connections, or secret keys to configure.

You can skip the "Environment Variables" section entirely during the Vercel import process.

## Deploying

1. After confirming the build settings on the import screen, click **"Deploy"**
2. Vercel will clone the repository, install dependencies, and run `npm run build`
3. The optimized static files from the `dist` directory are deployed to Vercel's edge network
4. Once the build completes, Vercel provides a production URL (e.g., `https://writespace-blog.vercel.app`)

## CI/CD — Automatic Deploys on Push

Once the repository is connected, Vercel automatically sets up continuous deployment:

- **Production deploys** are triggered on every push to the **main** (or **master**) branch
- **Preview deploys** are triggered on every push to any other branch or on pull requests
- Each preview deploy gets a unique URL for testing before merging

### Workflow

```
Push to feature branch → Vercel creates a Preview Deployment
                          (unique URL for review)

Merge to main branch   → Vercel creates a Production Deployment
                          (updates the production URL)
```

No additional CI/CD configuration (GitHub Actions, etc.) is required. Vercel handles the entire build and deploy pipeline.

## Custom Domain (Optional)

To use a custom domain instead of the default `.vercel.app` URL:

1. Go to your project in the Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Enter your custom domain and click **"Add"**
4. Follow the DNS configuration instructions provided by Vercel
5. Vercel automatically provisions an SSL certificate for the domain

## Build Output Details

The `vite build` command produces the following in the `dist` directory:

```
dist/
├── index.html          # Entry HTML with hashed asset references
├── vite.svg            # Favicon (copied from public/)
└── assets/
    ├── index-[hash].js   # Bundled JavaScript (React, React Router, app code)
    └── index-[hash].css  # Compiled Tailwind CSS (purged for production)
```

Vite applies the following optimizations during the production build:

- **Tree shaking** — Removes unused JavaScript code
- **CSS purging** — Tailwind CSS removes unused utility classes
- **Minification** — JavaScript and CSS are minified
- **Content hashing** — Asset filenames include hashes for cache busting
- **Code splitting** — Vendor and application code are bundled efficiently

## Troubleshooting

### Routes return 404 on direct navigation

Ensure `vercel.json` exists at the repository root with the SPA rewrite rule. Without it, Vercel serves routes as static file lookups, which fail for client-side routes.

### Build fails with dependency errors

Verify that `package.json` includes all required dependencies and that the Node.js version on Vercel is set to 18.x or later. You can configure the Node.js version in **Settings** → **General** → **Node.js Version**.

### Styles are missing in production

Confirm that `tailwind.config.js` has the correct `content` paths:

```js
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",
]
```

This ensures Tailwind scans all component files and retains the utility classes used in the application.

### localStorage data is not shared across devices

This is expected behavior. WriteSpace Blog uses `localStorage` for data persistence, which is scoped to the individual browser on each device. Data created on one device will not appear on another.