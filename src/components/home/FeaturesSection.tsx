import { Link } from "react-router-dom";
import { FileText, Stethoscope, Euro, Apple, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: FileText,
    title: "Anamnesebogen",
    description: "Füllen Sie Ihren persönlichen Gesundheitsfragebogen bequem von zu Hause aus.",
    href: "/anamnesebogen",
    accent: true,
  },
  {
    icon: Stethoscope,
    title: "Was ist ein Heilpraktiker?",
    description: "Erfahren Sie mehr über die Naturheilkunde und meine Behandlungsmethoden.",
    href: "/heilpraktiker",
  },
  {
    icon: Euro,
    title: "GebÜH",
    description: "Informationen zur Gebührenordnung und Kostenübersicht für Heilpraktiker.",
    href: "/gebueh",
  },
  // Ernährung temporär deaktiviert
  // {
  //   icon: Apple,
  //   title: "Ernährungsratschläge",
  //   description: "Tipps für eine gesunde, ausgewogene Ernährung als Basis Ihrer Gesundheit.",
  //   href: "/ernaehrung",
  // },
  {
    icon: HelpCircle,
    title: "Häufige Fragen",
    description: "Antworten auf die am häufigsten gestellten Fragen rund um die Behandlung.",
    href: "/faq",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
            Ihre Patienten-App
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Alle wichtigen Informationen und Services übersichtlich an einem Ort
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Link
              key={feature.href}
              to={feature.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1",
                feature.accent
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "bg-card shadow-card hover:shadow-elevated"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={cn(
                  "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                  feature.accent ? "bg-sage-600" : "bg-sage-100"
                )}
              >
                <feature.icon
                  className={cn(
                    "h-6 w-6",
                    feature.accent ? "text-primary-foreground" : "text-primary"
                  )}
                />
              </div>

              <h3
                className={cn(
                  "mb-2 font-serif text-xl font-medium",
                  feature.accent ? "text-primary-foreground" : "text-foreground"
                )}
              >
                {feature.title}
              </h3>

              <p
                className={cn(
                  "mb-4 text-sm leading-relaxed",
                  feature.accent ? "text-sage-100" : "text-muted-foreground"
                )}
              >
                {feature.description}
              </p>

              <div
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium transition-transform duration-300 group-hover:translate-x-1",
                  feature.accent ? "text-sage-200" : "text-primary"
                )}
              >
                Mehr erfahren
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
