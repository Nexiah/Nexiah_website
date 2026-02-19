import { getGlobal, getCollection } from "@/lib/strapi";
import { Navbar } from "./Navbar";
import { StrapiMedia, StrapiNavigationItem } from "@/lib/types/strapi";
import { StrapiProject } from "@/lib/types/strapi";

// Interface pour les données de navigation
export interface NavigationLink {
  href: string;
  label: string;
}

// Interface pour les données globales
export interface GlobalData {
  siteName?: string;
  SiteName?: string;
  logo?: StrapiMedia;
  navigation?: NavigationLink[] | StrapiNavigationItem[] | any;
}

// Liens de navigation par défaut
const DEFAULT_NAVIGATION_LINKS: NavigationLink[] = [
  { href: "/", label: "Accueil" },
  { href: "#services", label: "Services" },
  { href: "/work", label: "Réalisations" },
  { href: "/about", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export async function NavbarServer() {
  // Récupérer les données globales
  let globalData: GlobalData | null = null;
  try {
    globalData = await getGlobal();
  } catch (error) {
    // Erreur silencieuse, utiliser fallback
  }

  // Extraire le siteName (gérer PascalCase et camelCase)
  const siteName = globalData?.siteName || globalData?.SiteName || "Nexiah";

  // Extraire le logo
  let logoUrl: string | null = null;
  if (globalData?.logo) {
    const logo = globalData.logo;
    // Gérer différentes structures Strapi
    if (logo.data?.attributes?.url) {
      logoUrl = logo.data.attributes.url;
    } else if (logo.attributes?.url) {
      logoUrl = logo.attributes.url;
    } else if (logo.url) {
      logoUrl = logo.url;
    }
  }

  // Extraire la navigation
  let navigationLinks: NavigationLink[] = DEFAULT_NAVIGATION_LINKS;
  if (globalData?.navigation) {
    const nav = globalData.navigation;
    
    // Si c'est un tableau de composants navigation
    if (Array.isArray(nav)) {
      navigationLinks = nav
        .map((item: StrapiNavigationItem) => {
          // Gérer différentes structures
          const href = item.href || item.Href || item.url || item.Url || '';
          const label = item.label || item.Label || item.name || item.Name || '';
          return { href, label };
        })
        .filter((link: NavigationLink) => link.href && link.label);
    }
    // Si c'est un champ JSON (structure Strapi ou custom)
    else if (typeof nav === "object" && nav !== null) {
      const navObj = nav as { links?: StrapiNavigationItem[]; items?: StrapiNavigationItem[] };
      if (Array.isArray(navObj.links) || Array.isArray(navObj.items)) {
        const links = navObj.links ?? navObj.items ?? [];
        navigationLinks = links
          .map((item: StrapiNavigationItem) => ({
            href: item.href || item.url || '',
            label: item.label || item.name || '',
          }))
          .filter((link: NavigationLink) => link.href && link.label);
      }
    }
    
    // Si aucune navigation valide n'a été extraite, utiliser les valeurs par défaut
    if (navigationLinks.length === 0) {
      navigationLinks = DEFAULT_NAVIGATION_LINKS;
    }
  }

  // Masquer le lien "Réalisations" s'il n'y a aucun projet
  let hasProjects = false;
  try {
    const projectsResponse = await getCollection<StrapiProject>("projects", {
      limit: 1,
    });
    hasProjects =
      Boolean(projectsResponse?.data) &&
      Array.isArray(projectsResponse.data) &&
      projectsResponse.data.length > 0;
  } catch {
    // Erreur silencieuse, on garde le lien
  }
  if (!hasProjects) {
    navigationLinks = navigationLinks.filter(
      (link) => link.href !== "/work" && link.href !== "/work/"
    );
  }

  return (
    <Navbar
      siteName={siteName}
      logoUrl={logoUrl}
      navigationLinks={navigationLinks}
    />
  );
}
