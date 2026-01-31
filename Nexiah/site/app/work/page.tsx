import { ProjectGrid, Project } from "@/components/ui/project-grid";
import { NavbarServer } from "@/components/sections/NavbarServer";
import { Footer } from "@/components/layout/Footer";
import { getCollection } from "@/lib/strapi";
import { StrapiProject } from "@/lib/types/strapi";

// Fallback data si Strapi n'est pas disponible
const FALLBACK_PROJECTS: Project[] = [
  {
    title: "SaaS Dashboard",
    description: "Tableau de bord analytique pour une startup SaaS avec intégration temps réel.",
    slug: "saas-dashboard",
  },
  {
    title: "E-commerce Auto",
    description: "Plateforme e-commerce complète pour un concessionnaire automobile avec gestion de stock.",
    slug: "ecommerce-auto",
  },
  {
    title: "Refonte Corporate",
    description: "Refonte complète du site web d'une entreprise avec migration vers Next.js et Strapi.",
    slug: "refonte-corporate",
  },
];

interface StrapiProject {
  id: number;
  documentId?: string;
  Title: string;
  Slug: string;
  Summary?: string;
  Description?: string;
  Category?: string;
  Cover?: {
    id: number;
    url: string;
    alternativeText?: string | null;
    name?: string;
  };
  // Format alternatif avec attributes (si Strapi v4 standard)
  attributes?: {
    title: string;
    slug: string;
    summary?: string;
    description?: string;
    cover?: {
      data?: {
        attributes?: {
          url: string;
          alternativeText?: string;
        };
      };
    };
  };
}

export default async function WorkPage() {
  let projects: Project[] = FALLBACK_PROJECTS;
  let errorMessage: string | null = null;

  try {
    // Essayer d'abord avec populate=* seulement (format le plus simple)
    let response = await getCollection<StrapiProject>('projects', {
      populate: '*',
    });
    
    // Si ça échoue, essayer sans populate
    if (!response) {
      response = await getCollection<StrapiProject>('projects');
    }

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      projects = response.data.map((item) => {
        // Vérifier la structure de l'item
        const itemData = (item as StrapiProject).attributes || item;

        // Gérer les deux formats : PascalCase (direct) ou camelCase (attributes)
        const title = itemData.Title || itemData.title || 'Sans titre';
        const slug = itemData.Slug || itemData.slug || '';
        const description = itemData.Description || itemData.description;
        const summary = itemData.Summary || itemData.summary;
        
        // Gérer la structure de l'image Cover
        let cover = null;
        if (itemData.Cover) {
          // Format direct : Cover est un objet avec url directement accessible
          const coverUrl = itemData.Cover.url || '';
          const coverAlt = itemData.Cover.alternativeText || itemData.Cover.name || '';
          
          // Créer la structure attendue par ProjectGrid
          if (coverUrl) {
            cover = {
              data: {
                attributes: {
                  url: coverUrl,
                  alternativeText: coverAlt,
                },
              },
            };
          }
        } else if (itemData.cover) {
          // Format standard Strapi v4
          cover = itemData.cover;
        }

        return {
          title,
          slug,
          description,
          summary,
          cover,
        };
      });
    } else {
      errorMessage = response === null 
        ? 'Impossible de se connecter à Strapi. Vérifiez que le serveur est démarré.'
        : response?.data?.length === 0
        ? 'Aucun projet trouvé dans Strapi.'
        : 'Structure de données inattendue depuis Strapi.';
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de la récupération des projets.';
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="h-16"></div>
      <NavbarServer />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
            Mes Réalisations
          </h1>
          <p className="text-lg text-muted-foreground">
            Une sélection de projets web et d&apos;automatisations.
          </p>
        </div>

        {projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <p className="text-lg font-semibold text-foreground mb-2">
                {errorMessage ? 'Erreur de chargement' : 'Aucun projet disponible'}
              </p>
              <p className="text-muted-foreground mb-4">
                {errorMessage || 'Les projets sont en cours de chargement...'}
              </p>
              {errorMessage && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-left">
                  <p className="text-sm text-muted-foreground">
                    <strong>Détails:</strong> {errorMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Vérifiez la console du serveur pour plus de détails.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
