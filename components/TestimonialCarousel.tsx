import TestimonialCard from "./TestimonialCard";

export default function TestimonialCarousel() {
  const testimonials = [
    {
      name: "Othezzy Manseya",
      role: "Bénéficiaire",
      image: "/Beneficiary_testimonial_portrait_one_659df044.png",
      testimonial:
        "Grâce à HandiHelp, j'ai pu obtenir l'équipement dont j'avais besoin. La transparence de la blockchain m'a donné confiance dans le processus.",
      verified: true,
      badgeLevel: "Aide reçue: 450 ℏ",
    },
    {
      name: "Gédéon Tshilanda",
      role: "Donateur",
      image: "/Donor_testimonial_portrait_two_99768f64.png",
      testimonial:
        "Enfin une plateforme où je peux voir exactement où va mon don. Les NFT badges sont une belle reconnaissance de mon engagement.",
      verified: true,
      badgeLevel: "Badge Or",
    },
    {
      name: "Vinny Boase",
      role: "Bénéficiaire",
      testimonial:
        "L'accessibilité de la plateforme est exceptionnelle. Même avec mon handicap visuel, je peux naviguer facilement.",
      verified: true,
      badgeLevel: "Aide reçue: 320 ℏ",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
            Témoignages Vérifiés
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez l&apos;impact réel de HandiHelp à travers les histoires de
            notre communauté
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
