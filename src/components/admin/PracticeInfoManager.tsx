import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2, Edit2, Plus, Save, X, GripVertical, Heart, Shield, Users, Leaf, Star, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PracticeInfo {
  id: string;
  slug: string;
  title_de: string;
  title_en: string;
  content_de: string;
  content_en: string;
  icon: string | null;
  sort_order: number;
  is_published: boolean;
}

const iconOptions = [
  { value: 'Heart', label: 'Herz', icon: Heart },
  { value: 'Shield', label: 'Schild', icon: Shield },
  { value: 'Users', label: 'Personen', icon: Users },
  { value: 'Leaf', label: 'Blatt', icon: Leaf },
  { value: 'Star', label: 'Stern', icon: Star },
  { value: 'Clock', label: 'Uhr', icon: Clock },
];

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Shield,
  Users,
  Leaf,
  Star,
  Clock,
};

const emptyPracticeInfo: Omit<PracticeInfo, 'id'> = {
  slug: '',
  title_de: '',
  title_en: '',
  content_de: '',
  content_en: '',
  icon: 'Heart',
  sort_order: 0,
  is_published: true,
};

export const PracticeInfoManager = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInfo, setEditingInfo] = useState<PracticeInfo | null>(null);
  const [formData, setFormData] = useState<Omit<PracticeInfo, 'id'>>(emptyPracticeInfo);

  const { data: practiceInfos, isLoading } = useQuery({
    queryKey: ['admin-practice-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('practice_info')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as PracticeInfo[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<PracticeInfo, 'id'>) => {
      const { error } = await supabase.from('practice_info').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-practice-info'] });
      queryClient.invalidateQueries({ queryKey: ['practice-info'] });
      toast.success('Praxis-Info erfolgreich erstellt');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Fehler beim Erstellen: ' + error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: PracticeInfo) => {
      const { error } = await supabase.from('practice_info').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-practice-info'] });
      queryClient.invalidateQueries({ queryKey: ['practice-info'] });
      toast.success('Praxis-Info erfolgreich aktualisiert');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Fehler beim Aktualisieren: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('practice_info').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-practice-info'] });
      queryClient.invalidateQueries({ queryKey: ['practice-info'] });
      toast.success('Praxis-Info erfolgreich gelöscht');
    },
    onError: (error) => {
      toast.error('Fehler beim Löschen: ' + error.message);
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[äöüß]/g, (match) => {
        const map: Record<string, string> = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' };
        return map[match] || match;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleOpenCreate = () => {
    setEditingInfo(null);
    setFormData({
      ...emptyPracticeInfo,
      sort_order: (practiceInfos?.length || 0) + 1,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (info: PracticeInfo) => {
    setEditingInfo(info);
    setFormData({
      slug: info.slug,
      title_de: info.title_de,
      title_en: info.title_en,
      content_de: info.content_de,
      content_en: info.content_en,
      icon: info.icon,
      sort_order: info.sort_order,
      is_published: info.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingInfo(null);
    setFormData(emptyPracticeInfo);
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title_de: title,
      slug: editingInfo ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInfo) {
      updateMutation.mutate({ id: editingInfo.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const togglePublished = async (info: PracticeInfo) => {
    updateMutation.mutate({ ...info, is_published: !info.is_published });
  };

  if (isLoading) {
    return <div className="text-center py-8">Laden...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Praxis-Informationen verwalten</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Info
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingInfo ? 'Praxis-Info bearbeiten' : 'Neue Praxis-Info erstellen'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title_de">Titel (Deutsch)</Label>
                  <Input
                    id="title_de"
                    value={formData.title_de}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title_en">Titel (Englisch)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL-freundlicher Name)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content_de">Inhalt (Deutsch)</Label>
                  <Textarea
                    id="content_de"
                    value={formData.content_de}
                    onChange={(e) => setFormData({ ...formData, content_de: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content_en">Inhalt (Englisch)</Label>
                  <Textarea
                    id="content_en"
                    value={formData.content_en}
                    onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={formData.icon || 'Heart'}
                    onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Reihenfolge</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Veröffentlicht</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  <X className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingInfo ? 'Speichern' : 'Erstellen'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {practiceInfos?.map((info) => {
          const IconComponent = iconMap[info.icon || 'Heart'] || Heart;
          return (
            <Card key={info.id} className={!info.is_published ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage-100">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">#{info.sort_order}</span>
                        <span className="text-xs text-muted-foreground">/{info.slug}</span>
                        {!info.is_published && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                            Entwurf
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium">{info.title_de}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {info.content_de}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={info.is_published}
                      onCheckedChange={() => togglePublished(info)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(info)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Praxis-Info löschen?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Sind Sie sicher, dass Sie diese Praxis-Info löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(info.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Löschen
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {practiceInfos?.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Noch keine Praxis-Informationen vorhanden. Erstellen Sie Ihren ersten Eintrag.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
