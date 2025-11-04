import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Quote, CheckCircle2 } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  image?: string;
  testimonial: string;
  verified?: boolean;
  badgeLevel?: string;
}

export default function TestimonialCard({ 
  name, 
  role, 
  image, 
  testimonial, 
  verified = true,
  badgeLevel 
}: TestimonialCardProps) {
  return (
    <Card className="h-full hover-elevate" data-testid="card-testimonial">
      <CardContent className="p-6 space-y-4">
        <Quote className="h-8 w-8 text-primary opacity-50" />
        
        <p className="text-base leading-relaxed">
          "{testimonial}"
        </p>

        <div className="flex items-center gap-3 pt-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold truncate" data-testid="text-name">{name}</p>
              {verified && (
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" data-testid="icon-verified" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate" data-testid="text-role">{role}</p>
          </div>
        </div>

        {badgeLevel && (
          <Badge variant="secondary" className="mt-2" data-testid="badge-level">
            {badgeLevel}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
