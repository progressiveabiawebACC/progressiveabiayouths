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
  Download,
  Upload,
  AlertTriangle,
  History,
  Trash2,
  ShieldCheck,
  Database,
  ExternalLink,
} from "lucide-react";
import {
  downloadBackupJson,
  restoreBackupJson,
  factoryResetToStatic,
} from "@/lib/publishService";
import { getAuditLogs, clearAuditLogs, type AuditLogEntry } from "@/lib/auditLog";

const AdminSettings = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    setAuditLogs(getAuditLogs());
  }, []);

  const handleExportBackup = () => {
    downloadBackupJson();
    toast.success("Snapshot backup exported successfully.");
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
      'Warning: This resets all portal modules back to initial code defaults. Type "RESET" to confirm:'
    );
    if (confirmation === "RESET") {
      factoryResetToStatic();
      toast.success("Reset completed. Reloading interface...");
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
      <div className="space-y-6 max-w-5xl pb-12">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
              Settings &amp; Data Backups
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Export database snapshots for safekeeping, restore backups, review activity, or manage system defaults.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleExportBackup}
            className="font-semibold text-xs h-9 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Export Backup Snapshot
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Backup & Restore */}
          <Card className="shadow-xs border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Data Snapshots &amp; Export</CardTitle>
                  <CardDescription className="text-xs">
                    Download or restore complete snapshots of your portal content.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">1. Full Backup Snapshot</Label>
                <p className="text-xs text-muted-foreground">
                  Downloads all events, blog posts, LGA coordinators, team members, and inbox messages into a portable JSON file.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportBackup}
                  className="w-full text-xs font-semibold"
                >
                  <Download className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  Download Complete Backup
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs font-semibold">2. Restore from Backup</Label>
                <p className="text-xs text-muted-foreground">
                  Upload a previously saved backup file to restore your content.
                </p>
                <Input
                  type="file"
                  accept=".json"
                  onChange={(e) => setRestoreFile(e.target.files?.[0] || null)}
                  className="text-xs file:text-xs file:font-semibold"
                />
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
            </CardContent>
          </Card>

          {/* Card 2: Danger Zone */}
          <Card className="shadow-xs border-border flex flex-col justify-between">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-destructive">Danger Zone</CardTitle>
                  <CardDescription className="text-xs">
                    Reset all portal data back to factory default code state.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded-lg border border-destructive/20 bg-destructive/5 text-xs text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground">What this does:</p>
                <p>
                  Resets all 8 modules (Hero Slides, Events, Blog Posts, Portfolio, Partners, Team, LGA Coordinators, Stats) back to their original starting values.
                </p>
                <p className="font-mono text-[11px] text-destructive">
                  Requires typing &ldquo;RESET&rdquo; to execute.
                </p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleFactoryReset}
                className="w-full text-xs font-semibold"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Reset All Content to Default
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log Table */}
        <Card className="shadow-xs border-border">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                Session Activity &amp; Audit Trail
              </CardTitle>
              <CardDescription className="text-xs">
                Administrative actions recorded on this device.
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
                          log.action === "create"
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
    </AdminLayout>
  );
};

export default AdminSettings;
