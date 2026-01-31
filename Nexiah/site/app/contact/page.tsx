import { NavbarServer } from "@/components/sections/NavbarServer";
import { Footer } from "@/components/layout/Footer";
import { ContactContent } from "./ContactContent";
import { getContact } from "@/lib/strapi";

export default async function ContactPage() {
  // Récupérer les données depuis Strapi avec gestion d'erreur
  let contactData = null;
  try {
    contactData = await getContact();
  } catch (error) {
    // Erreur silencieuse, utiliser fallback (null)
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16"></div>
      <NavbarServer />
      <ContactContent contactData={contactData} />
      <Footer />
    </div>
  );
}
