"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Box, LucideIcon } from "lucide-react";
import { formatImageUrl } from "@/lib/strapi";
import { StrapiMedia } from "@/lib/types/strapi";

// Interface pour un outil dans la liste
interface ToolItem {
  id?: number | string;
  tool_name?: string; // Nom de l'outil (priorité 1)
  name?: string; // Nom de l'outil (priorité 2, compatibilité)
  title?: string; // Nom de l'outil (priorité 3, compatibilité)
  icon_pic?: StrapiMedia; // Media field from Strapi (image uploadée)
  icon_name?: string; // Slug SimpleIcons (ex: "react", "nodedotjs")
  // Support des variantes PascalCase
  ToolName?: string;
  Name?: string;
  Title?: string;
  IconName?: string;
  iconName?: string;
}

// Interface pour les props du composant
interface TechStackProps {
  title_section?: string;
  description_section?: string;
  tools_list?: ToolItem[];
  // Support des anciens noms pour compatibilité
  title?: string;
  description?: string;
}

// Valeurs par défaut
const DEFAULT_TOOLS: Array<{ name: string; icon_name: string }> = [
  { name: "Next.js", icon_name: "nextdotjs" },
  { name: "React", icon_name: "react" },
  { name: "Astro", icon_name: "astro" },
  { name: "Strapi", icon_name: "strapi" },
  { name: "Supabase", icon_name: "supabase" },
  { name: "Make", icon_name: "make" },
  { name: "n8n", icon_name: "n8n" },
  { name: "Airtable", icon_name: "airtable" },
  { name: "Notion", icon_name: "notion" },
  { name: "Coda", icon_name: "coda" },
];

const DEFAULT_TITLE = "Mes outils de prédilection";
const DEFAULT_DESCRIPTION = "J'utilise le meilleur outil en fonction de votre projet.";

// Interface pour un outil préparé avec le nom extrait
interface PreparedTool {
  id: string | number;
  name: string;
  icon_pic?: StrapiMedia;
  icon_name?: string;
}

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
function getSmartIcon(tool: ToolItem): {
  type: 'custom' | 'simpleicons' | 'fallback';
  imageUrl?: string;
  iconComponent?: LucideIcon;
} {
  // Priorité 1 : icon_pic (image custom uploadée)
  const customImageUrl = getIconImageUrl(tool.icon_pic);
  if (customImageUrl) {
    return { type: 'custom', imageUrl: customImageUrl };
  }

  // Priorité 2 : icon_name (slug SimpleIcons)
  if (tool.icon_name && tool.icon_name.trim()) {
    const simpleIconsUrl = `https://cdn.simpleicons.org/${tool.icon_name}`;
    return { type: 'simpleicons', imageUrl: simpleIconsUrl };
  }

  // Fallback : icône Lucide (Box)
  return { type: 'fallback', iconComponent: Box };
}

export function TechStack({ 
  title_section,
  description_section,
  tools_list,
  // Support des anciens noms pour compatibilité
  title,
  description,
}: TechStackProps = {}) {
  // Utiliser les nouveaux noms en priorité, puis les anciens pour compatibilité
  const displayTitle = title_section || title || DEFAULT_TITLE;
  const displayDescription = description_section || description || DEFAULT_DESCRIPTION;
  
  // Préparer la liste des outils
  const tools: PreparedTool[] = tools_list && Array.isArray(tools_list) && tools_list.length > 0
    ? tools_list.map((tool, index) => {
        // Gérer différents noms de champs (tool_name, name, title, etc.)
        const toolName = tool.tool_name || tool.name || tool.title || tool.ToolName || tool.Name || tool.Title || `Tool ${index + 1}`;
        // Générer un ID stable
        const stableId = tool.id || `tool-${toolName.replace(/\s+/g, '-').slice(0, 30)}-${index}`;
        
        return {
          id: stableId,
          name: toolName,
          icon_pic: tool.icon_pic,
          icon_name: tool.icon_name || tool.iconName || tool.IconName,
        };
      })
    : DEFAULT_TOOLS.map((tool, index) => ({
        id: `default-tool-${tool.name.replace(/\s+/g, '-')}-${index}`,
        name: tool.name,
        icon_name: tool.icon_name,
      }));

  // Si tools_list est vide, ne rien afficher
  if (tools.length === 0) {
    return null;
  }

  // Dupliquer la liste pour l'effet infini (juste 2 fois, pas 3)
  const allTools: PreparedTool[] = [...tools, ...tools];

  return (
    <section className="w-full bg-slate-50 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4"
          >
            {displayTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            {displayDescription}
          </motion.p>
        </div>

        {/* Marquee Container avec masque pour fondu élégant */}
        <div 
          className="overflow-hidden w-full relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          {/* Track du slider avec animation */}
          <div 
            className="flex w-max items-center gap-2 md:gap-4 animate-scroll hover:[animation-play-state:paused]"
          >
            {allTools.map((tool, index) => {
              const smartIcon = getSmartIcon(tool);
              const toolName = tool.name || 'Tool';
              // Pour la duplication, ajouter un suffixe unique
              const uniqueKey = `${tool.id}-${Math.floor(index / tools.length)}`;

              return (
                <div
                  key={uniqueKey}
                  className="flex-shrink-0 flex flex-col items-center justify-center group w-24 mx-2"
                >
                  {/* Rendu de l'icône selon le type */}
                  {smartIcon.type === 'custom' && smartIcon.imageUrl ? (
                    // Priorité 1 : Image custom
                    <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center">
                      {smartIcon.imageUrl.includes('localhost') ? (
                        <img
                          src={smartIcon.imageUrl}
                          alt={toolName}
                          className="h-12 w-12 sm:h-14 sm:w-14 object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <Image
                          src={smartIcon.imageUrl}
                          alt={toolName}
                          width={56}
                          height={56}
                          className="h-12 w-12 sm:h-14 sm:w-14 object-contain group-hover:scale-110 transition-transform duration-300"
                          unoptimized
                        />
                      )}
                    </div>
                  ) : smartIcon.type === 'simpleicons' && smartIcon.imageUrl ? (
                    // Priorité 2 : SimpleIcons CDN (couleurs officielles)
                    <img
                      src={smartIcon.imageUrl}
                      alt={toolName}
                      className="h-12 w-12 sm:h-14 sm:w-14 object-contain group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : smartIcon.type === 'fallback' && smartIcon.iconComponent ? (
                    // Fallback : Icône Lucide
                    <smartIcon.iconComponent className="h-12 w-12 sm:h-14 sm:w-14 text-slate-400 group-hover:scale-110 transition-transform duration-300" />
                  ) : null}
                  
                  {/* Nom de l'outil */}
                  <span className="mt-3 text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center whitespace-nowrap">
                    {toolName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
