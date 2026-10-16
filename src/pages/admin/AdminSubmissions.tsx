import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useAdminTable } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Mail,
  Search,
  Trash2,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Clock,
  User,
  Phone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import type { FormSubmission } from "@/types/siteTypes";

const AdminSubmissions = () => {
  const { data: submissions, update, remove, isLoading } = useAdminTable("submissions");
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<FormSubmission | null>(null);

  const filtered = submissions.filter((sub) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      sub.name.toLowerCase().includes(q) ||
      sub.email.toLowerCase().includes(q) ||
      (sub.subject && sub.subject.toLowerCase().includes(q)) ||
      sub.message.toLowerCase().includes(q)
    );
  });

  const handleOpenMessage = async (msg: FormSubmission) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      try {
        await update({ id: msg.id, is_read: true });
      } catch {
        // fail silently
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete message from ${name}?`)) return;
    try {
      await remove(id);
      toast.success("Message deleted");
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch {
      toast.error("Failed to delete message");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
                Messages &amp; Inquiries Inbox
              </h1>
              <Badge variant="secondary" className="font-mono text-xs font-bold">
                {submissions.length} Total
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Public inquiries received from the website contact and registration forms.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search messages by sender, email or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs h-9 bg-card border-border w-full"
            />
          </div>
          {search && (
            <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-xs text-muted-foreground self-start sm:self-auto">
              Clear filter ({filtered.length} shown)
            </Button>
          )}
        </div>

        {/* Messages Table */}
        <Card className="border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground w-12">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Sender
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Subject / Source
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Message Preview
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-right pr-6 w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => handleOpenMessage(item)}
                    className={`cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/60 ${
                      !item.is_read ? "bg-primary/5 font-medium" : ""
                    }`}
                  >
                    <TableCell className="py-3">
                      {!item.is_read ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block" title="Unread" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground/50" title="Read" />
                      )}
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="font-bold text-xs text-foreground">{item.name}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">{item.email}</div>
                    </TableCell>

                    <TableCell className="py-3 max-w-[180px] truncate">
                      <div className="text-xs text-foreground font-semibold truncate">
                        {item.subject || "Contact Inquiry"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{item.source || "Website"}</div>
                    </TableCell>

                    <TableCell className="py-3 max-w-[280px] truncate text-xs text-muted-foreground">
                      {item.message}
                    </TableCell>

                    <TableCell className="py-3 text-xs text-muted-foreground whitespace-nowrap font-mono">
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="py-3 text-right pr-4">
                      <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-xs font-semibold text-muted-foreground">
                      {search ? "No matching messages found." : "Your inbox is currently empty. Incoming inquiries will appear here."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Message Details Modal */}
        {selectedMessage && (
          <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base font-bold">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  {selectedMessage.subject || "Website Inquiry"}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Received on {new Date(selectedMessage.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      {selectedMessage.name}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {selectedMessage.source || "Contact Form"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{selectedMessage.email}</span>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{selectedMessage.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-foreground uppercase tracking-wider text-[11px] block">
                    Message Body:
                  </span>
                  <div className="p-3.5 rounded-lg border border-border bg-card whitespace-pre-wrap leading-relaxed text-foreground">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex sm:justify-between items-center gap-2 pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                  className="text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>

                <div className="flex gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || "Your Inquiry"
                    )}`}
                    className="inline-flex"
                  >
                    <Button size="sm" className="text-xs bg-primary text-primary-foreground font-semibold">
                      <Mail className="h-3.5 w-3.5 mr-1.5" /> Reply via Email
                    </Button>
                  </a>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;
