"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NFTBadgeCard from "@/components/NFTBadgeCard";
import WalletDisplay from "@/components/WalletDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NFTWallet() {
  const badges = [
    {
      image: "/Bronze_donor_badge_NFT_25833e98.png",
      tier: "Bronze",
      name: "Donateur Débutant",
      date: "10 Jan 2025",
      rarity: "Commun (45%)",
    },
    {
      image: "/Silver_donor_badge_NFT_70fc8acd.png",
      tier: "Argent",
      name: "Donateur Engagé",
      date: "12 Jan 2025",
      rarity: "Peu commun (30%)",
    },
    {
      image: "/Gold_donor_badge_NFT_286fb70c.png",
      tier: "Or",
      name: "Donateur Généreux",
      date: "15 Jan 2025",
      rarity: "Rare (12%)",
    },
    {
      image: "/Diamond_donor_badge_NFT_865f12fc.png",
      tier: "Diamant",
      name: "Donateur Exceptionnel",
      date: "20 Jan 2025",
      rarity: "Très rare (8%)",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Mon Wallet NFT
            </h1>
            <p className="text-lg text-muted-foreground">
              Gérez vos badges de reconnaissance et votre wallet Hedera
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <WalletDisplay
                accountId="0.0.7144230"
                balance={1000}
                connected={true}
              />
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="badges" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="badges" data-testid="tab-badges">
                    Mes Badges
                  </TabsTrigger>
                  <TabsTrigger
                    value="certificates"
                    data-testid="tab-certificates"
                  >
                    Certificats
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="badges" className="mt-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {badges.map((badge, index) => (
                      <NFTBadgeCard key={index} {...badge} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="certificates" className="mt-6">
                  <div className="text-center py-12 text-muted-foreground">
                    Aucun certificat pour le moment
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
