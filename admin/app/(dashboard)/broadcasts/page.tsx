"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Send, Trash2 } from "lucide-react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Broadcast } from "@/lib/types/broadcast";
import type { CustomerSegment } from "@/lib/types/growth";
import { usePermission } from "@/lib/auth/use-permission";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BroadcastsPage() {
  const { hasPermission } = usePermission();
  const canSend = hasPermission("broadcasts.send");
  const queryClient = useQueryClient();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [targetSegmentId, setTargetSegmentId] = useState("");
  const [confirmSend, setConfirmSend] = useState<Broadcast | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Broadcast | null>(null);

  const { data: broadcasts, isLoading } = useQuery({
    queryKey: ["broadcasts"],
    queryFn: () => apiClient.get<Broadcast[]>("/growth/broadcasts"),
  });

  const { data: segments } = useQuery({
    queryKey: ["segments"],
    queryFn: () => apiClient.get<CustomerSegment[]>("/growth/segments"),
    enabled: canSend,
  });

  const createMutation = useMutation({
    mutationFn: () => apiClient.post<Broadcast>("/growth/broadcasts", {
      subject,
      body,
      targetSegmentId: targetSegmentId || null,
    }),
    onSuccess: () => {
      toast.success("Broadcast saved as a draft");
      setSubject("");
      setBody("");
      setTargetSegmentId("");
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to save broadcast");
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id: string) => apiClient.post<Broadcast>(`/growth/broadcasts/${id}/send`),
    onSuccess: (result) => {
      setConfirmSend(null);
      if (result.status === "FAILED") {
        toast.error(result.errorMessage || "Broadcast failed to send");
      } else if (result.failedCount > 0) {
        toast.warning(`Sent to ${result.sentCount}, ${result.failedCount} failed`);
      } else {
        toast.success(`Sent to ${result.sentCount} recipient(s)`);
      }
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
    },
    onError: (err: unknown) => {
      setConfirmSend(null);
      toast.error(err instanceof ApiError ? err.message : "Failed to send broadcast");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/growth/broadcasts/${id}`),
    onSuccess: () => {
      setConfirmDelete(null);
      toast.success("Draft deleted");
      queryClient.invalidateQueries({ queryKey: ["broadcasts"] });
    },
    onError: (err: unknown) => {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete broadcast");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Broadcasts</h1>
        <p className="text-sm text-muted-foreground">
          Send a one-off email to every customer with an email address, or to one customer segment.
        </p>
      </div>

      {canSend && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-base">New broadcast</CardTitle>
            <CardDescription>Saved as a draft first — review it, then send it from the list below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message (HTML allowed)</Label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segment">Send to</Label>
              <select
                id="segment"
                value={targetSegmentId}
                onChange={(e) => setTargetSegmentId(e.target.value)}
                className="h-8 w-full max-w-xs rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Every customer with an email</option>
                {(segments ?? []).map((segment) => (
                  <option key={segment.id} value={segment.id}>{segment.name}</option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !subject.trim() || !body.trim()}
            >
              <Mail className="h-3.5 w-3.5" /> Save draft
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : (broadcasts ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No broadcasts yet.</p>
        ) : (
          (broadcasts ?? []).map((broadcast) => (
            <Card key={broadcast.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{broadcast.subject}</span>
                    <StatusBadge status={broadcast.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {broadcast.targetSegment ? broadcast.targetSegment.name : "Every customer with an email"}
                    {" · "}{broadcast.recipientCount} recipient{broadcast.recipientCount === 1 ? "" : "s"}
                    {broadcast.status === "SENT" || broadcast.status === "FAILED"
                      ? ` · sent ${broadcast.sentCount}, failed ${broadcast.failedCount}`
                      : ""}
                    {" · "}{formatDate(broadcast.createdAt)}
                  </p>
                  {broadcast.errorMessage && (
                    <p className="text-xs text-destructive">{broadcast.errorMessage}</p>
                  )}
                </div>
                {canSend && (broadcast.status === "DRAFT" || broadcast.status === "FAILED") && (
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => setConfirmSend(broadcast)}>
                      <Send className="h-3.5 w-3.5" /> Send
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(broadcast)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!confirmSend} onOpenChange={(open) => !open && setConfirmSend(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send this broadcast?</DialogTitle>
            <DialogDescription>
              This will immediately email {confirmSend?.recipientCount} recipient
              {confirmSend?.recipientCount === 1 ? "" : "s"} with the subject &ldquo;{confirmSend?.subject}&rdquo;.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmSend(null)}>Cancel</Button>
            <Button
              onClick={() => confirmSend && sendMutation.mutate(confirmSend.id)}
              disabled={sendMutation.isPending}
            >
              {sendMutation.isPending ? "Sending…" : "Send now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this draft?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
