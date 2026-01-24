"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { formatImageUrl } from "@/lib/strapi";
import { Arguments } from "@/components/sections/Arguments";

// Interface pour les données About depuis Strapi
interface AboutData {
  title?: string;
  subtitle?: string;
  profile_picture?: any;
  bio_content?: any; // Blocks JSON
  values?: Array<{
    title?: string;
    description?: string;
    icon_name?: string;
  }>;
}

interface AboutContentProps {
  aboutData: AboutData | null;
}

// Fonction pour extraire l'URL de l'image de profil
function getProfilePictureUrl(profilePicture: any): string | null {
  if (!profilePicture) {
    return null;
  }

  // Gérer différentes structures Strapi
  if (profilePicture.data?.attributes?.url) {
    return formatImageUrl(profilePicture.data.attributes.url);
  } else if (profilePicture.attributes?.url) {
    return formatImageUrl(profilePicture.attributes.url);
  } else if (profilePicture.url) {
    return formatImageUrl(profilePicture.url);
  }

  return null;
}

// Composant pour rendre le bio_content (Blocks)
// Note: @strapi/blocks-react-renderer ne peut pas être utilisé côté client
// On utilise un parser manuel pour les blocs Strapi
function BioContentRenderer({ content }: { content: any }) {
  if (!content) {
    return null;
  }

  // Si c'est une string, l'afficher directement
  if (typeof content === 'string') {
    return (
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-base text-muted-foreground leading-relaxed">{content}</p>
      </div>
    );
  }

  // Si c'est un tableau de blocs Strapi, les parser
  if (Array.isArray(content)) {
    return (
      <div className="prose dark:prose-invert max-w-none space-y-4">
        {content.map((block: any, index: number) => {
          // Paragraphe
          if (block.type === 'paragraph' && block.children) {
            return (
              <p key={index} className="text-base text-muted-foreground leading-relaxed">
                {block.children.map((child: any, childIndex: number) => {
                  if (child.type === 'text') {
                    return <span key={childIndex}>{child.text}</span>;
                  }
                  // Gérer le texte en gras
                  if (child.type === 'text' && child.bold) {
                    return <strong key={childIndex}>{child.text}</strong>;
                  }
                  return null;
                })}
              </p>
            );
          }
          
          // Titre
          if (block.type === 'heading' && block.level) {
            const HeadingTag = `h${block.level}` as keyof JSX.IntrinsicElements;
            const text = block.children?.map((c: any) => c.text).join('') || '';
            return (
              <HeadingTag key={index} className="font-semibold text-foreground mt-6 mb-4">
                {text}
              </HeadingTag>
            );
          }
          
          // Liste
          if (block.type === 'list' && block.children) {
            const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className="list-disc list-inside space-y-2 text-base text-muted-foreground">
                {block.children.map((item: any, itemIndex: number) => (
                  <li key={itemIndex}>
                    {item.children?.map((child: any, childIndex: number) => 
                      child.type === 'text' ? child.text : ''
                    ).join('')}
                  </li>
                ))}
              </ListTag>
            );
          }
          
          return null;
        })}
      </div>
    );
  }

  return null;
}

export function AboutContent({ aboutData }: AboutContentProps) {
  // Extraire les données avec fallbacks
  const title = aboutData?.title || "L'alliance de la Stratégie Produit et de la Technique.";
  const subtitle = aboutData?.subtitle || "Je suis Jonas, Product Builder. Je comble le fossé entre les développeurs qui ne parlent que code et les consultants qui ne savent pas exécuter.";
  const profilePictureUrl = aboutData?.profile_picture ? getProfilePictureUrl(aboutData.profile_picture) : null;
  const bioContent = aboutData?.bio_content;
  const values = aboutData?.values || [];
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      {/* Hero : Titre et sous-titre */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Badge variant="secondary" className="mb-4">
            Mon parcours
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Section Bio : Grid avec texte à gauche et image à droite */}
      <div className="max-w-5xl mx-auto mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* COLONNE 1 (Gauche) - Le Texte */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {bioContent ? (
              <BioContentRenderer content={bioContent} />
            ) : (
              // Fallback si pas de bio_content
              <div className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  J&apos;ai créé Nexiah après un constat simple : les
                  entrepreneurs perdent trop de temps à gérer des interlocuteurs
                  différents.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Mon approche est hybride : je conçois la stratégie (PM), je
                  construis le produit (Dev), et j&apos;automatise la croissance
                  (Ops). Un seul interlocuteur pour tout le cycle de vie de votre
                  projet.
                </p>
              </div>
            )}
          </motion.div>

          {/* COLONNE 2 (Droite) - L'Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center md:justify-end"
          >
            {profilePictureUrl ? (
              <div className="relative w-full max-w-md aspect-square rounded-2xl shadow-xl overflow-hidden">
                {profilePictureUrl.includes('localhost') ? (
                  <img
                    src={profilePictureUrl}
                    alt="Jonas - Product Builder"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={profilePictureUrl}
                    alt="Jonas - Product Builder"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
            ) : (
              <div className="bg-slate-200 aspect-square w-full max-w-md rounded-2xl" />
            )}
          </motion.div>
        </div>
      </div>

      {/* Section Mes Valeurs - Utiliser le composant Arguments si des valeurs sont renseignées */}
      {values && Array.isArray(values) && values.length > 0 && (
        <div className="mb-24">
          <Arguments
            title_section="Mes Valeurs"
            arguments_list={values}
          />
        </div>
      )}

      {/* CTA de fin */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <p className="text-xl text-foreground mb-6">
          Prêt à travailler avec un partenaire impliqué ?
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Me contacter</Link>
        </Button>
      </motion.div>
    </div>
  );
}
