import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center gap-1 rounded-lg border border-border bg-background p-0.5", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('de')}
        className={cn(
          "h-7 px-2 text-xs font-medium",
          language === 'de' 
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" 
            : "hover:bg-sage-100"
        )}
      >
        DE
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={cn(
          "h-7 px-2 text-xs font-medium",
          language === 'en' 
            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" 
            : "hover:bg-sage-100"
        )}
      >
        EN
      </Button>
    </div>
  );
}
