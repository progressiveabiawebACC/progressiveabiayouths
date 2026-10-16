# SaaS-Standard Admin Console & Cloudflare Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Progressive Abia Youths admin portal into an All-in-One SaaS-standard executive CMS with live previews, 17-LGA coverage matrix, activity tracking, and dual-mode Cloudflare publishing (GitHub API direct sync + air-gapped export).

**Architecture:** A static, zero-backend architecture utilizing `localStorage` data store seeded from `siteData.ts`. Edits are published to live Cloudflare Pages via direct GitHub REST API commits (auto-triggering Cloudflare CI/CD) or manual download. Public site routes through Cloudflare Pages edge SPA routing.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Radix UI, TanStack Query, Cloudflare Pages (`_redirects`).

---

### Task 1: Cloudflare Pages Setup (`public/_redirects`)

**Files:**
- Create: `public/_redirects`
- Verify: `npm run build` generates `dist/_redirects`

- [ ] **Step 1: Create `public/_redirects` for Cloudflare Pages SPA Routing**

```
/*    /index.html   200
```

- [ ] **Step 2: Run build to verify file presence in `dist/`**

Run: `npm run build`  
Verify: `dist/_redirects` exists and contains `/* /index.html 200`.

- [ ] **Step 3: Commit**

```bash
git add public/_redirects
git commit -m "feat(deploy): add Cloudflare Pages SPA redirects file"
```

---

### Task 2: Audit Logging Service (`src/lib/auditLog.ts`)

**Files:**
- Create: `src/lib/auditLog.ts`

- [ ] **Step 1: Implement the audit logging service**

```typescript
export interface AuditLogEntry {
  id: string;
  action: "create" | "update" | "delete" | "publish" | "restore" | "reset";
  module: string;
  summary: string;
  timestamp: string;
}

const AUDIT_STORAGE_KEY = "pay_audit_log";

export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const logActivity = (
  action: AuditLogEntry["action"],
  module: string,
  summary: string
) => {
  try {
    const current = getAuditLogs();
    const entry: AuditLogEntry = {
      id: "log_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      action,
      module,
      summary,
      timestamp: new Date().toISOString(),
    };
    const updated = [entry, ...current].slice(0, 50); // Keep last 50 actions
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to log activity:", e);
  }
};

export const clearAuditLogs = () => {
  localStorage.removeItem(AUDIT_STORAGE_KEY);
};
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/auditLog.ts
git commit -m "feat(admin): implement local audit logging service"
```

---

### Task 3: Dual-Mode Cloudflare Publishing Engine (`src/lib/publishService.ts`)

**Files:**
- Create: `src/lib/publishService.ts`

- [ ] **Step 1: Implement the GitHub API commit & publish service**

```typescript
import { generateSiteDataString } from "./exportSiteData";
import { logActivity } from "./auditLog";

const GITHUB_TOKEN_KEY = "pay_github_token";
const GITHUB_REPO_KEY = "pay_github_repo";
const GITHUB_BRANCH_KEY = "pay_github_branch";

export interface GitHubPublishConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export const getPublishConfig = (): GitHubPublishConfig => {
  return {
    token: localStorage.getItem(GITHUB_TOKEN_KEY) || "",
    owner: (localStorage.getItem(GITHUB_REPO_KEY) || "Divine101/progressiveabiayouths").split("/")[0] || "Divine101",
    repo: (localStorage.getItem(GITHUB_REPO_KEY) || "Divine101/progressiveabiayouths").split("/")[1] || "progressiveabiayouths",
    branch: localStorage.getItem(GITHUB_BRANCH_KEY) || "main",
  };
};

export const savePublishConfig = (config: Partial<GitHubPublishConfig>) => {
  if (config.token !== undefined) localStorage.setItem(GITHUB_TOKEN_KEY, config.token.trim());
  if (config.owner && config.repo) {
    localStorage.setItem(GITHUB_REPO_KEY, `${config.owner.trim()}/${config.repo.trim()}`);
  }
  if (config.branch !== undefined) localStorage.setItem(GITHUB_BRANCH_KEY, config.branch.trim());
};

export interface PublishResult {
  success: boolean;
  message: string;
  commitUrl?: string;
}

export const publishToGitHub = async (): Promise<PublishResult> => {
  const { token, owner, repo, branch } = getPublishConfig();

  if (!token) {
    return {
      success: false,
      message: "GitHub Personal Access Token is missing. Please configure it in Admin Settings.",
    };
  }

  const path = "src/data/siteData.ts";
  const fileContent = generateSiteDataString();
  const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

  try {
    // Step A: Get current file SHA
    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!getRes.ok && getRes.status !== 404) {
      const errData = await getRes.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to fetch file metadata (${getRes.status})`);
    }

    const currentSha = getRes.ok ? (await getRes.json()).sha : undefined;

    // Step B: Put file commit
    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const body: Record<string, any> = {
      message: `CMS Update: Published via Progressive Abia Youths Admin Console [${new Date().toLocaleString()}]`,
      content: encodedContent,
      branch,
    };
    if (currentSha) body.sha = currentSha;

    const putRes = await fetch(putUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(errData.message || `GitHub commit failed (${putRes.status})`);
    }

    const putData = await putRes.json();
    logActivity("publish", "Cloudflare", "Published updated siteData.ts to GitHub");

    return {
      success: true,
      message: "Changes committed to GitHub! Cloudflare Pages is now auto-building your live site.",
      commitUrl: putData.commit?.html_url,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An unexpected error occurred while publishing to GitHub.",
    };
  }
};
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/publishService.ts
git commit -m "feat(cms): implement direct GitHub API commit service for Cloudflare Pages"
```

---

### Task 4: Admin Settings & Backup Manager (`src/pages/admin/AdminSettings.tsx` & Route)

**Files:**
- Create: `src/pages/admin/AdminSettings.tsx`
- Modify: `src/App.tsx` (add `/admin/settings` route)

- [ ] **Step 1: Create `AdminSettings.tsx`**

Provides:
- GitHub Personal Access Token and repository configuration
- Full JSON export & import
- Reset to initial site defaults
- Session logout

- [ ] **Step 2: Add Route to `src/App.tsx`**

```tsx
import AdminSettings from "@/pages/admin/AdminSettings";
// ... inside <Routes> under /admin
<Route path="/admin/settings" element={<AdminSettings />} />
```

- [ ] **Step 3: Verify build**

Run: `npm run build`  
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminSettings.tsx src/App.tsx
git commit -m "feat(admin): add AdminSettings screen for Cloudflare tokens and backups"
```

