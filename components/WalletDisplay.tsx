"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface WalletDisplayProps {
  accountId: string;
  balance: number;
  connected?: boolean;
}

export default function WalletDisplay({ accountId, balance, connected = true }: WalletDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyAccountId = () => {
    navigator.clipboard.writeText(accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card data-testid="card-wallet">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Wallet Hedera</CardTitle>
        {connected && (
          <Badge variant="secondary" className="gap-1" data-testid="badge-connected">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            Connecté
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <div className="font-display font-bold text-3xl" data-testid="text-balance">
              {balance.toLocaleString()} <span className="text-xl text-muted-foreground">ℏ</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Solde disponible</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Account ID</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm bg-muted px-3 py-2 rounded-md font-mono truncate" data-testid="text-account-id">
              {accountId}
            </code>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={copyAccountId}
              data-testid="button-copy"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button variant="outline" className="w-full gap-2" data-testid="button-explorer">
          <ExternalLink className="h-4 w-4" />
          Voir sur Hedera Explorer
        </Button>
      </CardContent>
    </Card>
  );
}
