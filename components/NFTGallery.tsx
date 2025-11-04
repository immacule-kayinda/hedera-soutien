import NFTBadgeCard from "./NFTBadgeCard";

export default function NFTGallery() {
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
    {
      image: "/Legendary_donor_badge_NFT_d465b522.png",
      tier: "Légendaire",
      name: "Héros de la Solidarité",
      date: "25 Jan 2025",
      rarity: "Légendaire (5%)",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Badges NFT de Reconnaissance
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque don est récompensé par un badge NFT unique, preuve indélébile
            de votre générosité
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge, index) => (
            <NFTBadgeCard key={index} {...badge} />
          ))}
        </div>
      </div>
    </section>
  );
}
