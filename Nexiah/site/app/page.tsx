import { NavbarServer } from "@/components/sections/NavbarServer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack";
import { FeaturedWorkServer } from "@/components/sections/FeaturedWorkServer";
import { Trust } from "@/components/sections/Trust";
import { Arguments } from "@/components/sections/Arguments";
import { Footer } from "@/components/layout/Footer";
import { getHomePage } from "@/lib/strapi";

import { StrapiContentSection } from "@/lib/types/strapi";

// Interface pour les sections de la Dynamic Zone
interface ContentSection extends StrapiContentSection {
  __component: string;
  id?: number;
}

// Fonction pour rendre une section selon son type
function renderSection(section: ContentSection, index: number) {
  const componentType = section.__component;

  switch (componentType) {
    case "section.hero":
      // Gérer les différents formats de champs (PascalCase vs camelCase)
      const heroTitle = section.title || section.Title || '';
      const heroSubtitle = section.subtitle || section.Subtitle || '';
      const heroCta = section.cta_text || section.ctaText || section.CtaText || section.CTA_text || '';
      
      
      // Générer un ID stable pour la key
      const heroKey = section.id || `hero-${heroTitle.slice(0, 20).replace(/\s+/g, '-')}-${index}`;
      
      return (
        <Hero
          key={heroKey}
          title={heroTitle}
          subtitle={heroSubtitle}
          cta_text={heroCta}
        />
      );

    case "section.expertise":
      // Structure figée : title_section, description_section, expertises_list
      // Gérer les différents formats de champs (PascalCase vs camelCase)
      const expertiseTitle = section.title_section || section.TitleSection || '';
      const expertiseDescription = section.description_section || section.DescriptionSection || '';
      
      // Récupérer expertises_list (tableau répétable) - essayer plusieurs variantes
      // Peut-être que c'est expertise_list (singulier) comme pour step_list
      let expertisesList = 
        section.expertise_list || 
        section.ExpertiseList || 
        section.expertises_list || 
        section.ExpertisesList || 
        section.expertises || 
        section.Expertises || 
        section.expertise_list?.data ||
        section.ExpertiseList?.data ||
        section.expertises_list?.data ||
        section.ExpertisesList?.data ||
        [];
      
      // Si expertisesList est un objet avec une propriété data
      if (expertisesList && typeof expertisesList === 'object' && !Array.isArray(expertisesList) && expertisesList.data) {
        expertisesList = Array.isArray(expertisesList.data) ? expertisesList.data : [];
      }
      
      // S'assurer que c'est un tableau
      if (!Array.isArray(expertisesList)) {
        expertisesList = [];
      }
      
      // Générer un ID stable pour la key
      const expertiseKey = section.id || `expertise-${expertiseTitle.slice(0, 20).replace(/\s+/g, '-')}-${index}`;
      
      return (
        <Services
          key={expertiseKey}
          title_section={expertiseTitle}
          description_section={expertiseDescription}
          expertises_list={expertisesList}
        />
      );

    case "section.step":
      // Structure : title_section, description_section, steps_list (tableau répétable)
      // Gérer les différents formats de champs (PascalCase vs camelCase)
      const stepTitle = section.title_section || section.TitleSection || section.title || section.Title || '';
      const stepDescription = section.description_section || section.DescriptionSection || section.description || section.Description || '';
      
      // Récupérer step_list (tableau répétable) - essayer plusieurs variantes
      // Dans Strapi, les composants répétables peuvent avoir différents noms
      // L'utilisateur utilise step_list (singulier)
      let stepsList = 
        section.step_list || 
        section.StepList || 
        section.steps_list || 
        section.StepsList || 
        section.steps || 
        section.Steps || 
        section.step_list?.data || // Si c'est dans un objet data
        section.StepList?.data ||
        section.steps_list?.data ||
        [];
      
      // Si stepsList est un objet avec une propriété data
      if (stepsList && typeof stepsList === 'object' && !Array.isArray(stepsList) && stepsList.data) {
        stepsList = Array.isArray(stepsList.data) ? stepsList.data : [];
      }
      
      // Fallback sur l'ancien format section.step pour compatibilité
      if (!Array.isArray(stepsList) || stepsList.length === 0) {
        const stepItems = section.step
          ? (Array.isArray(section.step) ? section.step : [section.step])
          : [];
        if (stepItems.length > 0) {
          stepsList = stepItems;
        }
      }
      
      // S'assurer que c'est un tableau
      if (!Array.isArray(stepsList)) {
        stepsList = [];
      }
      
      // Générer un ID stable pour la key
      const stepKey = section.id || `step-${stepTitle.slice(0, 20).replace(/\s+/g, '-')}-${index}`;
      
      return (
        <Process
          key={stepKey}
          title_section={stepTitle}
          description_section={stepDescription}
          steps_list={stepsList}
          // Support des anciens noms pour compatibilité
          title={section.title}
          steps={section.step ? (Array.isArray(section.step) ? section.step : [section.step]) : []}
        />
      );

    case "section.argument":
      // Structure : title_section, description_section, arguments_list (tableau répétable)
      // Gérer les différents formats de champs (PascalCase vs camelCase)
      const argumentTitle = section.title_section || section.TitleSection || section.title || section.Title || '';
      
      // Gérer description_section qui peut être une string, un objet (Rich Text), ou null
      let argumentDescription = '';
      
      // Si description_section existe et n'est pas null
      if (section.description_section !== null && section.description_section !== undefined) {
        // Si c'est une string, l'utiliser directement
        if (typeof section.description_section === 'string') {
          argumentDescription = section.description_section.trim();
        }
        // Si c'est un objet (Rich Text Strapi), essayer d'extraire le texte
        else if (typeof section.description_section === 'object') {
          // Essayer différentes structures possibles pour Rich Text
          argumentDescription = section.description_section.text || 
                               section.description_section.content || 
                               section.description_section.value || 
                               (Array.isArray(section.description_section) ? section.description_section.join(' ') : '') ||
                               '';
        }
      }
      
      // Fallback sur les autres variantes si description_section est null ou vide
      if (!argumentDescription) {
        argumentDescription = section.DescriptionSection || section.description || section.Description || '';
        // Si c'est aussi un objet, essayer d'extraire le texte
        if (argumentDescription && typeof argumentDescription === 'object' && argumentDescription !== null) {
          argumentDescription = argumentDescription.text || 
                               argumentDescription.content || 
                               argumentDescription.value || 
                               '';
        }
      }
      
      // Récupérer arguments_list (tableau répétable) - essayer plusieurs variantes
      let argumentsList = 
        section.arguments_list || 
        section.ArgumentsList || 
        section.argument_list || 
        section.ArgumentList || 
        section.arguments || 
        section.Arguments || 
        section.arguments_list?.data ||
        section.ArgumentsList?.data ||
        [];
      
      // Si argumentsList est un objet avec une propriété data
      if (argumentsList && typeof argumentsList === 'object' && !Array.isArray(argumentsList) && argumentsList.data) {
        argumentsList = Array.isArray(argumentsList.data) ? argumentsList.data : [];
      }
      
      // Fallback sur l'ancien format section.argument pour compatibilité
      if (!Array.isArray(argumentsList) || argumentsList.length === 0) {
        const argumentItems = section.argument
          ? (Array.isArray(section.argument) ? section.argument : [section.argument])
          : [];
        if (argumentItems.length > 0) {
          argumentsList = argumentItems;
        }
      }
      
      // S'assurer que c'est un tableau
      if (!Array.isArray(argumentsList)) {
        argumentsList = [];
      }
      
      // Générer un ID stable pour la key
      const argumentKey = section.id || `argument-${argumentTitle.slice(0, 20).replace(/\s+/g, '-')}-${index}`;
      
      return (
        <Arguments
          key={argumentKey}
          title_section={argumentTitle}
          description_section={argumentDescription}
          arguments_list={argumentsList}
          // Support des anciens noms pour compatibilité
          title={section.title}
          description={section.description}
          arguments={section.argument ? (Array.isArray(section.argument) ? section.argument : [section.argument]) : []}
        />
      );

    case "section.tool":
    case "section.tools":
      // Structure : title_section, description_section, tools_list (tableau répétable)
      // Gérer les différents formats de champs (PascalCase vs camelCase)
      const toolTitle = section.title_section || section.TitleSection || section.title || section.Title || '';
      const toolDescription = section.description_section || section.DescriptionSection || section.description || section.Description || '';
      
      // Récupérer tools_list (tableau répétable)
      let toolsList = section.tools_list || section.ToolsList || [];
      
      // S'assurer que c'est un tableau
      if (!Array.isArray(toolsList)) {
        toolsList = [];
      }
      
      // Générer un ID stable pour la key
      const toolKey = section.id || `tool-${toolTitle.slice(0, 20).replace(/\s+/g, '-')}-${index}`;
      
      return (
        <TechStack
          key={toolKey}
          title_section={toolTitle}
          description_section={toolDescription}
          tools_list={toolsList}
          // Support des anciens noms pour compatibilité
          title={section.title}
          description={section.description}
        />
      );

    default:
      // Si le composant n'est pas reconnu, ne rien afficher
      return null;
  }
}

export default async function Home() {
  // Récupérer les données de la homepage depuis Strapi
  let homepageData: { content_sections?: ContentSection[] } | null = null;
  
  try {
    homepageData = await getHomePage();
  } catch (error) {
    // Erreur silencieuse, utiliser fallback
  }

  // Extraire les sections de la Dynamic Zone
  const contentSections = homepageData?.content_sections || [];

  // Si aucune section n'est trouvée, utiliser les sections par défaut (fallback)
  const useFallback = contentSections.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="h-16"></div>
      <NavbarServer />
      <main>
        {useFallback ? (
          // Fallback : afficher les sections statiques
          <>
            <Hero />
            <Services />
            <Process />
            <TechStack />
            <FeaturedWorkServer />
            <Trust />
          </>
        ) : (
          // Rendu dynamique depuis Strapi
          <>
            {contentSections.map((section, index) => renderSection(section, index))}
            {/* FeaturedWork est toujours affiché car il n'est pas dans la Dynamic Zone */}
            <FeaturedWorkServer />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}