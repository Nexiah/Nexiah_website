import { getGlobal } from "@/lib/strapi";
import { Navbar } from "./Navbar";

// Interface pour les données de navigation
export interface NavigationLink {
  href: string;
  label: string;
}

// Interface pour les données globales
export interface GlobalData {
  siteName?: string;
  SiteName?: string;
  logo?: any;
  navigation?: NavigationLink[] | any;
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
    if (process.env.NODE_ENV === 'development') {
      console.warn('[NavbarServer] Failed to fetch Global data:', error);
    }
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
        .map((item: any) => {
          // Gérer différentes structures
          const href = item.href || item.Href || item.url || item.Url || '';
          const label = item.label || item.Label || item.name || item.Name || '';
          return { href, label };
        })
        .filter((link: NavigationLink) => link.href && link.label);
    }
    // Si c'est un champ JSON
    else if (typeof nav === 'object' && nav !== null) {
      if (Array.isArray(nav.links) || Array.isArray(nav.items)) {
        const links = nav.links || nav.items;
        navigationLinks = links
          .map((item: any) => ({
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

  return (
    <Navbar
      siteName={siteName}
      logoUrl={logoUrl}
      navigationLinks={navigationLinks}
    />
  );
}
