import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface PricingItem {
  id: string;
  service_key: string;
  label_de: string;
  label_en: string;
  price_text_de: string;
  price_text_en: string;
  note_de: string;
  note_en: string;
  sort_order: number;
  is_published: boolean;
}

export default function PricingManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<PricingItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PricingItem>>({
    service_key: "",
    label_de: "",
    label_en: "",
    price_text_de: "",
    price_text_en: "",
    note_de: "",
    note_en: "",
    sort_order: 0,
    is_published: true,
  });

  const { data: pricing, isLoading } = useQuery({
    queryKey: ["admin-pricing"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("practice_pricing")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as PricingItem[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PricingItem> & { id: string }) => {
      const { error } = await supabase
        .from("practice_pricing")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["practice-pricing"] });
      setEditingId(null);
      toast({ title: "Preis aktualisiert" });
    },
    onError: () => toast({ title: "Fehler", variant: "destructive" }),
  });

  const createMutation = useMutation({
    mutationFn: async (item: Partial<PricingItem>) => {
      const { error } = await supabase.from("practice_pricing").insert([item as any]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
      setIsAdding(false);
      setNewItem({ service_key: "", label_de: "", label_en: "", price_text_de: "", price_text_en: "", note_de: "", note_en: "", sort_order: 0, is_published: true });
      toast({ title: "Preis hinzugefügt" });
    },
    onError: () => toast({ title: "Fehler", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("practice_pricing").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pricing"] });
      toast({ title: "Preis gelöscht" });
    },
  });

  const startEdit = (item: PricingItem) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const saveEdit = () => {
    if (!editingId) return;
    updateMutation.mutate({ id: editingId, ...editData });
  };

  if (isLoading) return <p>Laden...</p>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif">Preise verwalten</CardTitle>
        <Button size="sm" onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Neu
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="border-primary/30 bg-sage-50">
            <CardContent className="pt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Schlüssel</Label><Input value={newItem.service_key} onChange={e => setNewItem(p => ({ ...p, service_key: e.target.value }))} placeholder="z.B. neue_leistung" /></div>
                <div><Label>Reihenfolge</Label><Input type="number" value={newItem.sort_order} onChange={e => setNewItem(p => ({ ...p, sort_order: +e.target.value }))} /></div>
                <div><Label>Leistung (DE)</Label><Input value={newItem.label_de} onChange={e => setNewItem(p => ({ ...p, label_de: e.target.value }))} /></div>
                <div><Label>Service (EN)</Label><Input value={newItem.label_en} onChange={e => setNewItem(p => ({ ...p, label_en: e.target.value }))} /></div>
                <div><Label>Preis (DE)</Label><Input value={newItem.price_text_de} onChange={e => setNewItem(p => ({ ...p, price_text_de: e.target.value }))} /></div>
                <div><Label>Price (EN)</Label><Input value={newItem.price_text_en} onChange={e => setNewItem(p => ({ ...p, price_text_en: e.target.value }))} /></div>
                <div><Label>Hinweis (DE)</Label><Input value={newItem.note_de} onChange={e => setNewItem(p => ({ ...p, note_de: e.target.value }))} /></div>
                <div><Label>Note (EN)</Label><Input value={newItem.note_en} onChange={e => setNewItem(p => ({ ...p, note_en: e.target.value }))} /></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => createMutation.mutate(newItem)}><Save className="h-4 w-4 mr-1" />Speichern</Button>
                <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}><X className="h-4 w-4 mr-1" />Abbrechen</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leistung</TableHead>
                <TableHead>Preis (DE)</TableHead>
                <TableHead>Hinweis</TableHead>
                <TableHead>Aktiv</TableHead>
                <TableHead className="w-24">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricing?.map((item) => (
                <TableRow key={item.id}>
                  {editingId === item.id ? (
                    <>
                      <TableCell>
                        <Input value={editData.label_de || ""} onChange={e => setEditData(p => ({ ...p, label_de: e.target.value }))} className="min-w-[150px]" />
                      </TableCell>
                      <TableCell>
                        <Input value={editData.price_text_de || ""} onChange={e => setEditData(p => ({ ...p, price_text_de: e.target.value }))} className="min-w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Input value={editData.note_de || ""} onChange={e => setEditData(p => ({ ...p, note_de: e.target.value }))} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={editData.is_published} onCheckedChange={v => setEditData(p => ({ ...p, is_published: v }))} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={saveEdit}><Save className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{item.label_de}</TableCell>
                      <TableCell>{item.price_text_de}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.note_de}</TableCell>
                      <TableCell>{item.is_published ? "✓" : "–"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => startEdit(item)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
