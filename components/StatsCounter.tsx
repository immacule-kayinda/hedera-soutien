"use client";

import { TrendingUp, Users, Heart, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface Stat {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export default function StatsCounter() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const stats: Stat[] = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      value: 1247,
      label: "Dons tracés",
      suffix: " ℏ",
    },
    {
      icon: <Users className="h-8 w-8" />,
      value: 342,
      label: "Personnes aidées",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      value: 856,
      label: "Donateurs actifs",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      value: 100,
      label: "Transparence",
      suffix: "%",
    },
  ];

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-2"
              data-testid={`stat-${index}`}
            >
              <div className="flex justify-center text-primary mb-3">
                {stat.icon}
              </div>
              <div className="font-display font-bold text-4xl lg:text-5xl">
                {stat.prefix}
                {animated ? stat.value.toLocaleString() : 0}
                {stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
