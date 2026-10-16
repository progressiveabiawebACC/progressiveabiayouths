import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Search,
  Upload,
  Loader2,
  Copy,
  Sparkles,
  CalendarDays,
  Clock,
  MapPin,
  ExternalLink,
  Tag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { logActivity } from "@/lib/auditLog";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "boolean" | "tags" | "image";
  required?: boolean;
  placeholder?: string;
}

interface AdminCrudPageProps {
  title: string;
  fields: FieldConfig[];
  data: any[];
  isLoading: boolean;
  onCreate: (item: any) => Promise<any>;
  onUpdate: (item: any) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  displayColumns?: string[];
}

const isImageField = (field: FieldConfig) => {
  return (
    field.type === "image" ||
    field.name.includes("image") ||
    field.name.includes("photo") ||
    field.name.includes("logo") ||
    field.name.includes("avatar")
  );
};

const AdminCrudPage = ({
  title,
  fields,
  data,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
  isCreating,
  isUpdating,
  isDeleting,
  displayColumns,
}: AdminCrudPageProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const cols = displayColumns ?? fields.slice(0, 4).map((f) => f.name);

  // Filtered rows by search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase();
    return data.filter((item) =>
      cols.some((col) => {
        const val = item[col];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(q);
      })
    );
  }, [data, cols, searchQuery]);

  const openCreate = () => {
    const defaults: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "boolean") defaults[f.name] = true;
      else if (f.type === "number") defaults[f.name] = 0;
      else if (f.type === "tags") defaults[f.name] = "";
      else defaults[f.name] = "";
    });
    setFormData(defaults);
    setEditingItem(null);
    setActiveTab("edit");
    setDrawerOpen(true);
  };

  const openEdit = (item: any) => {
    const d: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "tags") {
        d[f.name] = (item[f.name] || []).join(", ");
      } else {
        d[f.name] = item[f.name] ?? "";
      }
    });
    setFormData(d);
    setEditingItem(item);
    setActiveTab("edit");
    setDrawerOpen(true);
  };

  const handleDuplicate = (item: any) => {
    const d: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "tags") {
        d[f.name] = (item[f.name] || []).join(", ");
      } else {
        d[f.name] = item[f.name] ?? "";
      }
    });

    // Append copy marker
    if (d.title) d.title = `${d.title} (Copy)`;
    else if (d.name) d.name = `${d.name} (Copy)`;

    setFormData(d);
    setEditingItem(null); // Create mode
    setActiveTab("edit");
    setDrawerOpen(true);
    toast.info("Duplicated item into form. Save to create new record.");
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingItem(null);
    setFormData({});
    setActiveTab("edit");
  };

  const handleImageUpload = async (fieldName: string, file: File) => {
    setUploadingField(fieldName);
    try {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File is larger than 2MB. Please choose a smaller image or enter an image URL.");
        setUploadingField(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, [fieldName]: reader.result as string }));
        toast.success("Image loaded successfully!");
        setUploadingField(null);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file.");
        setUploadingField(null);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      toast.error(
        "Upload failed: " +
          (err.message || "Could not read image file. You can also paste an image URL directly.")
      );
      setUploadingField(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, any> = {};
      for (const f of fields) {
        if (f.type === "tags") {
          payload[f.name] = formData[f.name]
            ? String(formData[f.name])
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [];
        } else if (f.type === "number") {
          payload[f.name] =
            formData[f.name] === "" || formData[f.name] === null ? 0 : Number(formData[f.name]);
        } else if (f.type === "boolean") {
          payload[f.name] = formData[f.name] === true || formData[f.name] === "true";
        } else {
          payload[f.name] = formData[f.name] === "" ? null : formData[f.name];
        }

        if (
          f.required &&
          (payload[f.name] === null || payload[f.name] === undefined || payload[f.name] === "")
        ) {
          setSaving(false);
          toast.error(`${f.label} is required`);
          return;
        }
      }

      const itemLabel =
        payload.title || payload.name || payload.label || payload.lga || "Record";

      if (editingItem?.id) {
        await onUpdate({ id: editingItem.id, ...payload });
        logActivity("update", title, `Updated "${itemLabel}"`);
        toast.success("Updated successfully");
      } else {
        await onCreate(payload);
        logActivity("create", title, `Created "${itemLabel}"`);
        toast.success("Created successfully");
      }
      closeDrawer();
    } catch (err: any) {
      toast.error(err.message || "Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (item: any, statusField: string) => {
    try {
      const newVal = !item[statusField];
      await onUpdate({ id: item.id, [statusField]: newVal });
      const itemLabel = item.title || item.name || item.label || item.lga || item.id;
      logActivity(
        "update",
        title,
        `Toggled status for "${itemLabel}" to ${newVal ? "Active" : "Inactive"}`
      );
      toast.success(newVal ? "Set to Active / Published" : "Set to Draft / Inactive");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    const toDelete = data.find((i) => i.id === id);
    const itemLabel = toDelete?.title || toDelete?.name || toDelete?.label || toDelete?.lga || id;

    if (!confirm(`Are you sure you want to delete "${itemLabel}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await onDelete(id);
      logActivity("delete", title, `Deleted "${itemLabel}"`);
      toast.success("Deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  // Live Preview Renderer Helper
  const renderLivePreview = () => {
    const isEvent = title.toLowerCase().includes("event");
    const isBlog = title.toLowerCase().includes("blog") || title.toLowerCase().includes("post");
    const isHero = title.toLowerCase().includes("hero") || title.toLowerCase().includes("slide");
    const isPortfolio = title.toLowerCase().includes("portfolio");
    const isTeam = title.toLowerCase().includes("team");

    if (isEvent) {
      return (
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <img
              src={formData.image_url || "/placeholder.svg"}
              alt="Event banner"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {formData.category && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                {formData.category}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1 text-primary">
                <CalendarDays className="h-3.5 w-3.5" />
                {formData.date || "Scheduled Date"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formData.time || "Time TBA"}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-foreground">
              {formData.title || "Event Title Preview"}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {formData.description || "Event summary description will appear here..."}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{formData.location || "Venue Location"}</span>
            </div>
          </div>
        </div>
      );
    }

    if (isBlog) {
      return (
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <img
              src={formData.image_url || "/placeholder.svg"}
              alt="Article banner"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {formData.category && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                {formData.category}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-primary" />
                {formData.author || "Author"}
              </span>
              <span>&bull;</span>
              <span>{formData.date || "Publication Date"}</span>
              <span>&bull;</span>
              <span>{formData.read_time || "5 min read"}</span>
            </div>

            <h3 className="font-display text-lg font-bold text-foreground leading-snug">
              {formData.title || "Article Headline Preview"}
            </h3>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {formData.excerpt || formData.content || "Article excerpt preview will be displayed here..."}
            </p>

            {formData.tags && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {String(formData.tags)
                  .split(",")
                  .map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (isHero) {
      return (
        <div className="relative rounded-xl overflow-hidden border border-border min-h-[220px] bg-slate-900 text-white p-6 flex flex-col justify-end">
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Hero banner"
              className="absolute inset-0 h-full w-full object-cover opacity-40"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          )}
          <div className="relative z-10 space-y-2">
            <Badge className="bg-primary text-white text-[10px] font-bold">Homepage Slide</Badge>
            <h2 className="font-display text-xl font-bold leading-tight">
              {formData.title || "Hero Headline Text"}
            </h2>
            <p className="text-xs text-slate-200 line-clamp-2">
              {formData.subtitle || "Supporting subtext for this hero banner slide."}
            </p>
            <div className="flex items-center gap-2 pt-2">
              {formData.cta1_label && (
                <span className="px-3 py-1 rounded bg-primary text-white text-xs font-bold">
                  {formData.cta1_label}
                </span>
              )}
              {formData.cta2_label && (
                <span className="px-3 py-1 rounded border border-white/40 text-white text-xs font-bold">
                  {formData.cta2_label}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (isTeam) {
      return (
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm text-center space-y-3 max-w-xs mx-auto">
          <div className="h-24 w-24 mx-auto rounded-full overflow-hidden border-2 border-primary bg-muted">
            <img
              src={formData.image_url || "/placeholder.svg"}
              alt={formData.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">{formData.name || "Executive Name"}</h3>
            <p className="text-xs text-primary font-semibold">{formData.role || "Executive Role"}</p>
          </div>
          {formData.bio && (
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{formData.bio}</p>
          )}
        </div>
      );
    }

    // Generic Fallback Card
    return (
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt=""
            className="w-full h-40 rounded-lg object-cover bg-muted"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
        )}
        <h3 className="font-bold text-base text-foreground">
          {formData.title || formData.name || formData.label || formData.lga || "Item Preview"}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {formData.description || formData.excerpt || formData.role || "No additional description entered."}
        </p>
      </div>
    );
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
            {data.length} total records &bull; Progressive Abia Youths CMS
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New {title.replace(/s$/, "")}
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-sm bg-card border-border w-full"
          />
        </div>
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="text-xs text-muted-foreground self-start sm:self-auto"
          >
            Clear filter ({filteredData.length} shown)
          </Button>
        )}
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-border bg-card">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs font-medium text-muted-foreground">Loading records...</p>
          </div>
        </div>
      ) : (
        <Card className="overflow-hidden border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  {cols.map((col) => (
                    <TableHead
                      key={col}
                      className="font-bold text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      {fields.find((f) => f.name === col)?.label || col}
                    </TableHead>
                  ))}
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-right pr-6 w-36">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => {
                  const statusField =
                    "is_active" in item ? "is_active" : "is_published" in item ? "is_published" : null;
                  return (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors border-b border-border/60"
                    >
                      {cols.map((col) => {
                        const val = item[col];
                        const fieldDef = fields.find((f) => f.name === col);

                        // Image thumbnail preview in column
                        if (fieldDef && isImageField(fieldDef) && val) {
                          return (
                            <TableCell key={col} className="py-2.5">
                              <div className="flex items-center gap-2">
                                <img
                                  src={val}
                                  alt=""
                                  className="h-10 w-10 rounded-md object-cover border border-border bg-muted shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                                <span className="text-xs font-mono text-muted-foreground truncate max-w-[140px]">
                                  {val}
                                </span>
                              </div>
                            </TableCell>
                          );
                        }

                        // Boolean status pill
                        if (typeof val === "boolean") {
                          return (
                            <TableCell key={col} className="py-2.5">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                  val
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                                    : "bg-muted text-muted-foreground border border-border"
                                }`}
                              >
                                {val ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                          );
                        }

                        // Array / tags
                        if (Array.isArray(val)) {
                          return (
                            <TableCell key={col} className="py-2.5">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {val.slice(0, 3).map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground"
                                  >
                                    {t}
                                  </span>
                                ))}
                                {val.length > 3 && (
                                  <span className="text-[10px] text-muted-foreground font-bold">
                                    +{val.length - 3}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell
                            key={col}
                            className="max-w-[240px] truncate py-2.5 text-xs font-medium text-foreground"
                          >
                            {val !== null && val !== undefined ? String(val) : "—"}
                          </TableCell>
                        );
                      })}

                      <TableCell className="py-2.5 text-right pr-4">
                        <div className="inline-flex items-center gap-1">
                          {statusField && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              title={
                                item[statusField]
                                  ? "Click to Deactivate / Unpublish"
                                  : "Click to Activate / Publish"
                              }
                              onClick={() => handleToggleStatus(item, statusField)}
                            >
                              {item[statusField] ? (
                                <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-muted-foreground/60" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleDuplicate(item)}
                            title="Duplicate / Clone"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEdit(item)}
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={cols.length + 1}
                      className="py-12 text-center text-xs font-semibold text-muted-foreground"
                    >
                      {searchQuery
                        ? "No matching records found."
                        : `No ${title.toLowerCase()} records yet. Click "Add New" to create one.`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Slide-over Drawer Form with Live Preview Tabs */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={closeDrawer}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-xl flex-col bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-200"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
              <div>
                <h2 className="font-display text-lg font-black text-foreground">
                  {editingItem ? `Edit ${title.replace(/s$/, "")}` : `New ${title.replace(/s$/, "")}`}
                </h2>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  Progressive Abia Youths Database
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={closeDrawer} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Controller in Drawer */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "edit" | "preview")}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="px-6 pt-3 border-b border-border bg-muted/10">
                <TabsList className="grid grid-cols-2 w-full max-w-xs h-8">
                  <TabsTrigger value="edit" className="text-xs font-semibold">
                    Edit Form
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs font-semibold">
                    <Sparkles className="h-3 w-3 mr-1 text-primary" />
                    Live Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab 1: Form */}
              <TabsContent value="edit" className="flex-1 overflow-y-auto p-6 space-y-4 m-0">
                {fields.map((field) => {
                  const isImage = isImageField(field);

                  return (
                    <div key={field.name} className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </label>

                      {/* Image Field with URL + File Upload + Preview */}
                      {isImage ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              value={formData[field.name] || ""}
                              onChange={(e) =>
                                setFormData({ ...formData, [field.name]: e.target.value })
                              }
                              placeholder={field.placeholder || "/images/... or https://..."}
                              className="flex-1 text-xs bg-background h-9"
                            />
                            <label
                              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer shrink-0 ${
                                uploadingField === field.name
                                  ? "bg-muted-foreground cursor-wait"
                                  : "bg-primary hover:bg-primary/90"
                              }`}
                            >
                              {uploadingField === field.name ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-3.5 w-3.5" /> Upload File
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingField === field.name}
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(field.name, file);
                                }}
                              />
                            </label>
                          </div>

                          {/* Image Preview */}
                          {formData[field.name] && (
                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-2">
                              <img
                                src={formData[field.name]}
                                alt="Preview"
                                className="h-16 w-24 rounded object-cover border border-border bg-background"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                              <div className="text-[11px] text-muted-foreground truncate flex-1">
                                <p className="font-semibold text-foreground">Current Image Source</p>
                                <p className="font-mono truncate">{formData[field.name]}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                          rows={field.name === "content" || field.name === "description" ? 6 : 3}
                          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
                          className="text-xs bg-background resize-y"
                        />
                      ) : field.type === "boolean" ? (
                        <label className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[field.name] === true || formData[field.name] === "true"}
                            onChange={(e) =>
                              setFormData({ ...formData, [field.name]: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-border accent-primary"
                          />
                          <span className="text-xs font-semibold text-foreground">
                            {field.label} ({formData[field.name] ? "Enabled / Active" : "Disabled / Inactive"})
                          </span>
                        </label>
                      ) : (
                        <Input
                          type={
                            field.type === "number"
                              ? "number"
                              : field.type === "date"
                              ? "date"
                              : "text"
                          }
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                          placeholder={
                            field.placeholder ||
                            (field.type === "tags" ? "e.g. Youth, Leadership, Abia" : "")
                          }
                          className="text-xs bg-background h-9"
                        />
                      )}
                    </div>
                  );
                })}
              </TabsContent>

              {/* Tab 2: Live Preview */}
              <TabsContent value="preview" className="flex-1 overflow-y-auto p-6 m-0 space-y-4">
                <div className="rounded-lg bg-muted/40 p-3 border border-border text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    This is a live rendering of how this entry will appear on public portal pages.
                  </span>
                </div>
                {renderLivePreview()}
              </TabsContent>
            </Tabs>

            {/* Drawer Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/20 px-6 py-4">
              <Button variant="outline" size="sm" onClick={closeDrawer} className="font-semibold">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || isCreating || isUpdating}
                className="font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              >
                {saving || isCreating || isUpdating ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-1.5 h-3.5 w-3.5" /> {editingItem ? "Save Changes" : "Create Record"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCrudPage;
