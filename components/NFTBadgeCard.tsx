import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface NFTBadgeCardProps {
  image: string;
  tier: string;
  name: string;
  date?: string;
  rarity?: string;
}

export default function NFTBadgeCard({
  image,
  tier,
  name,
  date,
  rarity,
}: NFTBadgeCardProps) {
  const tierColors: Record<string, string> = {
    Bronze: "from-amber-700 to-amber-900",
    Argent: "from-gray-400 to-gray-600",
    Or: "from-yellow-400 to-yellow-600",
    Diamant: "from-cyan-400 to-blue-600",
    Légendaire: "from-purple-500 via-pink-500 to-red-500",
  };

  return (
    <Card
      className="overflow-hidden hover-elevate hover:scale-105 transition-transform duration-200"
      data-testid="card-nft-badge"
    >
      <div
        className={`h-2 bg-linear-to-r ${
          tierColors[tier] || tierColors["Bronze"]
        }`}
      />
      <CardContent className="p-4 space-y-3">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <Image
            src={image}
            alt={name}
            className="w-full h-full object-contain p-4"
            data-testid="img-badge"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3
              className="font-semibold truncate"
              data-testid="text-badge-name"
            >
              {name}
            </h3>
            <Badge
              variant="secondary"
              className="text-xs shrink-0"
              data-testid="badge-tier"
            >
              {tier}
            </Badge>
          </div>

          {date && (
            <p
              className="text-xs text-muted-foreground"
              data-testid="text-date"
            >
              Obtenu le {date}
            </p>
          )}

          {rarity && (
            <p
              className="text-xs text-muted-foreground"
              data-testid="text-rarity"
            >
              Rareté: {rarity}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
