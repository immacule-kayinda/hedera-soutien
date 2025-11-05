"use client";

import AssistanceRequestCard from "@/components/AssistanceRequestCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Assistance() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated, user } = useAuth();

  const mockRequests = [
    {
      id: "req-1",
      title: "Rampe d'accès pour mon domicile",
      description:
        "J'ai besoin d'une rampe d'accès pour pouvoir entrer et sortir de chez moi en toute autonomie avec mon fauteuil roulant.",
      amount: 800,
      raised: 520,
      urgency: "high" as const,
      category: "Équipement",
      location: "Paris, France",
      daysLeft: 15,
      image: "/Impact_story_accessibility_ramp_7ed87f82.png",
    },
    {
      id: "req-2",
      title: "Fauteuil roulant électrique",
      description:
        "Mon ancien fauteuil ne fonctionne plus correctement. J'ai besoin d'un fauteuil électrique pour ma mobilité quotidienne.",
      amount: 3500,
      raised: 1200,
      urgency: "medium" as const,
      category: "Équipement",
      location: "Lyon, France",
      daysLeft: 30,
    },
    {
      id: "req-3",
      title: "Formation en informatique",
      description:
        "Je souhaite suivre une formation en développement web pour améliorer mon employabilité.",
      amount: 1200,
      raised: 800,
      urgency: "low" as const,
      category: "Formation",
      location: "Marseille, France",
      daysLeft: 45,
    },
    {
      id: "req-4",
      title: "Aide au transport adapté",
      description:
        "Besoin d'aide pour financer mes déplacements en transport adapté pour mes rendez-vous médicaux.",
      amount: 600,
      raised: 150,
      urgency: "high" as const,
      category: "Transport",
      location: "Toulouse, France",
      daysLeft: 20,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4">
                Demandes d&apos;Assistance
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Parcourez les besoins de la communauté et faites une différence
              </p>
              {isAuthenticated && user?.role === "beneficiary" && (
                <div className="mt-6">
                  <Link href="/create-request">
                    <Button
                      size="lg"
                      className="gap-2"
                      data-testid="button-create-request"
                    >
                      <Plus className="h-5 w-5" />
                      Créer une demande d&apos;aide
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une demande..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <Select>
                <SelectTrigger
                  className="w-full sm:w-48"
                  data-testid="select-category"
                >
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="equipment">Équipement</SelectItem>
                  <SelectItem value="formation">Formation</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger
                  className="w-full sm:w-48"
                  data-testid="select-urgency"
                >
                  <SelectValue placeholder="Urgence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="high">Urgent</SelectItem>
                  <SelectItem value="medium">Modéré</SelectItem>
                  <SelectItem value="low">Normal</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                data-testid="button-filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRequests.map((request, index) => (
                <AssistanceRequestCard key={index} {...request} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
