import { Button } from "@/components/ui/button";
import { Heart, HandHelping } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-32 bg-linear-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-5xl mb-6">
            Rejoignez la Communauté HandiHelp
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Que vous ayez besoin d&apos;aide ou souhaitiez aider, HandiHelp est
            là pour vous
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border space-y-4 hover-elevate">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <HandHelping className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-2xl">
              Besoin d&apos;aide ?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Créez votre profil et formulez vos demandes d&apos;assistance. La
              communauté est là pour vous soutenir.
            </p>
            <Link href="/register/handicapped">
              <Button
                size="lg"
                className="w-full"
                data-testid="button-cta-get-help"
              >
                Demander de l&apos;aide
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-2xl p-8 border space-y-4 hover-elevate">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-2xl">
              Envie d&apos;aider ?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Devenez donateur et faites une différence réelle. Chaque
              contribution compte et est tracée.
            </p>
            <Link href="/register/donor">
              <Button
                size="lg"
                className="w-full"
                data-testid="button-cta-become-donor"
              >
                Devenir donateur
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
