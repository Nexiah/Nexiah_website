"use client";

import { motion } from "framer-motion";
import { getLucideIcon } from "@/lib/icons";
import { Check } from "lucide-react";

// Interface pour un argument dans la liste répétable
interface ArgumentItem {
  title?: string;
  description?: string;
  icon_name?: string; // Nom de l'icône Lucide (ex: "Shield", "Zap", "Clock")
  // Support des variantes PascalCase
  Title?: string;
  Description?: string;
  IconName?: string;
  Icon?: string;
  icon?: string; // Support de l'ancien nom pour compatibilité
}

// Interface pour les props du composant
interface ArgumentsProps {
  title_section?: string;
  description_section?: string;
  arguments_list?: ArgumentItem[];
  // Support des anciens noms pour compatibilité
  title?: string;
  description?: string;
  arguments?: ArgumentItem[];
}

// Valeurs par défaut
const DEFAULT_TITLE = "Pourquoi choisir Nexiah ?";
const DEFAULT_DESCRIPTION = "Des arguments solides pour vous convaincre.";

export function Arguments({ 
  title_section,
  description_section,
  arguments_list,
  // Support des anciens noms pour compatibilité
  title,
  description,
  arguments: args,
}: ArgumentsProps = {}) {
  // Utiliser les nouveaux noms en priorité, puis les anciens pour compatibilité
  const displayTitle = title_section || title || DEFAULT_TITLE;
  const displayDescription = description_section || description || DEFAULT_DESCRIPTION;
  
  // Préparer la liste des arguments
  const argumentsList = arguments_list || args || [];
  
  // Si la liste est vide, ne rien afficher
  if (!Array.isArray(argumentsList) || argumentsList.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-24 sm:py-32">
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
          {displayDescription && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              {displayDescription}
            </motion.p>
          )}
        </div>

        {/* Grille Modernes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {argumentsList.map((argument, index) => {
            // Extraire les champs (gérer PascalCase et camelCase)
            const argumentTitle = argument.title || argument.Title || `Argument ${index + 1}`;
            const argumentDescription = argument.description || argument.Description || '';
            // Utiliser icon_name en priorité, puis les variantes
            const iconName = argument.icon_name || argument.IconName || argument.icon || argument.Icon;
            // Générer un ID stable : utiliser id Strapi si disponible, sinon combinaison title + icon
            const stableId = argument.id || `argument-${argumentTitle.replace(/\s+/g, '-').slice(0, 30)}-${iconName || index}`;
            
            // Obtenir l'icône Lucide
            const IconComponent = getLucideIcon(iconName, Check);
            
            return (
              <motion.div
                key={stableId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-6 rounded-lg border border-border bg-white hover:shadow-md transition-all duration-300">
                  {/* Conteneur Icône */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  {/* Titre */}
                  <h3 className="font-bold text-lg mt-4 mb-2 text-foreground">
                    {argumentTitle}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {argumentDescription}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
