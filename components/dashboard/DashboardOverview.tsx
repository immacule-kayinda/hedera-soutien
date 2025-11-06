"use client";

import { useMemo } from "react";
import { ArrowUpRight, CalendarCheck2, HeartHandshake, Inbox } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardOverview() {
  const { user } = useAuth();

  const isBeneficiary = user?.role === "BENEFICIARY";
  const isDonor = user?.role === "DONOR";

  const heroTitle = useMemo(() => {
    if (isBeneficiary) {
      return "Suivi rapide de vos demandes";
    }
    if (isDonor) {
      return "Merci pour votre engagement !";
    }
    return "Bienvenue dans votre espace";
  }, [isBeneficiary, isDonor]);

  const heroSubtitle = useMemo(() => {
    if (isBeneficiary) {
      return "Visualisez vos demandes d'aide, suivez leurs statuts et découvrez les prochaines étapes.";
    }
    if (isDonor) {
      return "Gardez un œil sur vos contributions, vos badges NFT et les initiatives que vous soutenez.";
    }
    return "Gérez vos informations personnelles et retrouvez toutes vos actions en un clin d'œil.";
  }, [isBeneficiary, isDonor]);

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border rounded-3xl px-8 py-10">
        <p className="text-sm uppercase tracking-wide text-primary mb-2">Espace utilisateur</p>
        <h1 className="text-3xl font-display font-semibold text-foreground mb-3">
          {heroTitle}
        </h1>
        <p className="text-muted-foreground max-w-2xl mb-6">
          {heroSubtitle}
        </p>
        {isBeneficiary && (
          <Button variant="default" className="gap-2" href="/create-request" asChild>
            <a>
              Déposer une nouvelle demande
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Button>
        )}
        {isDonor && (
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <a href="/dashboard/contributions">
                Voir mes contributions
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="secondary" asChild className="gap-2">
              <a href="/nft-wallet">
                Mes badges NFT
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Demandes actives
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                2
              </CardDescription>
            </div>
            <Inbox className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Dernière mise à jour
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                Hier
              </CardDescription>
            </div>
            <CalendarCheck2 className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Interactions reçues
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                5
              </CardDescription>
            </div>
            <HeartHandshake className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm text-muted-foreground font-normal">
                Prochain rendez-vous
              </CardTitle>
              <CardDescription className="text-2xl font-semibold text-foreground">
                25 Janv.
              </CardDescription>
            </div>
            <CalendarCheck2 className="h-8 w-8 text-primary" />
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Les dernières étapes enregistrées sur vos dossiers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Votre demande "Aménagement poste de travail" est passée en revue.</p>
                <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">L'équipe HandiHelp a proposé un rendez-vous pour le 25 Janvier.</p>
                <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Nouvelle ressource partagée : Guide des aides financières.</p>
                <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochaines étapes</CardTitle>
            <CardDescription>Anticipez les actions à venir pour rester à jour.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Compléter vos informations de profil</p>
              <p className="text-xs text-muted-foreground">Renseignez votre adresse et pièces justificatives pour accélérer les échanges.</p>
              <Button variant="link" className="px-0 text-primary" asChild>
                <a href="/dashboard/profile">Mettre à jour</a>
              </Button>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Confirmer votre présence au rendez-vous</p>
              <p className="text-xs text-muted-foreground">Votre conseiller HandiHelp vous a proposé une visioconférence le 25 janvier.</p>
              <Button variant="link" className="px-0 text-primary" asChild>
                <a href="/dashboard/requests">Répondre maintenant</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}