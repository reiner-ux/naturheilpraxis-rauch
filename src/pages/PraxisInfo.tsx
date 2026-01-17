import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, Leaf, Star, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Shield,
  Users,
  Leaf,
  Star,
  Clock,
};

const PraxisInfo = () => {
  const { language, t } = useLanguage();
  const tr = translations.practiceInfo;

  const { data: practiceInfos, isLoading, error } = useQuery({
    queryKey: ['practice-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('practice_info')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <div className="bg-sage-50 py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 font-serif text-3xl font-semibold text-foreground md:text-4xl">
              {t(tr.title.de, tr.title.en)}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(tr.subtitle.de, tr.subtitle.en)}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="shadow-card">
                  <CardContent className="p-6">
                    <Skeleton className="mb-4 h-12 w-12 rounded-xl" />
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="p-6 text-center text-destructive">
                {t(translations.common.error.de, translations.common.error.en)}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {practiceInfos?.map((info) => {
                const IconComponent = iconMap[info.icon || 'Heart'] || Heart;
                return (
                  <Card key={info.id} className="shadow-card transition-shadow hover:shadow-elevated">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <h2 className="mb-2 font-serif text-xl font-semibold text-foreground">
                        {language === 'de' ? info.title_de : info.title_en}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">
                        {language === 'de' ? info.content_de : info.content_en}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Zitat-Karte */}
          <Card className="mt-12 border-sage-200 bg-sage-50 shadow-card">
            <CardContent className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <Heart className="h-7 w-7 text-primary-foreground" />
              </div>
              <p className="font-serif text-xl font-medium text-sage-700 md:text-2xl">
                {t(tr.quote.de, tr.quote.en)}
              </p>
              <p className="mt-4 text-sm text-sage-600">
                {t(tr.quoteAuthor.de, tr.quoteAuthor.en)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PraxisInfo;
