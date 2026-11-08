import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Événement Ciel — Animations pour EHPAD, résidences, collectivités et entreprises',
    template: '%s — Événement Ciel',
  },
  description:
    "Depuis 16 ans, Événement Ciel propose des ateliers et animations créatives pour les EHPAD, résidences autonomie, mairies et entreprises. Demandez un atelier en ligne, réponse sous 48 h.",
  openGraph: { siteName: 'Événement Ciel', locale: 'fr_FR', type: 'website' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="fr" className="h-full">
      <body className="flex min-h-full flex-col">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-bouton focus:bg-white focus:p-3">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" className="grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
