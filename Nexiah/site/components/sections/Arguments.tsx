"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
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

// Fonction helper pour convertir une string en PascalCase
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// Fonction pour obtenir une icône Lucide depuis son nom (string)
function getLucideIcon(iconName: string | undefined | null): LucideIcon {
  if (!iconName || !iconName.trim()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Arguments] getLucideIcon: iconName is empty or invalid');
    }
    return Check; // Icône par défaut
  }

  const cleanName = iconName.trim();
  const pascalName = toPascalCase(cleanName);
  
  // Variantes à essayer (incluant les noms avec tirets convertis en PascalCase)
  const variants = [
    pascalName, // "lock-keyhole" -> "LockKeyhole"
    cleanName, // "lock-keyhole" tel quel
    `${pascalName}Icon`, // "LockKeyholeIcon"
    `${cleanName}Icon`, // "lock-keyholeIcon"
    cleanName.toUpperCase(), // "LOCK-KEYHOLE"
    // Essayer aussi sans les tirets
    cleanName.replace(/[-_]/g, ''), // "lockkeyhole"
    toPascalCase(cleanName.replace(/[-_]/g, '')), // "Lockkeyhole"
  ];

  // Recherche dans les exports de lucide-react
  for (const variant of variants) {
    if (variant in LucideIcons) {
      const IconComponent = (LucideIcons as any)[variant];
      if (typeof IconComponent === 'function') {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Arguments] getLucideIcon: Found icon "${variant}" for "${iconName}"`);
        }
        return IconComponent as LucideIcon;
      }
    }
  }

  // Recherche insensible à la casse dans tous les exports
  const iconKeys = Object.keys(LucideIcons);
  const lowerCleanName = cleanName.toLowerCase();
  const foundKey = iconKeys.find(key => {
    const lowerKey = key.toLowerCase();
    // Chercher avec ou sans tirets, avec ou sans "icon"
    return lowerKey === lowerCleanName ||
           lowerKey === `${lowerCleanName}icon` ||
           lowerKey === lowerCleanName.replace(/[-_]/g, '') ||
           lowerKey === `${lowerCleanName.replace(/[-_]/g, '')}icon`;
  });

  if (foundKey) {
    const IconComponent = (LucideIcons as any)[foundKey];
    if (typeof IconComponent === 'function') {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Arguments] getLucideIcon: Found icon "${foundKey}" (case-insensitive) for "${iconName}"`);
      }
      return IconComponent as LucideIcon;
    }
  }

  // Mapping manuel pour quelques icônes courantes (incluant les noms avec tirets)
  const manualMapping: Record<string, LucideIcon> = {
    'shield': LucideIcons.Shield as LucideIcon,
    'zap': LucideIcons.Zap as LucideIcon,
    'globe': LucideIcons.Globe as LucideIcon,
    'check': LucideIcons.Check as LucideIcon,
    'star': LucideIcons.Star as LucideIcon,
    'rocket': LucideIcons.Rocket as LucideIcon,
    'lock': LucideIcons.Lock as LucideIcon,
    'lockkeyhole': LucideIcons.LockKeyhole as LucideIcon,
    'lock-keyhole': LucideIcons.LockKeyhole as LucideIcon,
    'clock': LucideIcons.Clock as LucideIcon,
    'calendar': LucideIcons.Calendar as LucideIcon,
    'calendarcheck': LucideIcons.CalendarCheck as LucideIcon,
    'calendar-check': LucideIcons.CalendarCheck as LucideIcon,
    'briefcase': LucideIcons.Briefcase as LucideIcon,
  };

  // Essayer avec le nom nettoyé (sans caractères spéciaux)
  const manualKey = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (manualMapping[manualKey]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Arguments] getLucideIcon: Found icon via manual mapping "${manualKey}" for "${iconName}"`);
    }
    return manualMapping[manualKey];
  }
  
  // Essayer aussi avec le nom original (avec tirets)
  if (manualMapping[cleanName.toLowerCase()]) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Arguments] getLucideIcon: Found icon via manual mapping (with dashes) for "${iconName}"`);
    }
    return manualMapping[cleanName.toLowerCase()];
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Arguments] getLucideIcon: Icon "${iconName}" not found. Tried variants:`, variants);
  }

  return Check;
}

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
  
  // Debug en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('[Arguments] Props received:', {
      title_section,
      description_section,
      arguments_list,
      argumentsList,
      argumentsListLength: argumentsList.length,
    });
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
            
            // Obtenir l'icône Lucide
            const IconComponent = getLucideIcon(iconName, Check);
            
            return (
              <motion.div
                key={`argument-${index}-${argumentTitle}`}
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
