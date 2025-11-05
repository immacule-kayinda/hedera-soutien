"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Heart, HandHelping } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "donor" as "beneficiary" | "donor",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Erreur", {
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      toast.success("Inscription réussie", {
        description: "Bienvenue dans la communauté HandiHelp !",
      });
      router.push("/");
    } catch (error) {
      toast.error("Erreur d'inscription", {
        description: "Une erreur s'est produite",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-gradient-to-br from-background via-card to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-2xl">
                H
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-display">
            Inscription
          </CardTitle>
          <CardDescription className="text-center">
            Rejoignez la communauté HandiHelp
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Je suis</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    role: value as "beneficiary" | "donor",
                  })
                }
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="beneficiary"
                    id="beneficiary"
                    className="peer sr-only"
                    data-testid="radio-beneficiary"
                  />
                  <Label
                    htmlFor="beneficiary"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover-elevate peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <HandHelping className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Bénéficiaire</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="donor"
                    id="donor"
                    className="peer sr-only"
                    data-testid="radio-donor"
                  />
                  <Label
                    htmlFor="donor"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover-elevate peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <Heart className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Donateur</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Jean Dupont"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                data-testid="input-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                data-testid="input-confirm-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-testid="button-submit"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              S&apos;inscrire
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login">
                <span
                  className="text-primary hover:underline cursor-pointer"
                  data-testid="link-login"
                >
                  Se connecter
                </span>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
