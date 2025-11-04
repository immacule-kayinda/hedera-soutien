import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Lock, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function TransparencyShowcase() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Blockchain Hedera",
      description:
        "Toutes les transactions sont enregistrées sur la blockchain publique Hedera",
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "100% Traçable",
      description: "Suivez chaque don de la source jusqu'au bénéficiaire final",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Sécurisé",
      description:
        "Cryptographie avancée pour protéger vos données et vos transactions",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
                Transparence Garantie par Blockchain
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Chaque don effectué sur HandiHelp est enregistré de manière
                immuable sur la blockchain Hedera. Vous pouvez vérifier
                l&apos;authenticité de chaque transaction à tout moment.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="text-primary shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Link href="/transparency">
              <Button
                size="lg"
                className="gap-2"
                data-testid="button-explore-transparency"
              >
                Explorer les Transactions
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-2xl p-8 border">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Account ID
                </span>
                <code className="text-sm font-mono bg-muted px-3 py-1 rounded">
                  0.0.7144230
                </code>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Balance</span>
                <span className="font-semibold">1,000 ℏ</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="text-sm">Hedera Testnet</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-muted-foreground">Statut</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Connecté</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
