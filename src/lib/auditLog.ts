export interface AuditLogEntry {
  id: string;
  action: "create" | "update" | "delete" | "publish" | "restore" | "reset" | "login";
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
