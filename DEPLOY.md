# Vercel Deployment Guide — Progressive Abia Youths

This application is fully pre-configured for one-click deployment on **Vercel** with full SPA client-side routing support and edge caching.

---

## 🚀 Quick Deploy Steps (via Vercel Dashboard)

1. **Push your code to GitHub / GitLab / Bitbucket**:
   - Ensure your latest commits on `main` are pushed to your repository.

2. **Import into Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select and import your `progressiveabiayouths` repository.

3. **Project Configuration**:
   - **Framework Preset**: `Vite` *(auto-detected via `vercel.json`)*
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` *(or `vite build`)*
   - **Output Directory**: `dist`

4. **Environment Variables**:
   In the Vercel project settings, add the following environment variables:

   | Variable Name | Recommended Value | Purpose |
   |---|---|---|
   | `VITE_ADMIN_EMAIL` | `progressiveabiaweb@gmail.com` | Primary admin login email |
   | `VITE_ADMIN_PASSWORD` | `PAYWEBadmin@2026` | Primary admin login password |
   | `VITE_WEB3FORMS_ACCESS_KEY` | *(your access key)* | Optional: Contact form email notifications |

5. **Deploy**:
   - Click **Deploy**. Vercel will build and serve your site globally across edge nodes.

---

## 🛠️ Deployment via Vercel CLI

If you prefer deploying via terminal:

```bash
# 1. Install or run Vercel CLI
npx vercel

# 2. Add environment variables
npx vercel env add VITE_ADMIN_EMAIL
npx vercel env add VITE_ADMIN_PASSWORD

# 3. Deploy to production
npx vercel --prod
```

---

## ⚙️ Configuration Files Summary

- **[`vercel.json`](./vercel.json)**:
  - Framework: `vite`
  - Build command: `npm run build`
  - Output directory: `dist`
  - SPA Routing: Catch-all rewrite `{ "source": "/(.*)", "destination": "/index.html" }` ensuring pages like `/admin/login`, `/admin`, `/events` never return 404 on refresh.
  - Asset caching: `Cache-Control: public, max-age=31536000, immutable` for all hashed chunks in `/assets/`.

- **[`.gitignore`](./.gitignore)**:
  - Added `.vercel` to prevent local Vercel CLI cache files from polluting the repository.
