"use client";

import { useMemo } from "react";
import { Activity, Clock3, MessagesSquare } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockedRequests = [
  {
    id: "REQ-2025-001",
    title: "Aménagement de poste de travail",
    status: "IN_PROGRESS" as const,
    updatedAt: "12 janvier 2025",
    summary: "Validation du budget en cours. Rendez-vous prévu avec l'équipe HandiHelp.",
    lastMessageFrom: "Conseiller HandiHelp",
  },
  {
    id: "REQ-2025-002",
    title: "Financement d'un fauteuil adapté",
    status: "REVIEW" as const,
    updatedAt: "10 janvier 2025",
    summary: "Demande de devis complémentaire envoyée. En attente de réponse.",
    lastMessageFrom: "Vous",
  },
  {
    id: "REQ-2024-018",
    title: "Formation inclusion numérique",
    status: "RESOLVED" as const,
    updatedAt: "18 décembre 2024",
    summary: "Session financée et plan de formation validé. Clôturé avec succès.",
    lastMessageFrom: "Conseiller HandiHelp",
  },
];

const statusCopy: Record<"IN_PROGRESS" | "REVIEW" | "RESOLVED", { label: string; variant: "default" | "outline" | "secondary"; description: string } > = {
  IN_PROGRESS: {
    label: "En cours",
    variant: "default",
    description: "Notre équipe avance sur votre dossier."
  },
  REVIEW: {
    label: "À compléter",
    variant: "secondary",
    description: "Une action est attendue de votre part."
  },
  RESOLVED: {
    label: "Terminé",
    variant: "outline",
    description: "La demande a été finalisée."
  },
};

export default function DashboardRequests() {
  const activeRequests = useMemo(
    () => mockedRequests.filter((request) => request.status !== "RESOLVED"),
    []
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-display font-semibold">Mes demandes d'aide</h1>
        <p className="text-muted-foreground">
          Visualisez l'état de vos demandes et les actions attendues. Ces données sont actuellement simulées.
        </p>
      </header>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Recommandation</CardTitle>
          <CardDescription>
            Pour un suivi en temps réel, nous connecterons cette page à l'API HandiHelp.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="/create-request">Déposer une nouvelle demande</a>
          </Button>
          <Button variant="outline">Exporter l'historique</Button>
        </CardContent>
      </Card>

      <section className="space-y-4">
        {mockedRequests.map((request) => {
          const status = statusCopy[request.status];
          return (
            <Card key={request.id} className="border shadow-none hover:shadow-md transition">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {request.title}
                  </CardTitle>
                  <CardDescription>ID : {request.id}</CardDescription>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{request.summary}</p>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    Mis à jour le {request.updatedAt}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessagesSquare className="h-4 w-4" />
                    Dernier échange : {request.lastMessageFrom}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    {status.description}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary">Voir le détail</Button>
                  {request.status === "REVIEW" && (
                    <Button>Compléter ma demande</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Prochains développements</CardTitle>
          <CardDescription>
            Voici ce que nous prévoyons d'ajouter pour rendre cette page encore plus utile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Connexion à la base de données via Prisma pour récupérer les vraies demandes.</li>
            <li>Filtrer par statut (en cours, en attente, terminé) et par période.</li>
            <li>Mettre en place des notifications en temps réel quand une demande évolue.</li>
            <li>Historique détaillé des échanges et pièces jointes.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}