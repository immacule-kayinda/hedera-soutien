"use client";

import { useMemo } from "react";
import { Award, BarChart3, Coins, Gift } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const mockedContributions = [
  {
    id: "DON-2025-003",
    title: "Campagne accessibilité universelle",
    amount: 500,
    date: "15 janvier 2025",
    impact: "Financement de 12 ateliers inclusion numérique",
    status: "IN_PROGRESS" as const,
  },
  {
    id: "DON-2024-021",
    title: "Solidarité fauteuils sur-mesure",
    amount: 1200,
    date: "10 décembre 2024",
    impact: "Achat d'un fauteuil adapté pour Lucie",
    status: "COMPLETED" as const,
  },
  {
    id: "DON-2024-017",
    title: "Programme mentorat HandiTech",
    amount: 300,
    date: "5 novembre 2024",
    impact: "Accompagnement de 3 jeunes en reconversion",
    status: "COMPLETED" as const,
  },
];

const statusLabels: Record<"IN_PROGRESS" | "COMPLETED", string> = {
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
};

export default function DashboardContributions() {
  const { user } = useAuth();

  const totalAmount = useMemo(
    () => mockedContributions.reduce((sum, donation) => sum + donation.amount, 0),
    []
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-display font-semibold">Mes contributions</h1>
        <p className="text-muted-foreground">
          Merci {user?.name?.split(" ")[0] ?? "pour votre engagement"}! Retrouvez ici un aperçu de votre impact.
          Ces données sont simulées pour illustrer le futur tableau de bord.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Contribution totale
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                {totalAmount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </CardDescription>
            </div>
            <Coins className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Projets soutenus
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                {mockedContributions.length}
              </CardDescription>
            </div>
            <BarChart3 className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Impact direct
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                3 bénéficiaires
              </CardDescription>
            </div>
            <Gift className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Dernier badge
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                Argent
              </CardDescription>
            </div>
            <Award className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recommandation</CardTitle>
          <CardDescription>
            Nous connecterons bientôt ce module à votre portefeuille HandiHelp pour afficher vos NFT et votre historique réel.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="/nft-wallet">Voir mon wallet</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/dashboard/contributions#tax-receipts">Télécharger mes reçus fiscaux</a>
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-4">
        {mockedContributions.map((donation) => (
          <Card key={donation.id} className="border shadow-none hover:shadow-md transition">
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {donation.title}
                </CardTitle>
                <CardDescription>ID : {donation.id}</CardDescription>
              </div>
              <Badge>{statusLabels[donation.status]}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-4">
                <span><strong>Montant :</strong> {donation.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                <span><strong>Date :</strong> {donation.date}</span>
              </div>
              <p><strong>Impact :</strong> {donation.impact}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary">Consulter le détail</Button>
                <Button variant="outline">Partager mon engagement</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card id="tax-receipts">
        <CardHeader>
          <CardTitle>À venir</CardTitle>
          <CardDescription>Les prochaines améliorations prévues pour les donateurs.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Connexion directe au wallet Hedera pour voir le solde en temps réel.</li>
            <li>Import automatique des reçus fiscaux et téléchargements sécurisés.</li>
            <li>Suivi des badges NFT débloqués selon vos contributions.</li>
            <li>Recommandations personnalisées de projets à soutenir.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}