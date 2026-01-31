"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/forms/contact-form";

// Interface pour les données Contact depuis Strapi
interface ContactData {
  title?: string;
  description?: string;
  cal_booking_url?: string;
  show_calendar?: boolean;
}

interface ContactContentProps {
  contactData: ContactData | null;
}

export function ContactContent({ contactData }: ContactContentProps) {
  // Extraire les données avec fallbacks
  const title = contactData?.title || "Discutons de votre projet";
  const description = contactData?.description || "Remplissez le formulaire ci-dessous ou réservez directement un créneau dans mon agenda.";
  const calBookingUrl = contactData?.cal_booking_url;
  const showCalendar = contactData?.show_calendar !== false && calBookingUrl; // Afficher si show_calendar est true et cal_booking_url existe

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Grid 2 colonnes : Formulaire à gauche, Agenda à droite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Colonne Gauche : Formulaire de Contact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white border border-border rounded-lg p-8 shadow-sm"
        >
          <h2 className="text-2xl font-semibold mb-6">Envoyez-moi un message</h2>
          <ContactForm />
        </motion.div>

        {/* Colonne Droite : Agenda Cal.com */}
        {showCalendar && calBookingUrl && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full"
          >
            <h2 className="text-2xl font-semibold mb-6">Réservez un créneau</h2>
            <iframe
              src={calBookingUrl}
              className="w-full h-[37.5rem] rounded-2xl bg-muted/50 border-0"
              title="Cal.com Booking"
              loading="lazy"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
