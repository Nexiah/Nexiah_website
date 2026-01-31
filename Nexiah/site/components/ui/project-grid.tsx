"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { formatImageUrl } from "@/lib/strapi";
import { StrapiMedia } from "@/lib/types/strapi";

export interface Project {
  title: string;
  description?: string;
  summary?: string;
  slug?: string;
  cover?: StrapiMedia;
}

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {projects.map((project, index) => {
        // Utiliser slug comme key stable, fallback sur title + index
        const stableKey = project.slug || `project-${project.title.replace(/\s+/g, '-').slice(0, 30)}-${index}`;
        
        return (
          <motion.div
            key={stableKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className="h-full border border-border bg-white hover:shadow-lg transition-shadow overflow-hidden">
              {/* Cover Image */}
              {(() => {
                // Extraire l'URL de l'image en gérant différentes structures
                let imageUrl: string | null = null;
                let imageAlt: string | undefined;

              if (project.cover) {
                const cover = project.cover;
                
                // Cas 1: cover.data.attributes.url (structure standard Strapi)
                if (cover.data?.attributes?.url) {
                  imageUrl = cover.data.attributes.url;
                  imageAlt = cover.data.attributes.alternativeText || undefined;
                }
                // Cas 2: cover.attributes.url (si pas de data)
                else if (cover.attributes?.url) {
                  imageUrl = cover.attributes.url;
                  imageAlt = cover.attributes.alternativeText || undefined;
                }
                // Cas 3: cover.url (structure plate)
                else if (cover.url) {
                  imageUrl = cover.url;
                  imageAlt = cover.alternativeText || undefined;
                }
              }

                const formattedUrl = imageUrl ? formatImageUrl(imageUrl) : null;
                const isLocalhost = formattedUrl?.includes('localhost') ?? false;

                if (!formattedUrl) {
                  return (
                    <div className="bg-muted aspect-video w-full flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Pas d&apos;image</span>
                    </div>
                  );
                }

                // Pour localhost, utiliser img standard directement (évite l'hydratation)
                if (isLocalhost) {
                  return (
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={formattedUrl}
                        alt={imageAlt || project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  );
                }

                // Pour les autres URLs, utiliser next/image
                return (
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={formattedUrl}
                      alt={imageAlt || project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              })()}
              
              <CardHeader>
                <CardTitle className="text-xl">
                  {project.slug ? (
                    <Link href={`/work/${project.slug}`} className="hover:text-primary transition-colors">
                      {project.title}
                    </Link>
                  ) : (
                    project.title
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {project.description || project.summary || ''}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
