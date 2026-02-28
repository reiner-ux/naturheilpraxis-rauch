import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Brain, FileText, Loader2, Shield, Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ICD10Result {
  code: string;
  descDe: string;
  descEn: string;
  category: string;
  source: "fixed" | "ai";
  confidence?: number;
  sourceField?: string;
}

interface ICD10Response {
  icd10Codes: ICD10Result[];
  fixedCount: number;
  aiCount: number;
  aiSummary: string | null;
  freeTextAnalyzed: boolean;
  timestamp: string;
  disclaimer: string;
}

const ICD10Generator = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<string>("");
  const [icdResult, setIcdResult] = useState<ICD10Response | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch all anamnesis submissions (admin view)
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-anamnesis-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anamnesis_submissions")
        .select("id, submitted_at, status, form_data")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleGenerate = async () => {
    if (!selectedSubmission) return;
    setGenerating(true);
    setIcdResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-icd10", {
        body: { submissionId: selectedSubmission },
      });

      if (error) throw error;
      setIcdResult(data as ICD10Response);
      toast({
        title: t("ICD-10 Codes generiert", "ICD-10 codes generated"),
        description: t(
          `${data.fixedCount} feste + ${data.aiCount} KI-basierte Zuordnungen`,
          `${data.fixedCount} fixed + ${data.aiCount} AI-based mappings`
        ),
      });
    } catch (err: any) {
      toast({
        title: t("Fehler", "Error"),
        description: err.message || t("ICD-10 Generierung fehlgeschlagen", "ICD-10 generation failed"),
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyAll = () => {
    if (!icdResult) return;
    const text = icdResult.icd10Codes
      .map((c) => `${c.code} – ${language === "de" ? c.descDe : c.descEn} [${c.source === "ai" ? "KI" : "Fix"}]`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPatientLabel = (sub: any) => {
    const fd = sub.form_data as any;
    const name = [fd?.vorname, fd?.nachname].filter(Boolean).join(" ") || "–";
    const date = new Date(sub.submitted_at).toLocaleDateString("de-DE");
    return `${name} (${date})`;
  };

  return (
    <div className="space-y-6">
      {/* DSGVO Notice */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{t("DSGVO-Hinweis:", "GDPR Notice:")}</strong>{" "}
              {t(
                "Die ICD-10-Analyse erfolgt DSGVO-konform. Patientenidentifizierende Daten werden NICHT an externe Dienste übermittelt. Nur anonymisierte Symptombeschreibungen werden für die KI-Analyse verwendet.",
                "ICD-10 analysis is GDPR-compliant. Patient-identifying data is NOT transmitted to external services. Only anonymized symptom descriptions are used for AI analysis."
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            {t("ICD-10 Codes generieren", "Generate ICD-10 Codes")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Select value={selectedSubmission} onValueChange={setSelectedSubmission}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder={t("Einreichung auswählen...", "Select submission...")} />
              </SelectTrigger>
              <SelectContent>
                {submissions?.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {getPatientLabel(sub)} – {sub.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} disabled={!selectedSubmission || generating} className="gap-2">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {t("Generieren", "Generate")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {icdResult && (
        <>
          {/* Summary */}
          {icdResult.aiSummary && (
            <Card className="border-primary/20 bg-sage-50">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">{t("KI-Zusammenfassung", "AI Summary")}</h4>
                    <p className="text-sm text-muted-foreground">{icdResult.aiSummary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ICD-10 Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {t(
                    `${icdResult.icd10Codes.length} ICD-10 Codes gefunden`,
                    `${icdResult.icd10Codes.length} ICD-10 codes found`
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{icdResult.fixedCount} {t("fix", "fixed")}</Badge>
                  <Badge variant="outline">{icdResult.aiCount} {t("KI", "AI")}</Badge>
                  <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-1">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? t("Kopiert", "Copied") : t("Alle kopieren", "Copy all")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("ICD-10", "ICD-10")}</TableHead>
                    <TableHead>{t("Beschreibung", "Description")}</TableHead>
                    <TableHead>{t("Kategorie", "Category")}</TableHead>
                    <TableHead>{t("Quelle", "Source")}</TableHead>
                    <TableHead className="text-right">{t("Konfidenz", "Confidence")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {icdResult.icd10Codes.map((code, idx) => (
                    <TableRow key={`${code.code}-${idx}`}>
                      <TableCell className="font-mono font-semibold">{code.code}</TableCell>
                      <TableCell>{language === "de" ? code.descDe : code.descEn}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{code.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={code.source === "fixed" ? "secondary" : "default"} className="text-xs">
                          {code.source === "fixed" ? t("Fix", "Fixed") : t("KI", "AI")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {code.confidence != null ? `${Math.round(code.confidence * 100)}%` : "–"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  {t(
                    "Diese ICD-10-Codes wurden automatisch generiert und dienen ausschließlich als Vorschlag für den behandelnden Therapeuten. KI-basierte Zuordnungen sind mit einer Konfidenz versehen und müssen vom Therapeuten validiert werden.",
                    "These ICD-10 codes were automatically generated and serve only as suggestions for the treating therapist. AI-based mappings include a confidence score and must be validated by the therapist."
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ICD10Generator;
