import { NavbarServer } from "@/components/sections/NavbarServer";
import { Footer } from "@/components/layout/Footer";
import { AboutContent } from "./AboutContent";
import { getAbout } from "@/lib/strapi";

export default async function AboutPage() {
  // Récupérer les données depuis Strapi avec gestion d'erreur
  let aboutData = null;
  try {
    aboutData = await getAbout();
  } catch (error) {
    // Erreur silencieuse, utiliser fallback (null)
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16"></div>
      <NavbarServer />
      <AboutContent aboutData={aboutData} />
      <Footer />
    </div>
  );
}
