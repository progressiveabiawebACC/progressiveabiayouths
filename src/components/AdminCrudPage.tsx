import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "boolean" | "tags";
  required?: boolean;
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
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const cols = displayColumns ?? fields.slice(0, 4).map((f) => f.name);

  const resetForm = () => {
    setFormData({});
    setShowForm(false);
    setEditingId(null);
  };

  const openCreate = () => {
    const defaults: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "boolean") defaults[f.name] = true;
      else if (f.type === "number") defaults[f.name] = 0;
      else if (f.type === "tags") defaults[f.name] = "";
      else defaults[f.name] = "";
    });
    setFormData(defaults);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    const d: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "tags") d[f.name] = (item[f.name] || []).join(", ");
      else d[f.name] = item[f.name] ?? "";
    });
    setFormData(d);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const payload: Record<string, any> = {};
      fields.forEach((f) => {
        if (f.type === "tags") payload[f.name] = formData[f.name] ? formData[f.name].split(",").map((t: string) => t.trim()).filter(Boolean) : [];
        else if (f.type === "number") payload[f.name] = Number(formData[f.name]) || 0;
        else if (f.type === "boolean") payload[f.name] = formData[f.name] === true || formData[f.name] === "true";
        else payload[f.name] = formData[f.name];
      });

      if (editingId) {
        await onUpdate({ id: editingId, ...payload });
        toast({ title: "Updated successfully" });
      } else {
        await onCreate(payload);
        toast({ title: "Created successfully" });
      }
      resetForm();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await onDelete(id);
      toast({ title: "Deleted successfully" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">{title}</h1>
          <p className="text-sm font-medium text-muted-foreground">{data.length} items</p>
        </div>
        <Button onClick={openCreate} className="font-bold">
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-foreground">{editingId ? "Edit" : "Create New"}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label className="mb-1 block text-sm font-bold text-foreground">{field.label}</label>
                  {field.type === "textarea" ? (
                    <Textarea value={formData[field.name] || ""} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })} rows={4} />
                  ) : field.type === "boolean" ? (
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={String(formData[field.name])}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value === "true" })}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : (
                    <Input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      value={formData[field.name] || ""}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      required={field.required}
                      placeholder={field.type === "tags" ? "comma, separated, tags" : ""}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isCreating || isUpdating} className="font-bold">
                <Save className="mr-2 h-4 w-4" /> {editingId ? "Update" : "Create"}
              </Button>
              <Button variant="outline" onClick={resetForm} className="font-bold">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-muted-foreground font-medium">Loading...</p>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {cols.map((col) => (
                    <TableHead key={col} className="font-bold">{fields.find((f) => f.name === col)?.label || col}</TableHead>
                  ))}
                  <TableHead className="font-bold w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    {cols.map((col) => (
                      <TableCell key={col} className="max-w-[200px] truncate font-medium">
                        {typeof item[col] === "boolean" ? (item[col] ? "Yes" : "No") : Array.isArray(item[col]) ? item[col].join(", ") : String(item[col] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} disabled={isDeleting}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={cols.length + 1} className="text-center text-muted-foreground font-medium py-8">No items yet</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
};

export default AdminCrudPage;
