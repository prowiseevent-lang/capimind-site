import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

// CRITICAL: never index 404 pages. This prevents stale URLs (e.g. old WordPress
// paths) from staying in Google's index after they've been removed from the site.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
  title: 'Page introuvable — CapiMind',
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6">
          <Search className="h-8 w-8 text-white" />
        </div>
        <p className="text-6xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold mb-3">Cette page n'existe pas</h1>
        <p className="text-muted-foreground mb-8">
          La page que vous recherchez a peut-être été déplacée ou supprimée.
          CapiMind est désormais une plateforme e-learning nouvelle génération.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/#courses">Voir nos formations</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
