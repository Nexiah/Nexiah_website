import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientHydrationFix } from "@/components/ClientHydrationFix";
import { getGlobal } from "@/lib/strapi";
import { formatImageUrl } from "@/lib/strapi";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Récupération des données globales pour les métadonnées
async function getGlobalData() {
  try {
    const globalData = await getGlobal();
    return globalData;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  // Valeurs par défaut
  const defaultTitle = "Nexiah - Application Web & Automatisation Business";
  const defaultDescription = "Je construis votre Application Web et j'automatise votre Business. Plus qu'un développeur, je transforme votre vision en outils performants.";
  
  let globalData = null;
  try {
    globalData = await getGlobalData();
  } catch (error) {
    // En cas d'erreur, utiliser les valeurs par défaut
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Layout] Failed to fetch Global data for metadata:', error);
    }
  }
  
  // Extraire le siteName (gérer PascalCase et camelCase)
  const siteName = globalData?.siteName || globalData?.SiteName || "Nexiah";
  const title = siteName !== "Nexiah" ? `${siteName} - Application Web & Automatisation Business` : defaultTitle;
  
  // Extraire le favicon
  let faviconUrl: string | undefined;
  if (globalData?.favicon) {
    try {
      const favicon = globalData.favicon;
      // Gérer différentes structures Strapi
      if (favicon.data?.attributes?.url) {
        faviconUrl = formatImageUrl(favicon.data.attributes.url);
      } else if (favicon.attributes?.url) {
        faviconUrl = formatImageUrl(favicon.attributes.url);
      } else if (favicon.url) {
        faviconUrl = formatImageUrl(favicon.url);
      }
    } catch (error) {
      // Ignorer les erreurs de formatage d'image
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Layout] Failed to format favicon URL:', error);
      }
    }
  }
  
  const metadata: Metadata = {
    title: title,
    description: defaultDescription,
  };
  
  // Ajouter l'icône si disponible
  if (faviconUrl) {
    metadata.icons = {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    };
  }
  
  return metadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientHydrationFix />
        {children}
      </body>
    </html>
  );
}
