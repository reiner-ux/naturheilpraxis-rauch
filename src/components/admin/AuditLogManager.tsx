import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const actionLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  login: { label: "Anmeldung", variant: "default" },
  logout: { label: "Abmeldung", variant: "secondary" },
  anamnesis_submitted: { label: "Anamnesebogen", variant: "outline" },
};

export function AuditLogManager() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!logs?.length) {
    return <p className="text-muted-foreground text-center py-8">Noch keine Audit-Einträge vorhanden.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Zeitpunkt</TableHead>
            <TableHead>Aktion</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Benutzer-ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const info = actionLabels[log.action] || { label: log.action, variant: "outline" as const };
            const details = log.details as Record<string, any> | null;
            return (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-sm">
                  {format(new Date(log.created_at), "dd.MM.yyyy HH:mm:ss", { locale: de })}
                </TableCell>
                <TableCell>
                  <Badge variant={info.variant}>{info.label}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                  {details?.email || details?.patient_name || "—"}
                </TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">
                  {log.user_id?.slice(0, 8)}…
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
