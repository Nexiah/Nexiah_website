"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatImageUrl } from "@/lib/strapi";
import { getLucideIcon } from "@/lib/icons";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { Layers } from "lucide-react";

import { StrapiMedia } from "@/lib/types/strapi";

// Interface pour un élément d'expertise dans la liste répétable
interface ExpertiseItem {
  id?: number | string;
  title_expertise?: string;
  description_expertise?: string;
  icon_pic?: StrapiMedia; // Media field from Strapi (image uploadée)
  icon_name?: string; // Nom de l'icône Lucide (texte)
}

// Interface pour les props du composant
interface ServicesProps {
  title_section?: string;
  description_section?: string;
  expertises_list?: ExpertiseItem[];
}

// Valeurs par défaut
const DEFAULT_TITLE = "Une expertise globale, disponible à la carte.";
const DEFAULT_DESCRIPTION = "Intervention ciblée ou projet complet : je m'adapte à vos besoins.";

// Fonction pour extraire l'URL d'une image depuis le champ icon_pic (média Strapi)
function getIconImageUrl(iconPic: StrapiMedia | null | undefined): string | null {
  if (!iconPic) {
    return null;
  }

  // Gérer différentes structures Strapi
  if (iconPic.data?.attributes?.url) {
    return formatImageUrl(iconPic.data.attributes.url);
  } else if (iconPic.attributes?.url) {
    return formatImageUrl(iconPic.attributes.url);
  } else if (iconPic.url) {
    return formatImageUrl(iconPic.url);
  }

  return null;
}

// Fonction "Smart Icon" : détermine quelle icône afficher selon la priorité
function getSmartIcon(expertise: ExpertiseItem): {
  type: 'image' | 'lucide' | 'default';
  imageUrl?: string;
  iconComponent?: LucideIcon;
} {
  // Priorité 1 : icon_pic (image uploadée)
  const imageUrl = getIconImageUrl(expertise.icon_pic);
  if (imageUrl) {
    return { type: 'image', imageUrl };
  }

  // Priorité 2 : icon_name (nom de l'icône Lucide)
  if (expertise.icon_name && expertise.icon_name.trim()) {
    const iconComponent = getLucideIcon(expertise.icon_name);
    return { type: 'lucide', iconComponent };
  }

  // Fallback : icône par défaut
  return { type: 'default', iconComponent: Layers };
}

export function Services({ 
  title_section, 
  description_section, 
  expertises_list,
}: ServicesProps = {}) {
  // Utiliser les valeurs par défaut si non fournies
  const displayTitle = title_section || DEFAULT_TITLE;
  const displayDescription = description_section || DEFAULT_DESCRIPTION;
  
  // Gérer le cas où expertises_list est vide ou undefined
  const expertises = expertises_list && Array.isArray(expertises_list) && expertises_list.length > 0
    ? expertises_list
    : [];
  return (
    <section id="services" className="w-full bg-slate-50 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {displayTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            {displayDescription}
          </motion.p>
        </div>

        {/* Afficher la grille seulement si expertises_list n'est pas vide */}
        {expertises.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-3">
            {expertises.map((expertise, index) => {
              const smartIcon = getSmartIcon(expertise);
              const title = expertise.title_expertise || '';
              const description = expertise.description_expertise || '';
              // Générer un ID stable : utiliser id Strapi si disponible, sinon combinaison title + index
              const stableId = expertise.id || `expertise-${title.replace(/\s+/g, '-').slice(0, 30)}-${index}`;

              return (
                <motion.div
                  key={stableId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full border border-border bg-white hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        {smartIcon.type === 'image' && smartIcon.imageUrl ? (
                          <div className="relative h-6 w-6">
                            {smartIcon.imageUrl.includes('localhost') ? (
                              <img
                                src={smartIcon.imageUrl}
                                alt={title || 'Expertise'}
                                className="h-6 w-6 object-contain"
                              />
                            ) : (
                              <Image
                                src={smartIcon.imageUrl}
                                alt={title || 'Expertise'}
                                width={24}
                                height={24}
                                className="h-6 w-6 object-contain"
                                unoptimized
                              />
                            )}
                          </div>
                        ) : smartIcon.type === 'lucide' && smartIcon.iconComponent ? (
                          <smartIcon.iconComponent className="h-6 w-6 text-primary" />
                        ) : smartIcon.type === 'default' && smartIcon.iconComponent ? (
                          <smartIcon.iconComponent className="h-6 w-6 text-primary" />
                        ) : null}
                      </div>
                      <CardTitle className="text-xl">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground prose-sm">
                        {description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          // Message si la liste est vide (optionnel, peut être retiré si on préfère ne rien afficher)
          <div className="text-center text-muted-foreground py-8">
            <p>Aucune expertise disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
