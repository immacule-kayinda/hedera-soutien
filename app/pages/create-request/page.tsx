"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateRequest() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "",
    urgency: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de création (frontend seulement)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Demande créée avec succès",
      description: "Votre demande d'aide a été publiée sur la plateforme",
    });

    setLoading(false);
    router.push("/assistance");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                Créer une demande d&apos;aide
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire pour soumettre votre besoin à la
                communauté
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de la demande *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Rampe d'accès pour mon domicile"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    data-testid="input-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description détaillée *</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre besoin en détail..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    data-testid="input-description"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant souhaité (ℏ) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="800"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                      data-testid="input-amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger
                        id="category"
                        data-testid="select-category"
                      >
                        <SelectValue placeholder="Choisir une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Équipement</SelectItem>
                        <SelectItem value="formation">Formation</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="housing">Logement</SelectItem>
                        <SelectItem value="healthcare">Santé</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Niveau d'urgence *</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value: string) =>
                        setFormData({ ...formData, urgency: value })
                      }
                    >
                      <SelectTrigger id="urgency" data-testid="select-urgency">
                        <SelectValue placeholder="Choisir le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Normal</SelectItem>
                        <SelectItem value="medium">Modéré</SelectItem>
                        <SelectItem value="high">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Localisation</Label>
                    <Input
                      id="location"
                      placeholder="Paris, France"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      data-testid="input-location"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={loading}
                    data-testid="button-submit"
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Publier la demande
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/assistance")}
                    data-testid="button-cancel"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
