"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TransactionHistoryTable from "@/components/TransactionHistoryTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

export default function Transparency() {
  const [searchTx, setSearchTx] = useState("");

  const mockTransactions = [
    {
      id: "1",
      type: "don" as const,
      amount: 250,
      date: "25 Jan 2025",
      status: "confirmé" as const,
      txHash: "0x123...",
    },
    {
      id: "2",
      type: "reçu" as const,
      amount: 450,
      date: "20 Jan 2025",
      status: "confirmé" as const,
      txHash: "0x456...",
    },
    {
      id: "3",
      type: "don" as const,
      amount: 100,
      date: "15 Jan 2025",
      status: "confirmé" as const,
      txHash: "0x789...",
    },
    {
      id: "4",
      type: "transfert" as const,
      amount: 75,
      date: "10 Jan 2025",
      status: "confirmé" as const,
      txHash: "0xabc...",
    },
    {
      id: "5",
      type: "don" as const,
      amount: 500,
      date: "05 Jan 2025",
      status: "confirmé" as const,
      txHash: "0xdef...",
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
                Transparence Blockchain
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Vérifiez toutes les transactions enregistrées sur la blockchain
                Hedera
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par ID de transaction ou Account ID..."
                    className="pl-10"
                    value={searchTx}
                    onChange={(e) => setSearchTx(e.target.value)}
                    data-testid="input-search-tx"
                  />
                </div>
                <Button data-testid="button-search">Rechercher</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="font-display font-semibold text-2xl mb-2">
                Transactions Récentes
              </h2>
              <p className="text-muted-foreground">
                Toutes les transactions sont publiques et vérifiables
              </p>
            </div>

            <TransactionHistoryTable transactions={mockTransactions} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
