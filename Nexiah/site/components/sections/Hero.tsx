"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  cta_text?: string;
}

// Valeurs par défaut
const DEFAULT_TITLE = "Je construis votre <span class=\"text-primary\">Application Web</span> et j'automatise votre <span class=\"text-primary\">Business</span>.";
const DEFAULT_SUBTITLE = "Plus qu'un développeur. Je transforme votre vision en outils performants (Web & Mobile) et je connecte vos logiciels pour supprimer vos tâches manuelles.";
const DEFAULT_CTA = "Discuter de votre projet";

export function Hero({ title, subtitle, cta_text }: HeroProps = {}) {
  // Debug en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('[Hero] Props received:', { title, subtitle, cta_text });
  }

  // Utiliser les valeurs par défaut si non fournies
  const displayTitle = title || DEFAULT_TITLE;
  const displaySubtitle = subtitle || DEFAULT_SUBTITLE;
  const displayCta = cta_text || DEFAULT_CTA;

  // Debug en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('[Hero] Display values:', { displayTitle, displaySubtitle, displayCta });
  }

  // Parser le titre pour extraire les spans avec text-primary
  const parseTitle = (titleText: string): React.ReactNode => {
    // Si le titre est vide ou null, retourner le titre par défaut
    if (!titleText || titleText.trim() === '') {
      titleText = DEFAULT_TITLE;
    }

    // Nettoyer le titre (enlever les espaces en fin)
    titleText = titleText.trim();

    // Nettoyer le titre (enlever les espaces en fin)
    titleText = titleText.trim();

    // Si le titre contient des balises HTML, les parser
    if (titleText.includes('<span')) {
      const parts = titleText.split(/(<span[^>]*>.*?<\/span>)/g);
      return parts.map((part, index) => {
        if (part.startsWith('<span')) {
          const match = part.match(/<span[^>]*>(.*?)<\/span>/);
          if (match) {
            return (
              <span key={index} className="text-primary">
                {match[1]}
              </span>
            );
          }
        }
        // Ne pas afficher les parties vides
        if (part.trim() === '') {
          return null;
        }
        return <span key={index}>{part}</span>;
      }).filter(Boolean);
    }
    
    // Sinon, afficher le titre tel quel (texte simple)
    // Optionnel : chercher les mots clés à mettre en primary
    const words = titleText.split(' ').filter(word => word.length > 0);
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '');
      if (cleanWord === 'Application' || cleanWord === 'Web' || cleanWord === 'Business') {
        return (
          <span key={index} className="text-primary">
            {word}{index < words.length - 1 ? ' ' : ''}
          </span>
        );
      }
      return <span key={index}>{word}{index < words.length - 1 ? ' ' : ''}</span>;
    });
  };

  // Rendu du titre
  const renderedTitle = parseTitle(displayTitle);
  
  // Debug en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('[Hero] Rendered title:', renderedTitle);
    console.log('[Hero] Rendered title type:', typeof renderedTitle);
    console.log('[Hero] Rendered title is array:', Array.isArray(renderedTitle));
  }

  return (
    <section className="relative w-full bg-white py-24 sm:py-32 lg:py-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {renderedTitle || displayTitle}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl max-w-2xl mx-auto"
          >
            {displaySubtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-4 flex-wrap"
          >
            <Button size="lg" asChild>
              <Link href="/contact">
                {displayCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/work">Voir mes réalisations</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
