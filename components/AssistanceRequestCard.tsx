"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, Heart } from "lucide-react";
import DonateModal from "@/pages/DonateModal";

interface AssistanceRequestCardProps {
  id?: string;
  title: string;
  description: string;
  amount: number;
  raised: number;
  urgency: "low" | "medium" | "high";
  category: string;
  location?: string;
  daysLeft?: number;
  image?: string;
}

export default function AssistanceRequestCard({
  id,
  title,
  description,
  amount,
  raised,
  urgency,
  category,
  location,
  daysLeft,
  image
}: AssistanceRequestCardProps) {
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const progress = (raised / amount) * 100;
  
  const urgencyColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500"
  };

  const urgencyLabels = {
    low: "Normal",
    medium: "Modéré",
    high: "Urgent"
  };

  return (
    <Card className="overflow-hidden hover-elevate h-full flex flex-col" data-testid="card-assistance-request">
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <Image 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            data-testid="img-request"
          />
        </div>
      )}
      
      <CardContent className="p-6 flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" data-testid="badge-category">{category}</Badge>
          <Badge className={urgencyColors[urgency]} data-testid="badge-urgency">
            {urgencyLabels[urgency]}
          </Badge>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2" data-testid="text-title">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3" data-testid="text-description">
            {description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold" data-testid="text-raised">{raised} ℏ</span>
            <span className="text-muted-foreground" data-testid="text-goal">Objectif: {amount} ℏ</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-funding" />
          <p className="text-xs text-muted-foreground" data-testid="text-progress">
            {progress.toFixed(0)}% financé
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-2">
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span data-testid="text-location">{location}</span>
            </div>
          )}
          {daysLeft && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span data-testid="text-days">{daysLeft} jours restants</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full gap-2" 
          onClick={() => setDonateModalOpen(true)}
          data-testid="button-donate"
        >
          <Heart className="h-4 w-4" />
          Faire un don
        </Button>
      </CardFooter>
      
      <DonateModal
        open={donateModalOpen}
        onOpenChange={setDonateModalOpen}
        requestTitle={title}
        requestId={id}
      />
    </Card>
  );
}
