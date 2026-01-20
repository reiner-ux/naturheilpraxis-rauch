import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-elevated p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-foreground">
              {t("Cookie-Einstellungen", "Cookie Settings")}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(
                "Wir verwenden technisch notwendige Cookies, um die Funktionalität unserer Website zu gewährleisten. Diese Cookies speichern keine personenbezogenen Daten. Weitere Informationen finden Sie in unserer ",
                "We use technically necessary cookies to ensure the functionality of our website. These cookies do not store personal data. For more information, please see our "
              )}
              <Link to="/datenschutz" className="text-primary hover:underline">
                {t("Datenschutzerklärung", "Privacy Policy")}
              </Link>.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={handleAccept} size="sm">
                {t("Alle akzeptieren", "Accept All")}
              </Button>
              <Button onClick={handleDecline} variant="outline" size="sm">
                {t("Nur notwendige", "Necessary Only")}
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDecline}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("Schließen", "Close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
