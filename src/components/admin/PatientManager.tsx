import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface PatientProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  date_of_birth: string | null;
  phone: string | null;
  created_at: string;
  login_count: number;
}

export function PatientManager() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch login counts from audit_log
      const { data: loginCounts, error: loginError } = await supabase
        .from("audit_log")
        .select("user_id, action")
        .eq("action", "login");

      if (loginError) throw loginError;

      // Count logins per user
      const countMap: Record<string, number> = {};
      loginCounts?.forEach((entry) => {
        countMap[entry.user_id] = (countMap[entry.user_id] || 0) + 1;
      });

      const enriched: PatientProfile[] = (profiles || []).map((p) => ({
        user_id: p.user_id,
        first_name: p.first_name,
        last_name: p.last_name,
        email: p.email,
        street: p.street,
        postal_code: p.postal_code,
        city: p.city,
        date_of_birth: p.date_of_birth,
        phone: p.phone,
        created_at: p.created_at,
        login_count: countMap[p.user_id] || 0,
      }));

      setPatients(enriched);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = patients.filter((p) => {
    const term = search.toLowerCase();
    return (
      !term ||
      (p.first_name?.toLowerCase() || "").includes(term) ||
      (p.last_name?.toLowerCase() || "").includes(term) ||
      p.email.toLowerCase().includes(term) ||
      (p.city?.toLowerCase() || "").includes(term)
    );
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "–";
    try {
      return format(new Date(dateStr), "dd.MM.yyyy", { locale: de });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {filtered.length} {filtered.length === 1 ? "Patient" : "Patienten"}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suchen (Name, E-Mail, Ort)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>E-Mail</TableHead>
              <TableHead>Straße</TableHead>
              <TableHead>PLZ / Ort</TableHead>
              <TableHead>Geburtsdatum</TableHead>
              <TableHead>Erstanmeldung</TableHead>
              <TableHead className="text-right">Logins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Keine Patienten gefunden.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.user_id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {[p.first_name, p.last_name].filter(Boolean).join(" ") || "–"}
                  </TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.street || "–"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {p.postal_code || p.city
                      ? `${p.postal_code || ""} ${p.city || ""}`.trim()
                      : "–"}
                  </TableCell>
                  <TableCell>{formatDate(p.date_of_birth)}</TableCell>
                  <TableCell>{formatDate(p.created_at)}</TableCell>
                  <TableCell className="text-right">{p.login_count}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
