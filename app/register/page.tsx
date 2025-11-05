"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, HandHelping, Heart } from "lucide-react";

const roles = [
  {
    id: "beneficiary",
    title: "Bénéficiaire",
    description:
      "Recevoir du matériel adapté, un accompagnement ou un financement.",
    icon: HandHelping,
    href: "/register/beneficiary",
  },
  {
    id: "donor",
    title: "Donateur",
    description: "Soutenir des projets inclusifs via des dons ou du mentorat.",
    icon: Heart,
    href: "/register/donor",
  },
];

export default function RegisterSelectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-gradient-to-br from-background via-card to-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <CardTitle className="text-2xl text-center font-display">
            Rejoindre HandiHelp
          </CardTitle>
          <CardDescription className="text-center">
            Choisissez votre profil pour accéder au formulaire adapté.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <RadioGroup className="grid gap-4 md:grid-cols-2">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <Card
                    key={role.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(role.href)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(role.href);
                      }
                    }}
                    className="transition hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-primary" />
                          <div>
                            <h3 className="text-lg font-semibold">
                              {role.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {role.description}
                            </p>
                          </div>
                        </div>
                        <RadioGroupItem
                          value={role.id}
                          id={role.id}
                          className="sr-only"
                        />
                      </div>
                      <Button className="w-full" variant="secondary">
                        Continuer comme {role.title.toLowerCase()}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <span>Déjà inscrit ?</span>
          <Button variant="default" onClick={() => router.push("/login")}>
            Se connecter
          </Button>
          <p className="text-xs">
            Vous pourrez toujours changer votre rôle plus tard avec l'équipe
            HandiHelp.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
