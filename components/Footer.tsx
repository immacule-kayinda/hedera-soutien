import { Link } from "next/link";
import { Heart, Shield, Eye } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">H</span>
              </div>
              <span className="font-display font-bold text-xl">HandiHelp</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plateforme solidaire connectant personnes handicapées et donateurs avec transparence blockchain.
            </p>
            <div className="flex gap-4 text-muted-foreground">
              <Shield className="h-5 w-5" />
              <Eye className="h-5 w-5" />
              <Heart className="h-5 w-5" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">À propos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-mission">Notre mission</a></li>
              <li><a href="#" className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-team">L'équipe</a></li>
              <li><a href="#" className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-partners">Partenaires</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/transparency"><a className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-footer-transparency">Transparence</a></Link></li>
              <li><a href="#" className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-faq">FAQ</a></li>
              <li><a href="#" className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-accessibility">Accessibilité</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-privacy">Confidentialité</a></li>
              <li><a href="#" className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-terms">Conditions</a></li>
              <li><a href="#" className="hover-elevate inline-block rounded px-1 py-0.5" data-testid="link-wcag">WCAG 2.1 AA</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 HandiHelp. Tous droits réservés. Propulsé par Hedera Hashgraph.</p>
        </div>
      </div>
    </footer>
  );
}
