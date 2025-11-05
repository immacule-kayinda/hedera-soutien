"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart } from "lucide-react";

interface DonateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestTitle: string;
  requestId?: string;
}

export default function DonateModal({ open, onOpenChange, requestTitle }: DonateModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de don (frontend seulement)
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Don effectué avec succès",
      description: `Vous avez donné ${amount} ℏ. Transaction enregistrée sur Hedera.`,
    });

    setLoading(false);
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-donate">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Faire un don
          </DialogTitle>
          <DialogDescription>
            {requestTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDonate}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (ℏ)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                data-testid="input-donate-amount"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount("50")}
                data-testid="button-preset-50"
              >
                50 ℏ
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount("100")}
                data-testid="button-preset-100"
              >
                100 ℏ
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount("250")}
                data-testid="button-preset-250"
              >
                250 ℏ
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Votre solde</span>
                <span className="font-medium">1,000 ℏ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frais réseau</span>
                <span className="font-medium">~0.0001 ℏ</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-donate"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !amount}
              data-testid="button-confirm-donate"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmer le don
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
