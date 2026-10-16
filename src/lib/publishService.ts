// ============================================================
// Dual-Mode Cloudflare Publishing Engine & Data Management
// Mode A: Direct GitHub REST API commit -> Triggers Cloudflare Pages build
// Mode B: Air-gapped manual siteData.ts export / JSON backup
// ============================================================

import { generateSiteDataFile } from "@/lib/exportSiteData";
import { localGetAll, localReset } from "@/lib/localStore";
import { logActivity } from "@/lib/auditLog";
import type { TableName } from "@/types/siteTypes";

export interface PublishConfig {
  githubToken: string;
  repoOwner: string;
  repoName: string;
  branch: string;
  filePath: string;
}

export interface PublishResult {
  success: boolean;
  message: string;
  commitSha?: string;
  commitUrl?: string;
}

const CONFIG_STORAGE_KEY = "pay_publish_config";

const DEFAULT_CONFIG: PublishConfig = {
  githubToken: "",
  repoOwner: "Divine101",
  repoName: "progressiveabiayouths",
  branch: "main",
  filePath: "src/data/siteData.ts",
};

const ALL_TABLES: TableName[] = [
  "hero_slides",
  "events",
  "blog_posts",
  "portfolio_items",
  "partners",
  "team_members",
  "lga_coordinators",
  "site_stats",
];

export function getPublishConfig(): PublishConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function savePublishConfig(updates: Partial<PublishConfig>): PublishConfig {
  const current = getPublishConfig();
  const merged = { ...current, ...updates };
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

// Convert UTF-8 string to base64 safely in browser
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function publishToGitHub(customMessage?: string): Promise<PublishResult> {
  const config = getPublishConfig();

  if (!config.githubToken || !config.githubToken.trim()) {
    return {
      success: false,
      message: "GitHub Personal Access Token is missing. Configure it in Admin Settings.",
    };
  }

  const owner = config.repoOwner.trim() || DEFAULT_CONFIG.repoOwner;
  const repo = config.repoName.trim() || DEFAULT_CONFIG.repoName;
  const branch = config.branch.trim() || DEFAULT_CONFIG.branch;
  const filePath = config.filePath.trim() || DEFAULT_CONFIG.filePath;

  try {
    const fileContent = generateSiteDataFile();
    const base64Content = utf8ToBase64(fileContent);

    // 1. Fetch current file SHA if it exists
    const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    const getRes = await fetch(getFileUrl, {
      headers: {
        Authorization: `Bearer ${config.githubToken.trim()}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let currentSha: string | undefined = undefined;

    if (getRes.status === 200) {
      const getData = await getRes.json();
      currentSha = getData.sha;
    } else if (getRes.status === 401 || getRes.status === 403) {
      return {
        success: false,
        message: "Invalid GitHub Token or token lacks write permissions for this repository.",
      };
    } else if (getRes.status !== 404) {
      const errText = await getRes.text();
      return {
        success: false,
        message: `Failed to inspect repository (${getRes.status}): ${errText}`,
      };
    }

    // 2. Commit file update via PUT
    const putFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const commitMessage =
      customMessage?.trim() ||
      `CMS Update via Executive Admin: ${new Date().toLocaleString("en-GB")}`;

    const putRes = await fetch(putFileUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.githubToken.trim()}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        sha: currentSha,
        branch,
      }),
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({ message: putRes.statusText }));
      return {
        success: false,
        message: `GitHub commit rejected (${putRes.status}): ${errData.message || "Unknown error"}`,
      };
    }

    const resData = await putRes.json();
    const commitSha = resData.commit?.sha || "";
    const commitUrl = resData.commit?.html_url || "";

    logActivity(
      "publish",
      "Cloudflare",
      `Published commit ${commitSha ? commitSha.slice(0, 7) : "latest"} to ${branch}`
    );

    return {
      success: true,
      message: "Published successfully! Cloudflare Pages build has been automatically triggered.",
      commitSha,
      commitUrl,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Network or runtime error while publishing: ${errorMsg}`,
    };
  }
}

// ── JSON Snapshot Backup ───────────────────────────────────────
export function downloadBackupJson() {
  const snapshot: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    system: "Progressive Abia Youths Executive CMS",
    version: "2.0",
    data: {},
  };

  const dataObj: Record<string, unknown> = {};
  for (const table of ALL_TABLES) {
    dataObj[table] = localGetAll(table);
  }
  snapshot.data = dataObj;

  const content = JSON.stringify(snapshot, null, 2);
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pay_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  logActivity("publish", "Backup", "Exported full JSON snapshot backup");
}

export async function restoreBackupJson(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);

    if (!parsed || typeof parsed !== "object" || !parsed.data) {
      return { success: false, message: "Invalid backup format. Missing 'data' payload." };
    }

    let restoredCount = 0;
    for (const table of ALL_TABLES) {
      if (Array.isArray(parsed.data[table])) {
        localStorage.setItem(`pay_data_${table}`, JSON.stringify(parsed.data[table]));
        restoredCount++;
      }
    }

    logActivity("restore", "Backup", `Restored ${restoredCount} database modules from backup`);
    return {
      success: true,
      message: `Successfully restored ${restoredCount} modules. Reloading interface...`,
    };
  } catch (err) {
    return {
      success: false,
      message: `Failed to restore backup: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// ── Factory Reset ──────────────────────────────────────────────
export function factoryResetToStatic() {
  for (const table of ALL_TABLES) {
    localReset(table);
  }
  logActivity("reset", "System", "Reset all database modules to static code defaults");
}
