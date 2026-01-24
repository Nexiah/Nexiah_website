"use client";

import { motion } from "framer-motion";
import { getLucideIcon } from "@/lib/icons";
import { LucideIcon } from "lucide-react";

// Interface pour un step depuis Strapi
interface StepItem {
  title_step?: string;
  description_step?: string;
  icon_name?: string;
  // Support des variantes PascalCase et anciens noms
  TitleStep?: string;
  DescriptionStep?: string;
  IconName?: string;
  iconName?: string;
  // Support des anciens noms pour compatibilité
  title?: string;
  description?: string;
}

interface ProcessProps {
  title_section?: string;
  description_section?: string;
  steps_list?: StepItem[];
  // Support des anciens noms pour compatibilité
  title?: string;
  steps?: StepItem[];
}

// Valeurs par défaut
const DEFAULT_STEPS: Array<{ title: string; description: string }> = [
  {
    title: "Idéation",
    description: "On décortique votre idée et on définit le MVP pour ne pas perdre de temps.",
  },
  {
    title: "Planning & Prototype",
    description: "Validation des maquettes et de la roadmap technique. Rien n'est laissé au hasard.",
  },
  {
    title: "Développement",
    description: "Construction rapide et robuste (Sprint mode). Vous suivez l'avancée en temps réel.",
  },
  {
    title: "Mise en Production",
    description: "Déploiement sécurisé sur serveurs performants. Votre projet est en ligne.",
  },
  {
    title: "Évolution",
    description: "Maintenance et ajouts de fonctionnalités. Votre produit vit et grandit.",
  },
];

const DEFAULT_TITLE = "Un processus clair, étape par étape";
const DEFAULT_DESCRIPTION = "";


export function Process({ 
  title_section,
  description_section,
  steps_list,
  // Support des anciens noms pour compatibilité
  title,
  description,
  steps,
}: ProcessProps = {}) {
  // Utiliser les nouveaux noms en priorité, puis les anciens pour compatibilité
  const displayTitle = title_section || title || DEFAULT_TITLE;
  const displayDescription = description_section || description || DEFAULT_DESCRIPTION;
  
  // Préparer la liste des étapes
  // Debug en développement
  if (process.env.NODE_ENV === 'development') {
    console.log('[Process] Props received:', {
      title_section,
      description_section,
      steps_list,
      steps_list_length: steps_list?.length,
      steps_list_type: typeof steps_list,
      steps_list_isArray: Array.isArray(steps_list),
      title,
      description,
      steps,
      steps_length: steps?.length,
    });
  }
  
  const preparedSteps = steps_list && Array.isArray(steps_list) && steps_list.length > 0
    ? steps_list.map((step, index) => {
        // Extraire les champs (gérer PascalCase et camelCase)
        const stepTitle = step.title_step || step.TitleStep || step.title || DEFAULT_STEPS[index % DEFAULT_STEPS.length]?.title || `Étape ${index + 1}`;
        const stepDescription = step.description_step || step.DescriptionStep || step.description || DEFAULT_STEPS[index % DEFAULT_STEPS.length]?.description || '';
        const iconName = step.icon_name || step.IconName || step.iconName;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Process] Prepared step ${index}:`, {
            step,
            stepTitle,
            stepDescription,
            iconName,
          });
        }
        
        return {
          title: stepTitle,
          description: stepDescription,
          icon_name: iconName,
        };
      })
    : steps && steps.length > 0
    ? steps.map((step, index) => ({
        title: step.title_step || step.TitleStep || step.title || DEFAULT_STEPS[index % DEFAULT_STEPS.length]?.title || `Étape ${index + 1}`,
        description: step.description_step || step.DescriptionStep || step.description || DEFAULT_STEPS[index % DEFAULT_STEPS.length]?.description || '',
        icon_name: step.icon_name || step.IconName || step.iconName,
      }))
    : DEFAULT_STEPS.map((step, index) => ({
        title: step.title,
        description: step.description,
        icon_name: undefined,
      }));

  // Si la liste est vide, cacher la section
  if (preparedSteps.length === 0) {
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

        {/* Mobile: Vertical Timeline (Par défaut) */}
        <div className="relative flex flex-col md:hidden">
          {/* Ligne verticale continue qui passe derrière tous les cercles */}
          <div className="absolute top-7 left-7 bottom-0 w-px bg-border z-0" />
          
          {preparedSteps.map((step, index) => {
            // Logique "Smart Circle" : icône ou numéro
            const IconComponent = step.icon_name ? getLucideIcon(step.icon_name) : null;
            const stepNumber = (index + 1).toString().padStart(2, '0');
            
            return (
              <motion.div
                key={`step-${index}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex flex-row items-start pb-10 last:pb-0 z-10"
              >
                {/* Gauche (Visuel) : Cercle */}
                <div className="relative flex-shrink-0 mr-6">
                  {/* Cercle avec icône */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-background border-2 border-border shadow-sm">
                    {IconComponent ? (
                      <IconComponent className="h-6 w-6 text-primary" />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {stepNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Droite (Contenu) : Numéro, Titre et Description */}
                <div className="flex-1 pt-1">
                  {/* Numéro dans un cercle - Mobile */}
                  <div className="mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold shrink-0">
                      {stepNumber}
                    </div>
                  </div>
                  
                  {/* Titre */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: Horizontal Timeline (md: et plus) */}
        <div className="hidden md:flex md:flex-row md:items-start md:justify-between relative w-full gap-4">
          {/* Ligne horizontale continue qui passe derrière tous les cercles */}
          <div className="absolute top-7 left-0 right-0 h-px bg-border z-0" />
          
          {preparedSteps.map((step, index) => {
            // Logique "Smart Circle" : icône ou numéro
            const IconComponent = step.icon_name ? getLucideIcon(step.icon_name) : null;
            const stepNumber = (index + 1).toString().padStart(2, '0');
            
            return (
              <motion.div
                key={`step-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center flex-1 z-10"
              >
                {/* Haut (Visuel) : Cercle */}
                <div className="relative w-full flex items-center justify-center mb-4">
                  {/* Cercle avec icône */}
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-background border-2 border-border shadow-sm">
                    {IconComponent ? (
                      <IconComponent className="h-6 w-6 text-primary" />
                    ) : (
                      <span className="text-sm font-bold text-primary">
                        {stepNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Milieu : Le Numéro dans un cercle - Desktop */}
                <div className="my-3 mx-auto">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold shrink-0">
                    {stepNumber}
                  </div>
                </div>

                {/* Bas : Titre et Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
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
