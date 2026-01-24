"use client";

import { motion } from "framer-motion";
import { ProjectGrid, Project } from "@/components/ui/project-grid";
import { useEffect, useState } from "react";

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
  attributes: {
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

export function FeaturedWork() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Utiliser l'API route Next.js au lieu d'appeler Strapi directement
        const response = await fetch(
          '/api/projects?populate=*&limit=3&sort=createdAt:desc',
          { cache: 'no-store' }
        );
        
        if (!response.ok) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[FeaturedWork] API returned ${response.status}, using fallback data`);
          }
          return; // Utiliser les données fallback
        }
        
        const data = await response.json();
        if (data?.data && data.data.length > 0) {
          // Gérer les deux formats : PascalCase direct ou attributes
          const mappedProjects = data.data.map((item: any) => {
            const itemData = item.attributes || item;
            return {
              title: itemData.Title || itemData.title || 'Sans titre',
              slug: itemData.Slug || itemData.slug || '',
              description: itemData.Description || itemData.description,
              summary: itemData.Summary || itemData.summary,
              cover: itemData.Cover || itemData.cover,
            };
          });
          setProjects(mappedProjects);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to fetch projects from API, using fallback data:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section id="realisations" className="w-full bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Dernières réalisations
          </motion.h2>
        </div>

        <ProjectGrid projects={projects} />
      </div>
    </section>
  );
}
