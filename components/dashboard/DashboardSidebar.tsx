"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers3, LayoutDashboard, Ticket, Wallet } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  roles?: Array<"BENEFICIARY" | "DONOR">;
}

const links: SidebarLink[] = [
  {
    href: "/dashboard",
    label: "Vue d'ensemble",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/requests",
    label: "Mes demandes",
    icon: Ticket,
    roles: ["BENEFICIARY"],
  },
  {
    href: "/dashboard/contributions",
    label: "Mes contributions",
    icon: Layers3,
    roles: ["DONOR"],
  },
  {
    href: "/nft-wallet",
    label: "Wallet & NFT",
    icon: Wallet,
    roles: ["DONOR"],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="bg-background border rounded-2xl p-6 space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Bienvenue</p>
        <h2 className="text-xl font-semibold">{user?.name ?? "Utilisateur"}</h2>
        <p className="text-sm text-muted-foreground capitalize">
          {user?.role === "BENEFICIARY" ? "Bénéficiaire" : user?.role === "DONOR" ? "Donateur" : "Profil"}
        </p>
      </div>

      <nav className="space-y-1">
        {links
          .filter((link) => !link.roles || link.roles.includes(user?.role ?? "BENEFICIARY"))
          .map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted"
                )}
                data-testid={`dashboard-nav-${link.label}`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}