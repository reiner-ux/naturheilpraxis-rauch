import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { iaaCategories, therapistCategories, IAACategory } from "@/lib/iaaQuestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Lock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface IAAFormProps {
  data: Record<string, number>;
  onChange: (data: Record<string, number>) => void;
  readOnly?: boolean;
}

const severityLabels = {
  de: ["", "1 – sehr leicht", "2 – leicht", "3 – mäßig", "4 – stark", "5 – sehr stark", "6 – extrem"],
  en: ["", "1 – very mild", "2 – mild", "3 – moderate", "4 – strong", "5 – very strong", "6 – extreme"],
};

const severityColors = [
  "",
  "bg-green-100 border-green-300 text-green-800",
  "bg-lime-100 border-lime-300 text-lime-800",
  "bg-yellow-100 border-yellow-300 text-yellow-800",
  "bg-orange-100 border-orange-300 text-orange-800",
  "bg-red-100 border-red-300 text-red-700",
  "bg-red-200 border-red-400 text-red-900",
];

function SeveritySelector({
  value,
  onChange,
  language,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  language: "de" | "en";
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1 flex-wrap">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(value === n ? 0 : n)}
          className={cn(
            "w-8 h-8 rounded-md border text-sm font-medium transition-all",
            value === n
              ? severityColors[n]
              : "bg-background border-border text-muted-foreground hover:bg-muted",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          title={severityLabels[language][n]}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

function CategorySection({
  category,
  data,
  onChange,
  language,
  disabled,
}: {
  category: IAACategory;
  data: Record<string, number>;
  onChange: (id: string, value: number) => void;
  language: "de" | "en";
  disabled?: boolean;
}) {
  const answeredCount = category.questions.filter((q) => data[q.id] && data[q.id] > 0).length;

  return (
    <AccordionItem value={category.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <span className="font-medium text-left">
            {language === "de" ? category.titleDe : category.titleEn}
          </span>
          {answeredCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {answeredCount}/{category.questions.length}
            </Badge>
          )}
          {disabled && <Lock className="h-4 w-4 text-muted-foreground" />}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 pt-2">
          {category.questions.map((q) => (
            <div
              key={q.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 border-b border-border/50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs text-muted-foreground mr-2">{q.id}</span>
                <span className="text-sm">
                  {language === "de" ? q.textDe : q.textEn}
                </span>
                {q.hintDe && (
                  <p className="text-xs text-muted-foreground mt-0.5 italic">
                    {language === "de" ? q.hintDe : q.hintEn}
                  </p>
                )}
              </div>
              <SeveritySelector
                value={data[q.id] || 0}
                onChange={(v) => onChange(q.id, v)}
                language={language}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function IAAForm({ data, onChange, readOnly }: IAAFormProps) {
  const { language, t } = useLanguage();

  const handleChange = (id: string, value: number) => {
    if (readOnly) return;
    const updated = { ...data };
    if (value === 0) {
      delete updated[id];
    } else {
      updated[id] = value;
    }
    onChange(updated);
  };

  const totalAnswered = Object.values(data).filter((v) => v > 0).length;
  const totalQuestions = iaaCategories.reduce((sum, c) => sum + c.questions.length, 0);

  return (
    <div className="space-y-6">
      {/* Erklärung */}
      <Card className="border-primary/20 bg-sage-50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Info className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                {t(
                  "IAA – Individuelle Austestung und Analyse",
                  "IAA – Individual Testing and Analysis"
                )}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "Dieser spezielle Fragebogen ist auf das Trikombin-Behandlungsgerät zugeschnitten und dient der individuellen Analyse Ihrer Beschwerden. Bitte bewerten Sie bei zutreffenden Beschwerden den Schweregrad von 1 (sehr leicht) bis 6 (sehr stark). Nicht zutreffende Beschwerden bitte freilassen.",
                  "This specialized questionnaire is tailored to the Trikombin treatment device and serves for individual analysis of your complaints. Please rate applicable complaints on a severity scale from 1 (very mild) to 6 (very severe). Leave non-applicable complaints empty."
                )}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <span key={n} className={cn("px-2 py-0.5 rounded text-xs border", severityColors[n])}>
                    {severityLabels[language][n]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="text-sm text-muted-foreground text-center">
        {t(
          `${totalAnswered} von ${totalQuestions} Fragen beantwortet`,
          `${totalAnswered} of ${totalQuestions} questions answered`
        )}
      </div>

      {/* Patient questions */}
      <Accordion type="multiple" defaultValue={[iaaCategories[0].id]} className="space-y-2">
        {iaaCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            data={data}
            onChange={handleChange}
            language={language}
            disabled={readOnly}
          />
        ))}
      </Accordion>

      {/* Therapist section (locked) */}
      <Card className="border-muted bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-muted-foreground font-serif text-lg">
            <Lock className="h-5 w-5" />
            {t("Therapeuten-Bereich", "Therapist Section")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t(
              "Dieser Bereich wird vom Therapeuten während der Behandlung ausgefüllt.",
              "This section is filled in by the therapist during treatment."
            )}
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple">
            {therapistCategories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                data={{}}
                onChange={() => {}}
                language={language}
                disabled={true}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
