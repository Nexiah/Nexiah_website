import { NavbarServer } from "@/components/sections/NavbarServer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Trust } from "@/components/sections/Trust";
import { Arguments } from "@/components/sections/Arguments";
import { Footer } from "@/components/layout/Footer";
import { getHomePage } from "@/lib/strapi";

// Interface pour les sections de la Dynamic Zone
interface ContentSection {
  __component: string;
  id?: number;
  [key: string]: any;
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
      
      
      return (
        <Hero
          key={section.id || `hero-${index}`}
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
      
      // Debug en développement - log complet de la section
      if (process.env.NODE_ENV === 'development') {
        // Créer un objet avec toutes les clés et leurs valeurs pour debug
        const sectionDebug: Record<string, any> = {};
        Object.keys(section).forEach(key => {
          const value = section[key];
          sectionDebug[key] = {
            type: typeof value,
            isArray: Array.isArray(value),
            length: Array.isArray(value) ? value.length : undefined,
            value: Array.isArray(value) && value.length > 0 
              ? `[Array with ${value.length} items]` 
              : value,
          };
        });
        
        console.log('[HomePage] Expertise section data (FULL):', { 
          section,
          sectionKeys: Object.keys(section),
          sectionDebug,
          expertiseTitle, 
          expertiseDescription,
          expertisesList,
          expertisesListLength: expertisesList.length,
          // Tester tous les champs possibles
          expertise_list: section.expertise_list,
          ExpertiseList: section.ExpertiseList,
          expertises_list: section.expertises_list,
          ExpertisesList: section.ExpertisesList,
          expertises: section.expertises,
          Expertises: section.Expertises,
        });
        // Log détaillé de chaque expertise pour voir les champs icon_name
        if (expertisesList.length > 0) {
          expertisesList.forEach((exp, idx) => {
            console.log(`[HomePage] Expertise ${idx}:`, {
              title_expertise: exp.title_expertise,
              TitleExpertise: exp.TitleExpertise,
              description_expertise: exp.description_expertise,
              DescriptionExpertise: exp.DescriptionExpertise,
              icon_name: exp.icon_name,
              IconName: exp.IconName,
              icon_pic: exp.icon_pic,
              IconPic: exp.IconPic,
              fullItem: exp,
              allKeys: Object.keys(exp)
            });
          });
        } else {
          console.warn('[HomePage] Expertise section: expertisesList is empty!');
        }
      }
      
      return (
        <Services
          key={section.id || `expertise-${index}`}
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
      
      // Essayer aussi de chercher dans tous les champs qui contiennent "step" ou "list"
      if ((!Array.isArray(stepsList) || stepsList.length === 0) && process.env.NODE_ENV === 'development') {
        const possibleFields = Object.keys(section).filter(key => 
          key.toLowerCase().includes('step') || 
          key.toLowerCase().includes('list') ||
          key.toLowerCase().includes('item')
        );
        if (possibleFields.length > 0) {
          console.log('[HomePage] Step section: Found possible fields:', possibleFields);
          possibleFields.forEach(field => {
            const value = section[field];
            console.log(`[HomePage] Step section: Field "${field}":`, {
              type: typeof value,
              isArray: Array.isArray(value),
              length: Array.isArray(value) ? value.length : undefined,
              value: Array.isArray(value) && value.length > 0 ? value[0] : value,
            });
          });
        }
      }
      
      // S'assurer que c'est un tableau
      if (!Array.isArray(stepsList)) {
        stepsList = [];
      }
      
      // Debug en développement - log complet de la section pour voir tous les champs disponibles
      if (process.env.NODE_ENV === 'development') {
        // Créer un objet avec toutes les clés et leurs valeurs pour debug
        const sectionDebug: Record<string, any> = {};
        Object.keys(section).forEach(key => {
          const value = section[key];
          sectionDebug[key] = {
            type: typeof value,
            isArray: Array.isArray(value),
            length: Array.isArray(value) ? value.length : undefined,
            value: Array.isArray(value) && value.length > 0 
              ? `[Array with ${value.length} items]` 
              : value,
          };
        });
        
        console.log('[HomePage] Step section data (FULL):', { 
          section,
          sectionKeys: Object.keys(section),
          sectionDebug,
          stepTitle, 
          stepDescription,
          stepsList,
          stepsListLength: stepsList.length,
          componentType,
          // Tester tous les champs possibles
          steps_list: section.steps_list,
          StepsList: section.StepsList,
          steps: section.steps,
          Steps: section.Steps,
          step: section.step,
        });
        // Log détaillé de chaque step pour voir les champs disponibles
        if (stepsList.length > 0) {
          stepsList.forEach((step, idx) => {
            console.log(`[HomePage] Step ${idx}:`, {
              step,
              stepKeys: Object.keys(step),
              title_step: step.title_step,
              TitleStep: step.TitleStep,
              description_step: step.description_step,
              DescriptionStep: step.DescriptionStep,
              icon_name: step.icon_name,
              IconName: step.IconName,
              // Anciens noms
              title: step.title,
              description: step.description,
            });
          });
        } else {
          console.warn('[HomePage] Step section: stepsList is empty!');
        }
      }
      
      return (
        <Process
          key={section.id || `step-${index}`}
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
      
      // Debug en développement - voir tous les champs disponibles
      if (process.env.NODE_ENV === 'development') {
        const sectionDebug: Record<string, any> = {};
        Object.keys(section).forEach(key => {
          const value = section[key];
          sectionDebug[key] = {
            type: typeof value,
            isArray: Array.isArray(value),
            value: typeof value === 'string' ? value : (Array.isArray(value) ? `[Array with ${value.length} items]` : value),
          };
        });
        console.log('[HomePage] Argument section - All fields:', {
          sectionKeys: Object.keys(section),
          sectionDebug,
          argumentTitle,
          argumentDescription,
          // Tester tous les champs possibles
          title_section: section.title_section,
          TitleSection: section.TitleSection,
          description_section: section.description_section,
          description_section_type: typeof section.description_section,
          description_section_isNull: section.description_section === null,
          description_section_value: section.description_section,
          DescriptionSection: section.DescriptionSection,
          title: section.title,
          description: section.description,
        });
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
      
      // Debug en développement
      if (process.env.NODE_ENV === 'development') {
        console.log('[HomePage] Argument section data:', { 
          section, 
          argumentTitle, 
          argumentDescription,
          argumentsList,
          argumentsListLength: argumentsList.length,
          componentType
        });
        // Log détaillé de chaque argument pour voir les champs disponibles
        if (argumentsList.length > 0) {
          argumentsList.forEach((arg, idx) => {
            console.log(`[HomePage] Argument ${idx}:`, {
              arg,
              title: arg.title,
              Title: arg.Title,
              description: arg.description,
              Description: arg.Description,
              icon_name: arg.icon_name,
              IconName: arg.IconName,
              icon: arg.icon,
              Icon: arg.Icon,
              allKeys: Object.keys(arg)
            });
          });
        } else {
          console.warn('[HomePage] Argument section: argumentsList is empty!');
        }
      }
      
      return (
        <Arguments
          key={section.id || `argument-${index}`}
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
      
      // Debug en développement
      if (process.env.NODE_ENV === 'development') {
        console.log('[HomePage] Tool section data:', { 
          section, 
          toolTitle, 
          toolDescription,
          toolsList,
          toolsListLength: toolsList.length,
          componentType
        });
        // Log détaillé de chaque tool pour voir les champs disponibles
        toolsList.forEach((tool, idx) => {
          console.log(`[HomePage] Tool ${idx}:`, {
            tool,
            tool_name: tool.tool_name,
            name: tool.name,
            title: tool.title,
            icon_name: tool.icon_name,
            icon_pic: tool.icon_pic,
            allKeys: Object.keys(tool)
          });
        });
      }
      
      return (
        <TechStack
          key={section.id || `tool-${index}`}
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
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[HomePage] Unknown component type: ${componentType}`);
      }
      return null;
  }
}

export default async function Home() {
  // Récupérer les données de la homepage depuis Strapi
  let homepageData: { content_sections?: ContentSection[] } | null = null;
  
  try {
    homepageData = await getHomePage();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[HomePage] Failed to fetch homepage data:', error);
    }
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
            <FeaturedWork />
            <Trust />
          </>
        ) : (
          // Rendu dynamique depuis Strapi
          <>
            {contentSections.map((section, index) => renderSection(section, index))}
            {/* FeaturedWork est toujours affiché car il n'est pas dans la Dynamic Zone */}
            <FeaturedWork />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}