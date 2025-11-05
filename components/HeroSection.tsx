import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${"/Hero_homepage_community_support_1e3c5783.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-3xl">
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-6">
            Chaque aide tracée, chaque geste valorisé
          </h1>

          <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl">
            Handihelp connecte les personnes en situation de handicap avec des
            partenaires dans une transparence totale et un impact vérifiable.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/register/">
              <Button
                size="lg"
                className="gap-2 backdrop-blur-md bg-white/90 text-foreground hover:bg-white border border-border"
                data-testid="button-get-help"
              >
                Demander de l&apos;aide
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register/donor">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 backdrop-blur-md bg-white/10 text-white border-white/30 hover:bg-white/20"
                data-testid="button-become-donor"
              >
                Devenir donateur
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">100% transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">Blockchain vérifiée</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium">Impact réel</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
