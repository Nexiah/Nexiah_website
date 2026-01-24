"use client";

import { useEffect } from "react";

/**
 * Composant pour corriger les problèmes d'hydratation causés par les extensions de navigateur
 * Supprime les attributs ajoutés dynamiquement par les extensions (comme cz-shortcut-listen)
 */
export function ClientHydrationFix() {
  useEffect(() => {
    // Supprimer les attributs ajoutés par les extensions de navigateur qui causent des erreurs d'hydratation
    const body = document.body;
    if (body) {
      // Supprimer l'attribut cz-shortcut-listen ajouté par certaines extensions
      if (body.hasAttribute("cz-shortcut-listen")) {
        body.removeAttribute("cz-shortcut-listen");
      }
      
      // Supprimer d'autres attributs potentiellement ajoutés par des extensions
      const extensionAttributes = [
        "cz-shortcut-listen",
        "aria-controls", // Peut être ajouté par certaines extensions
      ];
      
      extensionAttributes.forEach((attr) => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    }
  }, []);

  return null;
}
