import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Cloud,
  Github,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  History,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Server,
} from "lucide-react";
import {
  getPublishConfig,
  savePublishConfig,
  publishToGitHub,
  downloadBackupJson,
  restoreBackupJson,
  factoryResetToStatic,
  type PublishConfig,
} from "@/lib/publishService";
import { downloadSiteData } from "@/lib/exportSiteData";
import { getAuditLogs, clearAuditLogs, type AuditLogEntry } from "@/lib/auditLog";

const AdminSettings = () => {
  const [config, setConfig] = useState<PublishConfig>(getPublishConfig());
  const [showToken, setShowToken] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{
    success: boolean;
    message: string;
    commitSha?: string;
    commitUrl?: string;
  } | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    setAuditLogs(getAuditLogs());
  }, []);

  const handleSaveConfig = () => {
    savePublishConfig(config);
    toast.success("Deployment configuration saved successfully!");
  };

  const handleTriggerDeploy = async () => {
    if (!config.githubToken.trim()) {
      toast.error("Please enter a valid GitHub Personal Access Token first.");
      return;
    }

    // Save first
    savePublishConfig(config);

    setIsPublishing(true);
    setPublishResult(null);

    try {
      const res = await publishToGitHub("CMS Executive Deploy via Admin Settings");
      setPublishResult(res);
      setAuditLogs(getAuditLogs());

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("Failed to trigger deploy. Check network connection.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadCode = () => {
    downloadSiteData();
    toast.success("Downloaded siteData.ts! Place this into src/data/siteData.ts in your repo.");
    setAuditLogs(getAuditLogs());
  };

  const handleExportBackup = () => {
    downloadBackupJson();
    toast.success("Snapshot JSON exported successfully.");
    setAuditLogs(getAuditLogs());
  };

  const handleRestoreBackup = async () => {
    if (!restoreFile) {
      toast.error("Please select a JSON backup file to restore.");
      return;
    }

    if (!window.confirm("Restoring will overwrite current local content with the backup file. Proceed?")) {
      return;
    }

    setIsRestoring(true);
    const result = await restoreBackupJson(restoreFile);
    setIsRestoring(false);

    if (result.success) {
      toast.success(result.message);
      setAuditLogs(getAuditLogs());
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } else {
      toast.error(result.message);
    }
  };

  const handleFactoryReset = () => {
    const confirmation = window.prompt(
      'Warning: This resets ALL modules back to the default initial code data. Type "RESET" to confirm:'
    );
    if (confirmation === "RESET") {
      factoryResetToStatic();
      toast.success("Factory reset completed. Reloading interface...");
      setAuditLogs(getAuditLogs());
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (confirmation !== null) {
      toast.error("Reset cancelled: confirmation phrase did not match.");
    }
  };

  const handleClearAuditLogs = () => {
    if (window.confirm("Clear all recorded session audit history?")) {
      clearAuditLogs();
      setAuditLogs([]);
      toast.success("Audit history cleared.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
                Settings & Cloudflare Deployment
              </h1>
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-semibold">
                Cloudflare Ready
              </Badge>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Configure automated git-based edge publishing, manage database snapshots, and review executive audit trails.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="font-semibold text-xs h-9"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Download siteData.ts
            </Button>
            <Button
              size="sm"
              onClick={handleTriggerDeploy}
              disabled={isPublishing}
              className="font-semibold text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Cloud className="h-4 w-4 mr-1.5" />
              {isPublishing ? "Publishing..." : "Deploy to Cloudflare"}
            </Button>
          </div>
        </div>

        {/* Deployment Status Alert */}
        {publishResult && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              publishResult.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                : "bg-destructive/10 border-destructive/30 text-destructive-foreground"
            }`}
          >
            {publishResult.success ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="text-sm font-semibold">{publishResult.message}</p>
              {publishResult.commitSha && (
                <div className="flex items-center gap-2 text-xs">
                  <span>Commit SHA: <code>{publishResult.commitSha.slice(0, 7)}</code></span>
                  {publishResult.commitUrl && (
                    <a
                      href={publishResult.commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      View on GitHub <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Cloudflare Mode A */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xs border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <Cloud className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Cloudflare Pages Continuous Deployment</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Mode A: Direct GitHub REST API commit triggers automatic zero-downtime edge deploy.
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                    Recommended
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="token" className="text-xs font-semibold">
                      GitHub Personal Access Token (classic or fine-grained with repo write)
                    </Label>
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showToken ? "Hide" : "Show"}
                    </button>
                  </div>
                  <Input
                    id="token"
                    type={showToken ? "text" : "password"}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={config.githubToken}
                    onChange={(e) => setConfig({ ...config, githubToken: e.target.value })}
                    className="font-mono text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Stored securely only in your browser localStorage. Needed to push updates to your repo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="owner" className="text-xs font-semibold">Repository Owner</Label>
                    <Input
                      id="owner"
                      value={config.repoOwner}
                      onChange={(e) => setConfig({ ...config, repoOwner: e.target.value })}
                      placeholder="Divine101"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="repo" className="text-xs font-semibold">Repository Name</Label>
                    <Input
                      id="repo"
                      value={config.repoName}
                      onChange={(e) => setConfig({ ...config, repoName: e.target.value })}
                      placeholder="progressiveabiayouths"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="branch" className="text-xs font-semibold">Target Production Branch</Label>
                    <Input
                      id="branch"
                      value={config.branch}
                      onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                      placeholder="main"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="filePath" className="text-xs font-semibold">Target Data File Path</Label>
                    <Input
                      id="filePath"
                      value={config.filePath}
                      onChange={(e) => setConfig({ ...config, filePath: e.target.value })}
                      placeholder="src/data/siteData.ts"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveConfig}
                    className="font-semibold text-xs"
                  >
                    Save Configuration
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleTriggerDeploy}
                    disabled={isPublishing}
                    className="font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Committing & Deploying...
                      </>
                    ) : (
                      <>
                        <Cloud className="h-3.5 w-3.5 mr-1.5" />
                        Trigger Cloudflare Deploy Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mode B: Air-Gapped Manual Publishing */}
            <Card className="shadow-xs border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Air-Gapped Manual Export (Mode B)</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Zero-token fallback: export your changes directly to a clean TypeScript file.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  If you don&apos;t have a GitHub token or want to commit changes manually through git terminal, download the full compiled TypeScript dataset and drop it directly into your project:
                </p>
                <div className="p-3 bg-muted/50 rounded-lg text-xs font-mono space-y-1 text-foreground/80">
                  <p>1. Click &ldquo;Download siteData.ts&rdquo; below</p>
                  <p>2. Move file to: <code>progressiveabiayouths/src/data/siteData.ts</code></p>
                  <p>3. Run: <code>git add src/data/siteData.ts &amp;&amp; git commit -m &ldquo;Update CMS&rdquo; &amp;&amp; git push</code></p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCode}
                  className="font-semibold text-xs w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-1.5 text-primary" />
                  Download Compiled siteData.ts
                </Button>
              </CardContent>
            </Card>

            {/* Audit Log Table */}
            <Card className="shadow-xs border-border">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    Session Activity &amp; Audit Trail
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Last 50 administrative actions and publishing events recorded on this device.
                  </CardDescription>
                </div>
                {auditLogs.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAuditLogs}
                    className="text-xs text-muted-foreground hover:text-destructive h-8"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Clear
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No activity recorded yet in this session.
                  </p>
                ) : (
                  <div className="max-h-64 overflow-y-auto divide-y divide-border">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Badge
                            variant="secondary"
                            className={`text-[10px] uppercase font-bold shrink-0 ${
                              log.action === "publish"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : log.action === "create"
                                ? "bg-primary/15 text-primary"
                                : log.action === "delete"
                                ? "bg-destructive/15 text-destructive"
                                : log.action === "reset"
                                ? "bg-amber-500/15 text-amber-600"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {log.action}
                          </Badge>
                          <span className="font-semibold text-foreground shrink-0">{log.module}:</span>
                          <span className="text-muted-foreground truncate">{log.summary}</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground shrink-0 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Disaster Recovery & Snapshots */}
          <div className="space-y-6">
            <Card className="shadow-xs border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-bold">Disaster Recovery &amp; Snapshots</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Export complete JSON snapshots for offline backup or migration between devices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Full JSON Backup</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportBackup}
                    className="w-full text-xs font-semibold"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5 text-primary" />
                    Export Full JSON Snapshot
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Restore Snapshot</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".json"
                      onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                      className="text-xs file:text-xs file:font-semibold"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRestoreBackup}
                    disabled={!restoreFile || isRestoring}
                    className="w-full text-xs font-semibold mt-1"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    {isRestoring ? "Restoring..." : "Restore Selected Backup"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 pt-1">
                  <Label className="text-xs font-semibold text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Danger Zone: Factory Reset
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Resets all local databases back to the static codebase state. Requires typing &ldquo;RESET&rdquo;.
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleFactoryReset}
                    className="w-full text-xs font-semibold"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Reset All to Static Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xs border-border bg-muted/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-bold">Cloudflare Pages Topology</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                <p>
                  <strong>Host:</strong> Cloudflare Pages Edge CDN
                </p>
                <p>
                  <strong>Build Command:</strong> <code>npm run build</code>
                </p>
                <p>
                  <strong>Output Directory:</strong> <code>dist</code>
                </p>
                <p>
                  <strong>SPA Routing:</strong> <code>public/_redirects</code> (200 rewrite)
                </p>
                <p>
                  <strong>Bandwidth:</strong> Unlimited free Tier
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
