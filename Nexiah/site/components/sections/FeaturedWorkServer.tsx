import { getCollection } from "@/lib/strapi";
import { StrapiProject } from "@/lib/types/strapi";
import { FeaturedWork } from "./FeaturedWork";
import { Project } from "@/components/ui/project-grid";

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

export async function FeaturedWorkServer() {
  let projects: Project[] = FALLBACK_PROJECTS;

  try {
    const response = await getCollection<StrapiProject>('projects', {
      populate: '*',
      limit: 3,
      sort: 'createdAt:desc',
    });

    if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
      projects = response.data.map((item) => {
        const itemData = (item as StrapiProject).attributes || item;
        return {
          title: (itemData as any).Title || (itemData as any).title || 'Sans titre',
          slug: (itemData as any).Slug || (itemData as any).slug || '',
          description: (itemData as any).Description || (itemData as any).description,
          summary: (itemData as any).Summary || (itemData as any).summary,
          cover: (itemData as any).Cover || (itemData as any).cover,
        };
      });
    }
  } catch (error) {
    // Erreur silencieuse, utiliser fallback
  }

  return <FeaturedWork projects={projects} />;
}