---

### Task 5: SaaS Admin Layout Enhancement (`src/components/AdminLayout.tsx`)

**Files:**
- Modify: `src/components/AdminLayout.tsx`

- [ ] **Step 1: Enhance sidebar with counts, Settings link, and Cloudflare status pill**
- Add Settings navigation link
- Add live count badges for each module
- Add system status badge in sidebar header (`🟢 Cloudflare Mode`)

- [ ] **Step 2: Verify layout in browser**

Run: `npm run build`  
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AdminLayout.tsx
git commit -m "feat(admin): upgrade AdminLayout with SaaS navigation badges and settings link"
```

---

### Task 6: SaaS Executive Dashboard (`src/pages/AdminDashboard.tsx`)

**Files:**
- Modify: `src/pages/AdminDashboard.tsx`

- [ ] **Step 1: Implement Executive KPI widgets**
  - Active Events (Upcoming vs. Past)
  - Articles published with read time
  - LGA Coverage counter (X/17)
  - Partner & Leadership counts

- [ ] **Step 2: Implement 17-LGA Grassroots Coverage Matrix**
  - Filterable by Senatorial District: Abia Central, Abia North, Abia South
  - Displays coordinator status, phone, and direct edit link

- [ ] **Step 3: Implement Quick-Action Bar & Dual Publish Modal**
  - "+ Quick Add" dropdown
  - "Publish to Live Site" modal that triggers `publishToGitHub()` or fallback download
  - "Download siteData.ts" button

- [ ] **Step 4: Implement Recent Content Tabs & Activity Timeline**
  - Tab 1: Upcoming Events preview table
  - Tab 2: Recent Blog Posts preview table
  - Tab 3: Recent Activity audit trail from `getAuditLogs()`

- [ ] **Step 5: Verify build**

Run: `npm run build`  
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/AdminDashboard.tsx
git commit -m "feat(admin): implement SaaS Executive Dashboard with KPIs, LGA matrix, and direct publish"
```

---

### Task 7: CMS Workstation Live Preview (`src/components/AdminCrudPage.tsx`)

**Files:**
- Modify: `src/components/AdminCrudPage.tsx`

- [ ] **Step 1: Add Live Preview panel / tab in the create & edit drawer**
  - When editing a blog post, preview card and typography render side-by-side or via a "Live Preview" toggle.
  - When editing an event, preview shows high-contrast time & date badges just like on public pages.

- [ ] **Step 2: Add Duplicate / Clone item action**
  - Allows 1-click duplication of existing events or items for rapid entry.

- [ ] **Step 3: Connect `logActivity()` to create, update, and delete actions**

- [ ] **Step 4: Verify build**

Run: `npm run build`  
Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/AdminCrudPage.tsx
git commit -m "feat(admin): add live preview drawer, clone action, and audit logging to AdminCrudPage"
```

---

### Task 8: End-to-End Verification & Browser Testing

**Files:** None (testing and browser subagent validation)

- [ ] **Step 1: Full production build check**

Run: `npm run build`  
Expected: 0 errors.

- [ ] **Step 2: Preview in browser subagent**
- Check `/admin` dashboard: KPIs, 17-LGA coverage matrix, and publish modal.
- Check `/admin/settings`: Cloudflare/GitHub config and JSON backup buttons.
- Check `/admin/events` and `/admin/blog-posts`: Live preview drawer and clone action.
- Check `public/_redirects` is copied to `dist/_redirects`.

- [ ] **Step 3: Final commit and summary**

```bash
git commit --allow-empty -m "chore: verify SaaS Admin Console and Cloudflare Pages setup"
```
