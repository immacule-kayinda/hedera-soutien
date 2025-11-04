"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, User, Wallet, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1 -ml-2 cursor-pointer">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">
                  H
                </span>
              </div>
              <span className="font-display font-bold text-xl">HandiHelp</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/assistance" data-testid="link-assistance">
              <div className="hover-elevate active-elevate-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                Demandes d&apos;aide
              </div>
            </Link>
            <Link href="/transparency" data-testid="link-transparency">
              <div className="hover-elevate active-elevate-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                Transparence
              </div>
            </Link>
            <Link href="/nft-wallet" data-testid="link-nft">
              <div className="hover-elevate active-elevate-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                Mes NFT
              </div>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && user?.role === "donor" && (
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                data-testid="button-wallet"
              >
                <Wallet className="h-5 w-5" />
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex gap-2"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span>{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="menu-profile">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" data-testid="button-login">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register">
                  <Button data-testid="button-register">S&apos;inscrire</Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden border-t py-4 space-y-2"
            data-testid="mobile-menu"
          >
            <Link href="/assistance" data-testid="link-mobile-assistance">
              <div className="block hover-elevate active-elevate-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                Demandes d&apos;aide
              </div>
            </Link>
            <Link href="/transparency" data-testid="link-mobile-transparency">
              <div className="block hover-elevate active-elevate-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                Transparence
              </div>
            </Link>
            <Link href="/nft-wallet" data-testid="link-mobile-nft">
              <div className="block hover-elevate active-elevate-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer">
                Mes NFT
              </div>
            </Link>
            <div className="pt-2 space-y-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  data-testid="button-mobile-login"
                >
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full" data-testid="button-mobile-register">
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
