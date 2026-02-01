import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Stethoscope, Euro, Zap, HelpCircle, BookOpen, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface InfothekItem {
  label: { de: string; en: string };
  href: string;
  icon: React.ElementType;
  description: { de: string; en: string };
  external?: boolean;
}

const infothekItems: InfothekItem[] = [
  {
    label: { de: "Was ist ein Heilpraktiker?", en: "What is a Naturopath?" },
    href: "/heilpraktiker",
    icon: Stethoscope,
    description: { de: "Berufsbild und Behandlungsmethoden", en: "Profession and treatment methods" },
  },
  {
    label: { de: "Was ist Frequenztherapie?", en: "What is Frequency Therapy?" },
    href: "/krankheit-ist-messbar.html",
    icon: Zap,
    description: { de: "Physikalische Grundlagen der Frequenztherapie", en: "Physical foundations of frequency therapy" },
    external: true,
  },
  {
    label: { de: "Diamond Shield Zapper", en: "Diamond Shield Zapper" },
    href: "/zapper-diamond-shield.html",
    icon: Radio,
    description: { de: "Frequenzgerät für Wellness und Erfahrungsheilkunde", en: "Frequency device for wellness" },
    external: true,
  },
  {
    label: { de: "GebÜH", en: "Fee Schedule" },
    href: "/gebueh",
    icon: Euro,
    description: { de: "Gebührenordnung für Heilpraktiker", en: "Fee schedule for practitioners" },
  },
  {
    label: { de: "Häufige Fragen", en: "FAQ" },
    href: "/faq",
    icon: HelpCircle,
    description: { de: "Antworten auf wichtige Fragen", en: "Answers to important questions" },
  },
];

interface InfothekDropdownProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export function InfothekDropdown({ isMobile = false, onItemClick }: InfothekDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { t } = useLanguage();

  const isInfothekActive = infothekItems.some((item) => location.pathname === item.href);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (isMobile) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
            isInfothekActive
              ? "bg-sage-100 text-primary"
              : "text-muted-foreground hover:bg-sage-50 hover:text-primary"
          )}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t("Infothek", "Info Center")}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
        {isOpen && (
          <div className="ml-4 space-y-1 border-l-2 border-sage-200 pl-4">
            {infothekItems.map((item) => 
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onItemClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors text-muted-foreground hover:bg-sage-50 hover:text-primary"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{t(item.label.de, item.label.en)}</span>
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    location.pathname === item.href
                      ? "bg-sage-100 text-primary font-medium"
                      : "text-muted-foreground hover:bg-sage-50 hover:text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{t(item.label.de, item.label.en)}</span>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sage-100 hover:text-primary",
          isInfothekActive ? "bg-sage-100 text-primary" : "text-muted-foreground"
        )}
      >
        <BookOpen className="mr-1 h-4 w-4" />
        {t("Infothek", "Info Center")}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 animate-in fade-in-0 slide-in-from-top-2 rounded-xl border border-border bg-background p-2 shadow-elevated">
          {infothekItems.map((item) => 
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setIsOpen(false);
                  onItemClick?.();
                }}
                className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-sage-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-100">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    {t(item.label.de, item.label.en)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t(item.description.de, item.description.en)}
                  </div>
                </div>
              </a>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  setIsOpen(false);
                  onItemClick?.();
                }}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3 transition-colors",
                  location.pathname === item.href
                    ? "bg-sage-100 text-primary"
                    : "hover:bg-sage-50"
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sage-100">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      location.pathname === item.href ? "text-primary" : "text-foreground"
                    )}
                  >
                    {t(item.label.de, item.label.en)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t(item.description.de, item.description.en)}
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
