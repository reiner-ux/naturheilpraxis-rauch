import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle } from "lucide-react";
import heroImage from "@/assets/hero-nature.jpg";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Naturheilkunde - Kräuter und natürliche Heilmittel"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sage-700/90 via-sage-600/80 to-sage-500/70" />
      </div>

      {/* Content */}
      <div className="container relative py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl animate-fade-in">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-sage-200">
            Naturheilpraxis Peter Rauch
          </p>
          <h1 className="mb-6 font-serif text-4xl font-semibold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Ganzheitliche Heilkunde für Körper und Seele
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-sage-100 md:text-xl">
            Willkommen in Ihrer Patienten-App. Hier finden Sie alle wichtigen
            Informationen, können Ihren Anamnesebogen ausfüllen und erhalten
            wertvolle Tipps für Ihre Gesundheit.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/anamnesebogen">
                <FileText className="mr-2 h-5 w-5" />
                Anamnesebogen ausfüllen
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-sage-200 bg-transparent text-primary-foreground hover:bg-sage-100/20 hover:text-primary-foreground"
            >
              <Link to="/faq">
                <HelpCircle className="mr-2 h-5 w-5" />
                Häufige Fragen
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
