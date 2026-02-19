"use client";

import { motion } from "framer-motion";
import { Lock, CalendarCheck, Briefcase, LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ArgumentItem {
  title?: string;
  description?: string;
}

interface TrustProps {
  title?: string;
  arguments?: ArgumentItem[];
}

// Valeurs par défaut
const DEFAULT_ARGUMENTS = [
  {
    icon: Lock,
    title: "Propriété Totale",
    description: "Vous êtes propriétaire à 100% de votre code et de vos données. Aucun enfermement (Vendor lock-in).",
  },
  {
    icon: CalendarCheck,
    title: "Délais Garantis",
    description: "En tant que Product Builder, je m'engage sur des dates de livraison réalistes et respectées.",
  },
  {
    icon: Briefcase,
    title: "Approche Business",
    description: "Je ne parle pas que technique. Chaque ligne de code doit servir votre croissance et votre rentabilité.",
  },
];

const DEFAULT_TITLE = "Pourquoi choisir Nexiah ?";

export function Trust({ title, arguments: args }: TrustProps = {}) {
  const displayTitle = title || DEFAULT_TITLE;
  const displayArguments = args && args.length > 0
    ? args.map((arg, index) => ({
        icon: DEFAULT_ARGUMENTS[index % DEFAULT_ARGUMENTS.length].icon,
        title: arg.title || DEFAULT_ARGUMENTS[index % DEFAULT_ARGUMENTS.length].title,
        description: arg.description || DEFAULT_ARGUMENTS[index % DEFAULT_ARGUMENTS.length].description,
      }))
    : DEFAULT_ARGUMENTS;
  return (
    <section className="w-full bg-slate-50 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {displayTitle}
          </motion.h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {displayArguments.map((point, index) => {
            const Icon = point.icon;
            const pointKey = point.title ? `trust-${String(point.title).slice(0, 40)}-${index}` : `trust-${index}`;
            return (
              <motion.div
                key={pointKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border border-border bg-white hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{point.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {point.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
