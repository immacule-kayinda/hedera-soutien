import { UserPlus, Heart, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "1. Inscrivez-vous",
      description:
        "Créez votre compte en quelques clics. Choisissez votre profil: personne handicapée ou donateur.",
      image: "/How_it_works_signup_2aa46701.png",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "2. Demandez ou Donnez",
      description:
        "Formulez une demande d'aide ou parcourez les besoins pour faire un don transparent.",
      image: null,
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "3. Suivez l'Impact",
      description:
        "Chaque transaction est enregistrée sur la blockchain Hedera pour une transparence totale.",
      image: null,
    },
  ];

  return (
    <section className="py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un processus simple en 3 étapes pour une solidarité transparente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4"
              data-testid={`step-${index}`}
            >
              {step.image ? (
                <div className="w-full max-w-xs aspect-3/4 rounded-lg overflow-hidden bg-muted">
                  <Image
                    width={400}
                    height={533}
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 w-full max-w-xs rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-primary">{step.icon}</div>
                </div>
              )}

              <h3 className="font-display font-semibold text-xl">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
