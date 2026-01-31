"use client";

import { motion } from "framer-motion";
import { ProjectGrid, Project } from "@/components/ui/project-grid";

interface FeaturedWorkProps {
  projects: Project[];
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {

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
