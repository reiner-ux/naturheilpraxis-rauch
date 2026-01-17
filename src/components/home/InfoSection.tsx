import { Heart, Shield, Users } from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Ganzheitlicher Ansatz",
    description: "Ich betrachte den Menschen als Einheit von Körper, Geist und Seele.",
  },
  {
    icon: Shield,
    title: "Natürliche Heilmethoden",
    description: "Sanfte Therapien ohne belastende Nebenwirkungen für Ihren Körper.",
  },
  {
    icon: Users,
    title: "Individuelle Betreuung",
    description: "Persönliche Behandlungspläne, die auf Ihre Bedürfnisse zugeschnitten sind.",
  },
];

export function InfoSection() {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
              Über die Praxis
            </p>
            <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              Naturheilkunde mit Herz und Verstand
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Als Heilpraktiker verbinde ich traditionelles Heilwissen mit modernen
              Erkenntnissen. Mein Ziel ist es, die Selbstheilungskräfte Ihres Körpers
              zu aktivieren und Sie auf dem Weg zu mehr Gesundheit und Wohlbefinden
              zu begleiten.
            </p>

            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-serif text-lg font-medium text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-sage-100 to-sage-200 p-8 shadow-elevated">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                    <Heart className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <p className="font-serif text-2xl font-medium text-sage-700">
                    "Gesundheit ist nicht alles, aber ohne Gesundheit ist alles nichts."
                  </p>
                  <p className="mt-4 text-sm text-sage-600">— Arthur Schopenhauer</p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-terracotta/20" />
            <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-sage-300/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
