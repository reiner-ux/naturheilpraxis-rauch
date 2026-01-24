import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Leaf, LogIn, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { translations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { toast } = useToast();
  const nav = translations.nav;
  const header = translations.header;

  const navItems = [
    { label: t(nav.home.de, nav.home.en), href: "/" },
    { label: t(nav.anamnesis.de, nav.anamnesis.en), href: "/anamnesebogen" },
    { label: t(nav.privacy.de, nav.privacy.en), href: "/datenschutz" },
    { label: t(nav.practitioner.de, nav.practitioner.en), href: "/heilpraktiker" },
    { label: t(nav.fees.de, nav.fees.en), href: "/gebueh" },
    // { label: t(nav.nutrition.de, nav.nutrition.en), href: "/ernaehrung" }, // Temporär deaktiviert
    // { label: t(nav.practice.de, nav.practice.en), href: "/praxis-info" }, // Temporär deaktiviert
    { label: t(nav.faq.de, nav.faq.en), href: "/faq" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: t("Abgemeldet", "Signed Out"),
      description: t("Sie wurden erfolgreich abgemeldet.", "You have been successfully signed out."),
    });
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-semibold leading-tight text-foreground">
              {t(header.practice.de, header.practice.en)}
            </span>
            <span className="text-xs text-muted-foreground">{header.owner.de}</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sage-100 hover:text-primary",
                location.pathname === item.href
                  ? "bg-sage-100 text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher className="ml-2" />
          
          {/* Auth Button Desktop */}
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sage-100 hover:text-primary",
                    location.pathname === "/admin"
                      ? "bg-sage-100 text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2 rounded-lg bg-sage-50 px-3 py-1.5">
                <User className="h-4 w-4 text-primary" />
                <span className="max-w-[150px] truncate text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t("Abmelden", "Logout")}
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/auth")}
              className="ml-2 gap-2"
            >
              <LogIn className="h-4 w-4" />
              {t("Anmelden", "Login")}
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t(header.openMenu.de, header.openMenu.en)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="animate-slide-up border-t border-border bg-background p-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-sage-100 text-primary"
                    : "text-muted-foreground hover:bg-sage-50 hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Auth Button Mobile */}
            {user ? (
              <div className="mt-2 space-y-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      location.pathname === "/admin"
                        ? "bg-sage-100 text-primary"
                        : "text-muted-foreground hover:bg-sage-50 hover:text-primary"
                    )}
                  >
                    <Shield className="h-4 w-4" />
                    Admin-Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2 rounded-lg bg-sage-50 px-4 py-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t("Abmelden", "Logout")}
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
                className="mt-2 w-full justify-start gap-2"
              >
                <LogIn className="h-4 w-4" />
                {t("Anmelden", "Login")}
              </Button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
